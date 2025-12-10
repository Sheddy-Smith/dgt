// src/app/api/listings/[id]/reject/route.ts
// Admin API: Reject listing

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

    // 2. Get request body (reason is required)
    const { reason } = await request.json()
    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { code: 'E_VALIDATION', message: 'Rejection reason required (min 10 chars)' },
        { status: 400 }
      )
    }

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

    // 4. Update listing status
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        status: 'rejected',
        updatedAt: new Date()
      }
    })

    // 5. Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'LISTING_REJECTED',
        entityType: 'listing',
        entityId: listing.id,
        userId: session.user.id,
        reason,
        metadata: {
          previousStatus: 'pending',
          newStatus: 'rejected'
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
        status: 'rejected',
        reason
      },
      requestId
    )

    // 7. Queue notification with rejection reason
    await queueNotification({
      userId: listing.userId,
      templateKey: 'listing_rejected',
      payload: {
        listingTitle: listing.title,
        reason
      },
      channel: 'push',
      priority: 'high'
    })

    // 8. Return response
    return NextResponse.json({
      success: true,
      data: {
        id: updatedListing.id,
        status: updatedListing.status
      },
      requestId
    })

  } catch (error: any) {
    console.error('[Reject Listing] Error', { requestId, error })
    
    return NextResponse.json(
      {
        code: 'E_SERVER_ERROR',
        message: 'Failed to reject listing',
        requestId
      },
      { status: 500 }
    )
  }
}

async function queueNotification(data: any) {
  // BullMQ implementation
}
