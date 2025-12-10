const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * Get dashboard analytics (Admin)
 * GET /api/analytics/dashboard
 */
router.get('/dashboard', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get counts
    const [
      totalUsers,
      totalListings,
      activeListings,
      totalRevenue,
      monthlyRevenue,
      pendingPayouts,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.walletTransaction.aggregate({
        where: {
          type: { in: ['DEBIT_BOOST', 'DEBIT_FEATURE'] },
          status: 'completed'
        },
        _sum: { amount: true }
      }),
      prisma.walletTransaction.aggregate({
        where: {
          type: { in: ['DEBIT_BOOST', 'DEBIT_FEATURE'] },
          status: 'completed',
          createdAt: { gte: thirtyDaysAgo }
        },
        _sum: { amount: true }
      }),
      prisma.payoutRequest.count({
        where: { status: 'PENDING' }
      }),
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      })
    ]);

    res.json({
      users: {
        total: totalUsers,
        recent: recentUsers
      },
      listings: {
        total: totalListings,
        active: activeListings
      },
      revenue: {
        total: parseFloat(totalRevenue._sum.amount || 0),
        monthly: parseFloat(monthlyRevenue._sum.amount || 0)
      },
      payouts: {
        pending: pendingPayouts
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get revenue analytics
 * GET /api/analytics/revenue
 */
router.get('/revenue', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const transactions = await prisma.walletTransaction.findMany({
      where: {
        type: { in: ['DEBIT_BOOST', 'DEBIT_FEATURE', 'CREDIT_TOPUP'] },
        status: 'completed',
        createdAt: {
          gte: start,
          lte: end
        }
      },
      select: {
        amount: true,
        type: true,
        createdAt: true
      }
    });

    // Group by date
    const grouped = {};
    transactions.forEach(txn => {
      const date = txn.createdAt.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, revenue: 0, topups: 0 };
      }
      if (txn.type === 'CREDIT_TOPUP') {
        grouped[date].topups += parseFloat(txn.amount);
      } else {
        grouped[date].revenue += parseFloat(txn.amount);
      }
    });

    res.json(Object.values(grouped));
  } catch (error) {
    next(error);
  }
});

/**
 * Get user analytics
 * GET /api/analytics/users
 */
router.get('/users', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      usersByRole,
      usersByStatus,
      activeUsers
    ] = await Promise.all([
      prisma.user.groupBy({
        by: ['role'],
        _count: true
      }),
      prisma.user.groupBy({
        by: ['status'],
        _count: true
      }),
      prisma.user.count({
        where: {
          lastLoginAt: { gte: thirtyDaysAgo }
        }
      })
    ]);

    res.json({
      byRole: usersByRole,
      byStatus: usersByStatus,
      activeUsers
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get listing analytics
 * GET /api/analytics/listings
 */
router.get('/listings', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const [
      listingsByStatus,
      listingsByCategory,
      boostedListings
    ] = await Promise.all([
      prisma.listing.groupBy({
        by: ['status'],
        _count: true
      }),
      prisma.listing.groupBy({
        by: ['categoryId'],
        _count: true,
        orderBy: {
          _count: {
            categoryId: 'desc'
          }
        },
        take: 10
      }),
      prisma.listing.count({
        where: { isBoosted: true }
      })
    ]);

    // Get category names
    const categoryIds = listingsByCategory.map(c => c.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true }
    });

    const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

    const listingsByCategoryWithNames = listingsByCategory.map(c => ({
      category: categoryMap[c.categoryId] || 'Unknown',
      count: c._count
    }));

    res.json({
      byStatus: listingsByStatus,
      byCategory: listingsByCategoryWithNames,
      boosted: boostedListings
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Log analytics event
 * POST /api/analytics/event
 */
router.post('/event', async (req, res, next) => {
  try {
    const { eventType, eventData, metadata } = req.body;

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        eventData: JSON.stringify(eventData),
        metadata: metadata ? JSON.stringify(metadata) : null,
        timestamp: new Date()
      }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
