const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const razorpayService = require('../services/razorpay.service');
const { emitToUser } = require('../services/websocket.service');
const { sendPayoutProcessed } = require('../services/email.service');

/**
 * Request payout
 * POST /api/payouts/request
 */
router.post('/request', authenticate, async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount < 100) {
      throw new AppError('Minimum payout amount is ₹100', 400);
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet || wallet.balance < amount) {
      throw new AppError('Insufficient balance', 400);
    }

    // Check pending payouts
    const pendingPayouts = await prisma.payoutRequest.count({
      where: {
        userId,
        status: { in: ['PENDING', 'PROCESSING'] }
      }
    });

    if (pendingPayouts > 0) {
      throw new AppError('You already have a pending payout request', 400);
    }

    // Get or verify KYC
    const kyc = await prisma.kycProfile.findUnique({
      where: { userId }
    });

    if (!kyc || kyc.verificationStatus !== 'VERIFIED') {
      throw new AppError('KYC verification required for payouts', 403);
    }

    // Create payout request
    const payoutRequest = await prisma.$transaction(async (tx) => {
      // Hold amount in wallet
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: parseFloat(amount) },
          holdBalance: { increment: parseFloat(amount) }
        }
      });

      // Create payout request
      const request = await tx.payoutRequest.create({
        data: {
          userId,
          walletId: wallet.id,
          amount: parseFloat(amount),
          bankDetails: JSON.stringify(bankDetails),
          status: 'PENDING'
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } }
        }
      });

      // Create wallet transaction
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEBIT_PAYOUT',
          amount: parseFloat(amount),
          balanceBefore: wallet.balance,
          balanceAfter: wallet.balance - parseFloat(amount),
          description: 'Payout request created',
          metadata: JSON.stringify({ payoutRequestId: request.id }),
          status: 'pending'
        }
      });

      return request;
    });

    // Emit real-time update
    emitToUser(userId, 'payout:requested', payoutRequest);

    res.status(201).json(payoutRequest);
  } catch (error) {
    next(error);
  }
});

/**
 * Get payout requests (User)
 * GET /api/payouts
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      userId,
      ...(status && { status })
    };

    const [payouts, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.payoutRequest.count({ where })
    ]);

    res.json({
      data: payouts,
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
 * Get all payout requests (Admin)
 * GET /api/payouts/all
 */
