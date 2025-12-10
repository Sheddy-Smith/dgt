// src/app/api/wallet/refund/route.ts
// Admin API: Issue refund

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { EventEmitter, EventChannel } from '@/lib/events'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const idempotencyKey = request.headers.get('Idempotency-Key')

  if (!idempotencyKey) {
    return NextResponse.json(
      { code: 'E_VALIDATION', message: 'Idempotency-Key header required' },
      { status: 400 }
    )
  }
  
  try {
    // 1. Check if already processed (idempotency)
    const existingTxn = await prisma.transaction.findUnique({
      where: { idempotencyKey }
    })

    if (existingTxn) {
      return NextResponse.json({
        success: true,
        data: existingTxn,
        message: 'Already processed (idempotent)',
        requestId
      })
    }

    // 2. Authentication & Authorization
    const session = await getServerSession()
    if (!session || !['admin', 'finance'].includes(session.user.role)) {
      return NextResponse.json(
        { code: 'E_AUTH', message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 3. Get request body
    const { userId, amount, reason, refId } = await request.json()

    if (!userId || !amount || !reason || amount <= 0) {
      return NextResponse.json(
        { code: 'E_VALIDATION', message: 'userId, amount, reason required' },
        { status: 400 }
      )
    }

    // 4. Atomic transaction: Create refund + Update wallet
    const result = await prisma.$transaction(async (tx) => {
      // Get wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId }
      })

      if (!wallet) {
        throw new Error('Wallet not found')
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: 'refund',
          userId,
          amount,
          refId: refId || 'manual_refund',
          status: 'completed',
          gateway: 'internal',
          idempotencyKey,
          meta: {
            reason,
            processedBy: session.user.id,
            timestamp: new Date().toISOString()
          }
        }
      })

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount
          }
        }
      })

      return { transaction, wallet: updatedWallet }
    })

    // 5. Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'REFUND_ISSUED',
        entityType: 'transaction',
        entityId: result.transaction.id,
        userId: session.user.id,
        reason,
        metadata: {
          targetUserId: userId,
          amount,
          newBalance: result.wallet.balance
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        requestId
      }
    })

    // 6. Emit wallet update event
    const eventEmitter = EventEmitter.getInstance()
    await eventEmitter.emit(
      EventChannel.WALLET_UPDATE,
      {
        userId,
        balance: result.wallet.balance,
        txn: {
          id: result.transaction.id,
          type: 'refund',
          amount,
          status: 'completed'
        }
      },
      requestId
    )

    // 7. Queue notification + receipt
    await queueNotification({
      userId,
      templateKey: 'refund_processed',
      payload: {
        amount,
        reason,
        newBalance: result.wallet.balance,
        transactionId: result.transaction.id
      },
      channel: 'push',
      priority: 'high'
    })

    // 8. Update finance dashboard (async)
    await updateFinanceMetrics({ type: 'refund', amount })

    // 9. Return response
    return NextResponse.json({
      success: true,
      data: {
        transactionId: result.transaction.id,
        wallet: {
          balance: result.wallet.balance,
          userId
        }
      },
      requestId
    })

  } catch (error: any) {
    console.error('[Refund] Error', { requestId, error })
    
    return NextResponse.json(
      {
        code: 'E_SERVER_ERROR',
        message: error.message || 'Failed to process refund',
        requestId
      },
      { status: 500 }
    )
  }
}

async function queueNotification(data: any) {
  // BullMQ implementation
}

async function updateFinanceMetrics(data: any) {
  // Update finance analytics
}
