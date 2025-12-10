const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const razorpayService = require('../services/razorpay.service');
const { emitToUser, emitToAdmins } = require('../services/websocket.service');

/**
 * Create Razorpay order for wallet top-up
 * POST /api/payments/order
 */
router.post('/order', authenticate, async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount < 1) {
      throw new AppError('Invalid amount', 400);
    }

    // Create Razorpay order
    const order = await razorpayService.createOrder({
      amount,
      currency: 'INR',
      receipt: `topup_${userId}_${Date.now()}`,
      notes: {
        userId,
        type: 'wallet_topup'
      }
    });

    res.json({
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Verify payment and credit wallet
 * POST /api/payments/verify
 */
router.post('/verify', authenticate, async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const userId = req.user.id;

    // Verify signature
    const isValid = razorpayService.verifyPaymentSignature({ orderId, paymentId, signature });

    if (!isValid) {
      throw new AppError('Invalid payment signature', 400);
    }

    // Get payment details
    const payment = await razorpayService.getPayment(paymentId);

    if (payment.status !== 'captured') {
      throw new AppError('Payment not captured', 400);
    }

    const amount = payment.amount / 100;

    // Credit wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    const updatedWallet = await prisma.$transaction(async (tx) => {
      // Update wallet
      const updated = await tx.wallet.update({
        where: { userId },
        data: {
          balance: { increment: amount },
          totalCredits: { increment: amount }
        }
      });

      // Create transaction record
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'CREDIT_TOPUP',
          amount,
          balanceBefore: wallet.balance,
          balanceAfter: updated.balance,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          paymentMethod: payment.method,
          paymentStatus: 'completed',
          description: 'Wallet top-up',
          status: 'completed'
        }
      });

      return updated;
    });

    // Emit real-time update
    emitToUser(userId, 'wallet:updated', { balance: updatedWallet.balance });

    res.json({
      message: 'Payment verified and wallet credited',
      balance: parseFloat(updatedWallet.balance)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create refund
 * POST /api/payments/refund
 */
router.post('/refund', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), async (req, res, next) => {
  try {
    const { transactionId, amount, reason } = req.body;

    // Get transaction
    const transaction = await prisma.walletTransaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true }
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    if (!transaction.razorpayPaymentId) {
      throw new AppError('No payment ID associated with this transaction', 400);
    }

    // Create refund
    const refund = await razorpayService.createRefund({
      paymentId: transaction.razorpayPaymentId,
      amount: amount || undefined, // Full or partial refund
      notes: {
        reason,
        transactionId,
        adminId: req.user.id
      }
    });

    const refundAmount = refund.amount / 100;

    // Update wallet
    const updatedWallet = await prisma.$transaction(async (tx) => {
      const updated = await tx.wallet.update({
        where: { id: transaction.walletId },
        data: {
          balance: { increment: refundAmount },
          totalCredits: { increment: refundAmount }
        }
      });

      // Create refund transaction
      await tx.walletTransaction.create({
        data: {
          walletId: transaction.walletId,
          type: 'CREDIT_REFUND',
          amount: refundAmount,
          balanceBefore: transaction.wallet.balance,
          balanceAfter: updated.balance,
          razorpayRefundId: refund.id,
          description: `Refund: ${reason || 'Admin initiated'}`,
          metadata: JSON.stringify({ originalTransactionId: transactionId }),
          status: 'completed'
        }
      });

      return updated;
    });

    // Emit real-time update
    emitToUser(transaction.wallet.userId, 'wallet:refunded', {
      amount: refundAmount,
      balance: updatedWallet.balance
    });

    res.json({
      message: 'Refund processed successfully',
      refundId: refund.id,
      amount: refundAmount
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Razorpay webhook handler
 * POST /api/payments/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    // Verify webhook signature
    const isValid = razorpayService.verifyWebhookSignature(body, signature);

    if (!isValid) {
      throw new AppError('Invalid webhook signature', 400);
    }

    const event = body.event;
    const payload = body.payload;

    // Handle webhook event
    const result = await razorpayService.handleWebhook(event, payload);

    // Additional processing based on event type
    if (event === 'payment.captured') {
      // Payment captured successfully
      // This is already handled in /verify endpoint
    } else if (event === 'payment.failed') {
      // Handle failed payment
      const orderId = payload.payment.entity.order_id;
      // Log or notify about failed payment
    } else if (event === 'refund.processed') {
      // Refund processed
      // Already handled in wallet update logic
    } else if (event.startsWith('payout.')) {
      // Handle payout status updates
      const payoutId = payload.payout.entity.id;
      const status = payload.payout.entity.status;

      // Update payout request status
      await prisma.payoutRequest.updateMany({
        where: { razorpayPayoutId: payoutId },
        data: {
          razorpayStatus: status,
          ...(status === 'processed' && { status: 'COMPLETED', processedAt: new Date() }),
          ...(status === 'failed' && { status: 'FAILED' })
        }
      });
    }

    res.json({ status: 'ok', event: result.event });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