router.get('/all', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(status && { status }),
      ...(search && {
        user: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } }
          ]
        }
      })
    };

    const [payouts, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.payoutRequest.count({ where })
    ]);

    res.json({
      data: payouts,
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
 * Process payout (Admin)
 * POST /api/payouts/:id/process
 */
router.post('/:id/process', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Get payout request
    const payoutRequest = await prisma.payoutRequest.findUnique({
      where: { id },
      include: {
        user: true,
        wallet: true
      }
    });

    if (!payoutRequest) {
      throw new AppError('Payout request not found', 404);
    }

    if (payoutRequest.status !== 'PENDING') {
      throw new AppError('Payout already processed or rejected', 400);
    }

    // Update status to processing
    await prisma.payoutRequest.update({
      where: { id },
      data: { status: 'PROCESSING' }
    });

    try {
      const bankDetails = JSON.parse(payoutRequest.bankDetails);

      // Create fund account in Razorpay
      const fundAccount = await razorpayService.createFundAccount({
        contactId: payoutRequest.user.razorpayContactId || undefined,
        accountType: 'bank_account',
        bankAccount: {
          name: bankDetails.accountHolderName,
          accountNumber: bankDetails.accountNumber,
          ifsc: bankDetails.ifscCode
        }
      });

      // Create payout
      const payout = await razorpayService.createPayout({
        fundAccountId: fundAccount.id,
        amount: payoutRequest.amount,
        currency: 'INR',
        mode: 'IMPS',
        purpose: 'payout',
        referenceId: id
      });

      // Update payout request
      const updated = await prisma.$transaction(async (tx) => {
        // Update payout request
        const updatedRequest = await tx.payoutRequest.update({
          where: { id },
          data: {
            status: 'PROCESSING',
            razorpayPayoutId: payout.id,
            razorpayFundAccountId: fundAccount.id,
            razorpayStatus: payout.status,
            processedAt: new Date(),
            processedBy: adminId
          },
          include: { user: true }
        });

        // Release hold amount
        await tx.wallet.update({
          where: { id: payoutRequest.walletId },
          data: {
            holdBalance: { decrement: parseFloat(payoutRequest.amount) },
            totalDebits: { increment: parseFloat(payoutRequest.amount) }
          }
        });

        // Update wallet transaction
        await tx.walletTransaction.updateMany({
          where: {
            walletId: payoutRequest.walletId,
            metadata: { contains: id }
          },
          data: { status: 'completed' }
        });

        return updatedRequest;
      });

      // Send email
      await sendPayoutProcessed(payoutRequest.user.email, {
        userName: payoutRequest.user.name,
        amount: payoutRequest.amount,
        accountNumber: bankDetails.accountNumber.slice(-4)
      });

      // Emit real-time update
      emitToUser(payoutRequest.userId, 'payout:processing', updated);

      res.json(updated);
    } catch (razorpayError) {
      // Revert to pending on error
      await prisma.payoutRequest.update({
        where: { id },
        data: {
          status: 'PENDING',
          failureReason: razorpayError.message
        }
      });

      throw razorpayError;
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Reject payout (Admin)
 * POST /api/payouts/:id/reject
 */
router.post('/:id/reject', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const payoutRequest = await prisma.payoutRequest.findUnique({
      where: { id },
      include: { wallet: true, user: true }
    });

    if (!payoutRequest) {
      throw new AppError('Payout request not found', 404);
    }

    if (payoutRequest.status !== 'PENDING') {
      throw new AppError('Payout already processed or rejected', 400);
    }

    // Reject and refund
    const updated = await prisma.$transaction(async (tx) => {
      // Update payout request
      const updatedRequest = await tx.payoutRequest.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
          processedAt: new Date(),
          processedBy: adminId
        }
      });

      // Refund to wallet
      await tx.wallet.update({
        where: { id: payoutRequest.walletId },
        data: {
          balance: { increment: parseFloat(payoutRequest.amount) },
          holdBalance: { decrement: parseFloat(payoutRequest.amount) }
        }
      });

      // Update wallet transaction
      await tx.walletTransaction.updateMany({
        where: {
          walletId: payoutRequest.walletId,
          metadata: { contains: id }
        },
        data: { status: 'failed' }
      });

      return updatedRequest;
    });

    // Emit real-time update
    emitToUser(payoutRequest.userId, 'payout:rejected', { id, reason });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * Cancel payout request (User)
 * POST /api/payouts/:id/cancel
 */
router.post('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payoutRequest = await prisma.payoutRequest.findUnique({
      where: { id },
      include: { wallet: true }
    });

    if (!payoutRequest) {
      throw new AppError('Payout request not found', 404);
    }

    if (payoutRequest.userId !== userId) {
      throw new AppError('Not authorized', 403);
    }

    if (payoutRequest.status !== 'PENDING') {
      throw new AppError('Cannot cancel payout in current status', 400);
    }

    // Cancel and refund
    const updated = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.payoutRequest.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      await tx.wallet.update({
        where: { id: payoutRequest.walletId },
        data: {
          balance: { increment: parseFloat(payoutRequest.amount) },
          holdBalance: { decrement: parseFloat(payoutRequest.amount) }
        }
      });

      await tx.walletTransaction.updateMany({
        where: {
          walletId: payoutRequest.walletId,
          metadata: { contains: id }
        },
        data: { status: 'cancelled' }
      });

      return updatedRequest;
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
