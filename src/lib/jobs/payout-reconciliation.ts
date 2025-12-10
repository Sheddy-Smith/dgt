// src/lib/jobs/payout-reconciliation.ts
// Background Job: Payout reconciliation (runs daily)

import { prisma } from '@/lib/db'
import { EventEmitter, EventChannel } from '@/lib/events'

export async function payoutReconciliationJob() {
  const requestId = `job-${Date.now()}`
  
  try {
    console.log('[Job] Starting payout reconciliation', { requestId })

    // 1. Find pending payouts older than 15 minutes
    const fifteenMinutesAgo = new Date()
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15)

    const pendingPayouts = await prisma.payout.findMany({
      where: {
        status: 'pending',
        createdAt: {
          lt: fifteenMinutesAgo
        }
      },
      include: { user: true }
    })

    // 2. Query payment gateway for status
    for (const payout of pendingPayouts) {
      try {
        // Call gateway API to check status
        const gatewayStatus = await checkPayoutStatus(payout.gatewayId)

        if (gatewayStatus === 'completed') {
          // Update payout status
          await prisma.payout.update({
            where: { id: payout.id },
            data: {
              status: 'completed',
              completedAt: new Date()
            }
          })

          // Emit wallet update event
          const eventEmitter = EventEmitter.getInstance()
          await eventEmitter.emit(
            EventChannel.WALLET_UPDATE,
            {
              userId: payout.userId,
              balance: payout.user.wallet.balance,
              txn: {
                id: payout.id,
                type: 'payout',
                amount: payout.amount,
                status: 'completed'
              }
            },
            requestId
          )

          // Send success notification
          await queueNotification({
            userId: payout.userId,
            templateKey: 'payout_completed',
            payload: {
              amount: payout.amount,
              transactionId: payout.id
            },
            channel: 'push',
            priority: 'high'
          })

        } else if (gatewayStatus === 'failed') {
          // Mark as failed + refund to wallet
          await prisma.$transaction(async (tx) => {
            // Update payout status
            await tx.payout.update({
              where: { id: payout.id },
              data: {
                status: 'failed',
                failedAt: new Date(),
                failureReason: 'Gateway failure'
              }
            })

            // Refund to wallet
            await tx.wallet.update({
              where: { userId: payout.userId },
              data: {
                balance: {
                  increment: payout.amount
                }
              }
            })

            // Create refund transaction
            await tx.transaction.create({
              data: {
                type: 'refund',
                userId: payout.userId,
                amount: payout.amount,
                refId: payout.id,
                status: 'completed',
                gateway: 'internal',
                meta: {
                  reason: 'Payout failed - auto refund',
                  originalPayoutId: payout.id
                }
              }
            })
          })

          // Emit wallet update
          const eventEmitter = EventEmitter.getInstance()
          await eventEmitter.emit(
            EventChannel.WALLET_UPDATE,
            {
              userId: payout.userId,
              balance: payout.user.wallet.balance + payout.amount,
              txn: {
                id: payout.id,
                type: 'payout',
                amount: payout.amount,
                status: 'failed'
              }
            },
            requestId
          )

          // Send failure notification
          await queueNotification({
            userId: payout.userId,
            templateKey: 'payout_failed',
            payload: {
              amount: payout.amount,
              reason: 'Gateway failure - amount refunded to wallet'
            },
            channel: 'push',
            priority: 'high'
          })
        }

      } catch (error) {
        console.error('[Job] Failed to reconcile payout', { 
          payoutId: payout.id, 
          error 
        })
      }
    }

    // 3. Generate finance report
    await updateFinanceMetrics({
      type: 'daily_reconciliation',
      processed: pendingPayouts.length,
      timestamp: new Date()
    })

    console.log('[Job] Payout reconciliation complete', {
      requestId,
      processed: pendingPayouts.length
    })

  } catch (error) {
    console.error('[Job] Payout reconciliation failed', { requestId, error })
  }
}

async function checkPayoutStatus(gatewayId: string): Promise<string> {
  // Call Razorpay/Stripe API
  // const response = await razorpay.payouts.fetch(gatewayId)
  // return response.status
  return 'pending'
}

async function queueNotification(data: any) {
  // BullMQ implementation
}

async function updateFinanceMetrics(data: any) {
  // Update analytics
}

// Schedule with cron
// import cron from 'node-cron'
// cron.schedule('0 2 * * *', payoutReconciliationJob) // Daily at 2 AM
