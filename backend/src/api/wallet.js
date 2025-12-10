const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { emitToUser } = require('../services/websocket.service');

/**
 * Get wallet details
 * GET /api/wallet
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    res.json(wallet);
  } catch (error) {
    next(error);
  }
});

/**
 * Get wallet transactions
 * GET /api/wallet/transactions
 */
router.get('/transactions', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, status, page = 1, limit = 20 } = req.query;

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      walletId: wallet.id,
      ...(type && { type }),
      ...(status && { status })
    };

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.walletTransaction.count({ where })
    ]);

    res.json({
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get wallet statistics
 * GET /api/wallet/stats
 */
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          }
        }
      }
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    // Calculate stats
    const stats = {
      balance: parseFloat(wallet.balance),
      holdBalance: parseFloat(wallet.holdBalance),
      totalCredits: parseFloat(wallet.totalCredits),
      totalDebits: parseFloat(wallet.totalDebits),
      last30Days: {
        credits: wallet.transactions
          .filter(t => t.type.startsWith('CREDIT'))
          .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        debits: wallet.transactions
          .filter(t => t.type.startsWith('DEBIT'))
          .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        transactionCount: wallet.transactions.length
      }
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
