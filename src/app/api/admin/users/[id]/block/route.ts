// src/app/api/admin/users/[id]/block/route.ts
// Admin API: Block user

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
    const { reason, duration, cascadeListings = true } = await request.json()

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { code: 'E_VALIDATION', message: 'Block reason required (min 10 chars)' },
        { status: 400 }
      )
    }

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json(
        { code: 'E_VALIDATION', message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.status === 'blocked') {
      return NextResponse.json(
        { code: 'E_CONFLICT', message: 'User already blocked' },
        { status: 409 }
      )
    }

    // 4. Calculate block until date
    let blockUntil: Date | null = null
    if (duration) {
      blockUntil = new Date()
      blockUntil.setDate(blockUntil.getDate() + duration)
    }

    // 5. Atomic transaction: Block user + Cascade actions
    const result = await prisma.$transaction(async (tx) => {
      // Update user status
      const updatedUser = await tx.user.update({
        where: { id: params.id },
        data: {
          status: 'blocked',
          blockedAt: new Date(),
          blockUntil,
          blockReason: reason
        }
      })

      // Cascade: Hide all active listings (optional)
      let hiddenListings = 0
      if (cascadeListings) {
        const result = await tx.listing.updateMany({
          where: {
            userId: params.id,
            status: 'active'
          },
          data: {
            status: 'expired' // or 'hidden'
          }
        })
        hiddenListings = result.count
      }

      // Invalidate all user sessions
      await tx.session.deleteMany({
        where: { userId: params.id }
      })

      return { user: updatedUser, hiddenListings }
    })

    // 6. Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_BLOCKED',
        entityType: 'user',
        entityId: params.id,
        userId: session.user.id,
        reason,
        metadata: {
          duration,
          blockUntil: blockUntil?.toISOString(),
          cascadedListings: result.hiddenListings
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        requestId
      }
    })

    // 7. Emit user blocked event (force logout)
    const eventEmitter = EventEmitter.getInstance()
    await eventEmitter.emit(
      EventChannel.USER_BLOCKED,
      {
        userId: params.id,
        reason,
        until: blockUntil || undefined
      },
      requestId
    )

    // 8. Queue notification
    await queueNotification({
      userId: params.id,
      templateKey: 'account_blocked',
      payload: {
        reason,
        blockUntil: blockUntil?.toISOString(),
        supportContact: 'support@dgt.com'
      },
      channel: 'push',
      priority: 'high'
    })

    // 9. Return response
    return NextResponse.json({
      success: true,
      data: {
        userId: result.user.id,
        status: result.user.status,
        blockUntil: result.user.blockUntil,
        cascadedListings: result.hiddenListings
      },
      requestId
    })

  } catch (error: any) {
    console.error('[Block User] Error', { requestId, error })
    
    return NextResponse.json(
      {
        code: 'E_SERVER_ERROR',
        message: 'Failed to block user',
        requestId
      },
      { status: 500 }
    )
  }
}

async function queueNotification(data: any) {
  // BullMQ implementation
}
