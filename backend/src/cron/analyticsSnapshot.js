const cron = require('node-cron');
const prisma = require('../config/database');
const logger = require('../utils/logger');

/**
 * Capture daily analytics snapshot
 * Runs daily at midnight
 */
const analyticsSnapshot = cron.schedule('0 0 * * *', async () => {
  try {
    logger.info('Running analyticsSnapshot cron job');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count active users (logged in last 24h)
    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: today
        }
      }
    });

    // Count new listings
    const newListings = await prisma.listing.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Calculate revenue
    const revenue = await prisma.walletTransaction.aggregate({
      where: {
        type: { in: ['DEBIT_BOOST', 'DEBIT_FEATURE'] },
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        status: 'completed'
      },
      _sum: {
        amount: true
      }
    });

    // Count payouts
    const payouts = await prisma.payoutRequest.count({
      where: {
        processedAt: {
          gte: today,
          lt: tomorrow
        },
        status: 'COMPLETED'
      }
    });

    // Save snapshot
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'daily_snapshot',
        eventData: JSON.stringify({
          date: today.toISOString(),
          activeUsers,
          newListings,
          revenue: parseFloat(revenue._sum.amount || 0),
          payouts
        }),
        timestamp: new Date()
      }
    });

    logger.info('Analytics snapshot saved', {
      activeUsers,
      newListings,
      revenue: revenue._sum.amount,
      payouts
    });
  } catch (error) {
    logger.error('Error in analyticsSnapshot cron:', error);
  }
});

module.exports = analyticsSnapshot;
