// src/lib/jobs/expiry-reminder.ts
// Background Job: Expiry reminders (runs hourly)

import { prisma } from '@/lib/db'
import { EventEmitter, EventChannel } from '@/lib/events'

export async function expiryReminderJob() {
  const requestId = `job-${Date.now()}`
  
  try {
    console.log('[Job] Starting expiry reminder scan', { requestId })

    // 1. Find listings expiring in 72 hours (T-3)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setHours(threeDaysFromNow.getHours() + 72)

    const expiringIn3Days = await prisma.listing.findMany({
      where: {
        status: 'active',
        expiryAt: {
          gte: new Date(),
          lte: threeDaysFromNow
        },
        reminderSent3d: false
      },
      include: { user: true }
    })

    // 2. Send 3-day reminders
    for (const listing of expiringIn3Days) {
      await queueNotification({
        userId: listing.userId,
        templateKey: 'listing_expiring_3d',
        payload: {
          listingTitle: listing.title,
          expiryAt: listing.expiryAt.toISOString(),
          renewLink: `/listings/${listing.id}/renew`
        },
        channel: 'push',
        priority: 'normal'
      })

      // Mark reminder sent
      await prisma.listing.update({
        where: { id: listing.id },
        data: { reminderSent3d: true }
      })
    }

    // 3. Find listings expiring in 24 hours (T-1)
    const oneDayFromNow = new Date()
    oneDayFromNow.setHours(oneDayFromNow.getHours() + 24)

    const expiringIn1Day = await prisma.listing.findMany({
      where: {
        status: 'active',
        expiryAt: {
          gte: new Date(),
          lte: oneDayFromNow
        },
        reminderSent1d: false
      },
      include: { user: true }
    })

    // 4. Send 1-day reminders
    for (const listing of expiringIn1Day) {
      await queueNotification({
        userId: listing.userId,
        templateKey: 'listing_expiring_1d',
        payload: {
          listingTitle: listing.title,
          expiryAt: listing.expiryAt.toISOString(),
          renewLink: `/listings/${listing.id}/renew`
        },
        channel: 'push',
        priority: 'high'
      })

      await prisma.listing.update({
        where: { id: listing.id },
        data: { reminderSent1d: true }
      })
    }

    // 5. Mark expired listings
    const expiredListings = await prisma.listing.updateMany({
      where: {
        status: 'active',
        expiryAt: {
          lt: new Date()
        }
      },
      data: {
        status: 'expired',
        expiredAt: new Date()
      }
    })

    // 6. Emit events for expired listings
    if (expiredListings.count > 0) {
      const expired = await prisma.listing.findMany({
        where: {
          status: 'expired',
          expiredAt: {
            gte: new Date(Date.now() - 60000) // Last minute
          }
        }
      })

      const eventEmitter = EventEmitter.getInstance()
      for (const listing of expired) {
        await eventEmitter.emit(
          EventChannel.LISTING_UPDATE,
          {
            id: listing.id,
            status: 'expired'
          },
          requestId
        )

        // Send expiry notification
        await queueNotification({
          userId: listing.userId,
          templateKey: 'listing_expired',
          payload: {
            listingTitle: listing.title,
            renewLink: `/listings/${listing.id}/renew`
          },
          channel: 'push',
          priority: 'high'
        })
      }
    }

    console.log('[Job] Expiry reminder complete', {
      requestId,
      reminders3d: expiringIn3Days.length,
      reminders1d: expiringIn1Day.length,
      expired: expiredListings.count
    })

  } catch (error) {
    console.error('[Job] Expiry reminder failed', { requestId, error })
  }
}

async function queueNotification(data: any) {
  // BullMQ implementation
  // await notificationQueue.add('send-notification', data)
}

// Schedule with cron
// import cron from 'node-cron'
// cron.schedule('0 * * * *', expiryReminderJob) // Every hour
