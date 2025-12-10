// src/app/api/listings/[id]/approve/route.ts
// Admin API: Approve listing

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { EventEmitter, EventChannel } from '@/lib/events'
import { getServerSession } from 'next-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = crypto.randomUUID()
  
  try {
    // 1. Authentication & Authorization
    const session = await getServerSession()
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json(
        { code: 'E_AUTH', message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Get request body
    const { reason, expiryDays = 30 } = await request.json()

    // 3. Find listing
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!listing) {
      return NextResponse.json(
        { code: 'E_VALIDATION', message: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.status !== 'pending') {
      return NextResponse.json(
        { code: 'E_CONFLICT', message: 'Listing is not pending approval' },
        { status: 409 }
      )
    }

    // 4. Update listing status (atomic transaction)
    const expiryAt = new Date()
    expiryAt.setDate(expiryAt.getDate() + expiryDays)

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        status: 'active',
        expiryAt,
        updatedAt: new Date()
      }
    })

    // 5. Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'LISTING_APPROVED',
        entityType: 'listing',
        entityId: listing.id,
        userId: session.user.id,
        reason: reason || 'Approved by moderator',
        metadata: {
          previousStatus: 'pending',
          newStatus: 'active',
          expiryAt: expiryAt.toISOString()
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        requestId
      }
    })

    // 6. Emit real-time event
    const eventEmitter = EventEmitter.getInstance()
    await eventEmitter.emit(
      EventChannel.LISTING_UPDATE,
      {
        id: listing.id,
        status: 'active',
        expiryAt
      },
      requestId
    )

    // 7. Queue notification job
    await queueNotification({
      userId: listing.userId,
      templateKey: 'listing_approved',
      payload: {
        listingTitle: listing.title,
        expiryAt: expiryAt.toISOString()
      },
      channel: 'push',
      priority: 'high'
    })

    // 8. Queue search index update
    await queueSearchIndexUpdate({
      listingId: listing.id,
      action: 'upsert'
    })

    // 9. Return response
    return NextResponse.json({
      success: true,
      data: {
        id: updatedListing.id,
        status: updatedListing.status,
        expiryAt: updatedListing.expiryAt
      },
      requestId
    })

  } catch (error: any) {
    console.error('[Approve Listing] Error', { requestId, error })
    
    return NextResponse.json(
      {
        code: 'E_SERVER_ERROR',
        message: 'Failed to approve listing',
        requestId
      },
      { status: 500 }
    )
  }
}

// Helper: Queue notification
async function queueNotification(data: any) {
  // Add to BullMQ queue
  // await notificationQueue.add('send-notification', data, {
  //   attempts: 3,
  //   backoff: { type: 'exponential', delay: 2000 }
  // })
}

// Helper: Queue search index update
async function queueSearchIndexUpdate(data: any) {
  // await searchQueue.add('index-listing', data)
}
