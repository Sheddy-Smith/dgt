const cron = require('node-cron');
const prisma = require('../config/database');
const logger = require('../utils/logger');
const { sendExpiringReminder } = require('../services/email.service');

/**
 * Send reminders for listings expiring soon
 * Runs daily at 9 AM
 */
const expiringReminders = cron.schedule('0 9 * * *', async () => {
  try {
    logger.info('Running expiringReminders cron job');

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringListings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: new Date(),
          lte: threeDaysFromNow
        }
      },
      include: {
        seller: true
      }
    });

    for (const listing of expiringListings) {
      try {
        await sendExpiringReminder(listing.seller.email, {
          userName: listing.seller.name,
          listingTitle: listing.title,
          expiryDate: listing.expiresAt.toLocaleDateString(),
          renewUrl: `${process.env.FRONTEND_URL}/listing/${listing.id}/renew`
        });

        // Create notification
        await prisma.notification.create({
          data: {
            userId: listing.sellerId,
            title: 'Listing Expiring Soon',
            message: `Your listing "${listing.title}" will expire on ${listing.expiresAt.toLocaleDateString()}`,
            type: 'listing_expiring',
            metadata: JSON.stringify({ listingId: listing.id })
          }
        });
      } catch (error) {
        logger.error(`Error sending reminder for listing ${listing.id}:`, error);
      }
    }

    logger.info(`Sent ${expiringListings.length} expiring reminders`);
  } catch (error) {
    logger.error('Error in expiringReminders cron:', error);
  }
});

module.exports = expiringReminders;
