/**
 * Cron Job Scheduler
 * 
 * Manages all background scheduled tasks:
 * - Expiry reminders (hourly)
 * - Payout reconciliation (daily)
 * - Event outbox processing (every 5 min)
 * - Stale data cleanup (daily)
 */

import cron from 'node-cron'
import { expiryReminderJob } from './jobs/expiry-reminder'
import { payoutReconciliationJob } from './jobs/payout-reconciliation'
import { prisma } from './db'

export function startCronJobs() {
  console.log('[Cron] Starting scheduled jobs...')
  
  // ============================================
  // 1. Hourly: Expiry Reminders
  // ============================================
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Running expiry reminder job')
    try {
      await expiryReminderJob()
    } catch (error) {
      console.error('[Cron] Expiry reminder failed:', error)
    }
  })
  
  // ============================================
  // 2. Daily at 2 AM: Payout Reconciliation
  // ============================================
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cron] Running payout reconciliation')
    try {
      await payoutReconciliationJob()
    } catch (error) {
      console.error('[Cron] Payout reconciliation failed:', error)
    }
  })
  
  // ============================================
  // 3. Every 5 minutes: Event Outbox Processing
  // ============================================
  cron.schedule('*/5 * * * *', async () => {
    console.log('[Cron] Processing event outbox')
    try {
      await processEventOutbox()
    } catch (error) {
      console.error('[Cron] Event outbox processing failed:', error)
    }
  })
  
  // ============================================
  // 4. Daily at 3 AM: Cleanup Stale Data
  // ============================================
  cron.schedule('0 3 * * *', async () => {
    console.log('[Cron] Cleaning up stale data')
    try {
      await cleanupStaleData()
    } catch (error) {
      console.error('[Cron] Cleanup failed:', error)
    }
  })
  
  // ============================================
  // 5. Hourly: Generate Metrics Cache
  // ============================================
  cron.schedule('15 * * * *', async () => {
    console.log('[Cron] Generating metrics cache')
    try {
      await generateMetricsCache()
    } catch (error) {
      console.error('[Cron] Metrics cache generation failed:', error)
    }
  })
  
  // ============================================
  // 6. Daily at midnight: Reset rate limits
  // ============================================
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Resetting daily rate limits')
    try {
      await resetDailyRateLimits()
    } catch (error) {
      console.error('[Cron] Rate limit reset failed:', error)
    }
  })
  
  console.log('[Cron] ✓ All jobs scheduled')
}

// ============================================
// Job Implementations
// ============================================

/**
 * Process failed events from outbox table
 * Retry sending to Socket.IO clients
 */
async function processEventOutbox() {
  const failedEvents = await prisma.eventOutbox.findMany({
    where: {
      status: 'failed',
      attempts: { lt: 5 } // Max 5 retries
    },
    take: 100,
    orderBy: { createdAt: 'asc' }
  })
  
  for (const event of failedEvents) {
    try {
      const { EventEmitter } = await import('./events')
      const emitter = EventEmitter.getInstance()
      
      await emitter.emit(
        event.channel as any,
        event.payload as any,
        event.requestId
      )
      
      // Mark as sent
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: { status: 'sent', attempts: event.attempts + 1 }
      })
      
      console.log(`[Outbox] Retried event ${event.id}`)
    } catch (error) {
      // Increment attempt count
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: { attempts: event.attempts + 1 }
      })
      
      console.error(`[Outbox] Failed to retry event ${event.id}:`, error)
    }
  }
  
  console.log(`[Outbox] Processed ${failedEvents.length} failed events`)
}

/**
 * Cleanup old data to prevent bloat
 */
async function cleanupStaleData() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  
  // Delete old event outbox records
  const deletedOutbox = await prisma.eventOutbox.deleteMany({
    where: {
      createdAt: { lt: thirtyDaysAgo },
      status: 'sent'
    }
  })
  
  // Archive old audit logs
  const archivedAudits = await prisma.auditLog.deleteMany({
    where: {
      createdAt: { lt: ninetyDaysAgo }
    }
  })
  
  // Delete expired sessions
  const deletedSessions = await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  })
  
  // Soft delete old expired listings
  const expiredListings = await prisma.listing.updateMany({
    where: {
      status: 'expired',
      expiredAt: { lt: ninetyDaysAgo }
    },
    data: { deletedAt: new Date() }
  })
  
  console.log('[Cleanup] Stats:', {
    outbox: deletedOutbox.count,
    audits: archivedAudits.count,
    sessions: deletedSessions.count,
    listings: expiredListings.count
  })
}

/**
 * Pre-generate metrics for dashboard performance
 */
async function generateMetricsCache() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Count active listings
  const activeListings = await prisma.listing.count({
    where: { status: 'active' }
  })
  
  // Count new users (7 days)
  const newUsers7d = await prisma.user.count({
    where: { createdAt: { gte: last7Days } }
  })
  
  // GMV (30 days)
  const gmv30d = await prisma.transaction.aggregate({
    where: {
      type: 'purchase',
      createdAt: { gte: last30Days }
    },
    _sum: { amount: true }
  })
  
  // Revenue (30 days)
  const revenue30d = await prisma.transaction.aggregate({
    where: {
      type: 'commission',
      createdAt: { gte: last30Days }
    },
    _sum: { amount: true }
  })
  
  // Cache in Redis
  const Redis = (await import('ioredis')).default
  const redis = new Redis(process.env.REDIS_URL!)
  
  await redis.setex('metrics:cache', 3600, JSON.stringify({
    activeListings,
    newUsers7d,
    gmv30d: gmv30d._sum.amount || 0,
    revenue30d: revenue30d._sum.amount || 0,
    updatedAt: now.toISOString()
  }))
  
  console.log('[Metrics] Cache generated:', { activeListings, newUsers7d })
}

/**
 * Reset daily rate limits at midnight
 */
async function resetDailyRateLimits() {
  const Redis = (await import('ioredis')).default
  const redis = new Redis(process.env.REDIS_URL!)
  
  // Get all rate limit keys
  const keys = await redis.keys('rate-limit:listing:*')
  
  if (keys.length > 0) {
    await redis.del(...keys)
  }
  
  console.log(`[Rate Limit] Reset ${keys.length} daily limits`)
}
