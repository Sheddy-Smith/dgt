/**
 * Queue Monitoring API
 * 
 * GET /api/admin/queues - Get queue stats
 * POST /api/admin/queues/:name/retry - Retry failed jobs
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'
import { getQueueStats, notificationQueue, searchQueue, analyticsQueue } from '@/lib/queues'

/**
 * GET /api/admin/queues
 * Returns stats for all queues
 */
export async function GET(req: NextRequest) {
  // Only admins can view queue stats
  const authResult = await requireAuth(req, ['admin', 'moderator'])
  if (authResult instanceof NextResponse) return authResult

  try {
    const stats = await getQueueStats()
    
    // Add additional queue info
    const queueInfo = {
      notifications: {
        ...stats.notifications,
        workers: 10,
        rateLimit: '100/s'
      },
      search: {
        ...stats.search,
        workers: 5,
        rateLimit: 'none'
      },
      analytics: {
        ...stats.analytics,
        workers: 3,
        rateLimit: 'none'
      }
    }
    
    return NextResponse.json({
      success: true,
      queues: queueInfo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Queue Monitor] Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch queue stats' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/queues/retry
 * Retry all failed jobs in specified queue
 */
export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req, ['admin'])
  if (authResult instanceof NextResponse) return authResult
  
  try {
    const { queueName } = await req.json()
    
    let queue
    if (queueName === 'notifications') {
      queue = notificationQueue
    } else if (queueName === 'search') {
      queue = searchQueue
    } else if (queueName === 'analytics') {
      queue = analyticsQueue
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid queue name' },
        { status: 400 }
      )
    }
    
    // Get all failed jobs
    const failedJobs = await queue.getFailed()
    
    // Retry each failed job
    for (const job of failedJobs) {
      await job.retry()
    }
    
    return NextResponse.json({
      success: true,
      retriedCount: failedJobs.length
    })
  } catch (error) {
    console.error('[Queue Retry] Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to retry jobs' },
      { status: 500 }
    )
  }
}
