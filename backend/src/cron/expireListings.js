const cron = require('node-cron');
const prisma = require('../config/database');
const logger = require('../utils/logger');

/**
 * Expire listings that have passed their expiry date
 * Runs every hour
 */
const expireListings = cron.schedule('0 * * * *', async () => {
  try {
    logger.info('Running expireListings cron job');

    const now = new Date();

    // Expire active listings past their expiry date
    const result = await prisma.listing.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lt: now
        }
      },
      data: {
        status: 'EXPIRED'
      }
    });

    logger.info(`Expired ${result.count} listings`);

    // Also expire boosted listings
    await prisma.listing.updateMany({
      where: {
        isBoosted: true,
        boostedUntil: {
          lt: now
        }
      },
      data: {
        isBoosted: false
      }
    });

  } catch (error) {
    logger.error('Error in expireListings cron:', error);
  }
});

module.exports = expireListings;
