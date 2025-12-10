const Razorpay = require('razorpay');
const crypto = require('crypto');
const { logger } = require('../utils/logger');

// Initialize Razorpay (only if credentials are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  logger.info('✅ Razorpay initialized');
} else {
  logger.warn('⚠️ Razorpay credentials not found - payment features disabled');
}

class RazorpayService {
  /**
   * Create Razorpay order for payment
   */
  async createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
    if (!razorpay) {
      throw new Error('Razorpay not configured');
    }
    
    try {
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt,
        notes
      });

      logger.info(`Razorpay order created: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Razorpay order creation failed:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature
   */
  verifyPaymentSignature({ orderId, paymentId, signature }) {
    try {
      const text = `${orderId}|${paymentId}`;
      const generated = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      return generated === signature;
    } catch (error) {
      logger.error('Payment signature verification failed:', error);
      return false;
    }
  }

  /**
   * Fetch payment details
   */
  async getPayment(paymentId) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      logger.error(`Failed to fetch payment ${paymentId}:`, error);
      throw error;
    }
  }

  /**
   * Create refund
   */
  async createRefund({ paymentId, amount, notes = {} }) {
    try {
      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
        notes
      });

      logger.info(`Refund created: ${refund.id} for payment ${paymentId}`);
      return refund;
    } catch (error) {
      logger.error('Refund creation failed:', error);
      throw error;
    }
  }

  /**
   * Fetch refund details
   */
  async getRefund(refundId) {
    try {
      const refund = await razorpay.refunds.fetch(refundId);
      return refund;
    } catch (error) {
      logger.error(`Failed to fetch refund ${refundId}:`, error);
      throw error;
    }
  }

  /**
   * Create payout (for seller withdrawals)
   */
  async createPayout({ accountNumber, ifsc, amount, currency = 'INR', mode = 'NEFT', purpose = 'payout', notes = {} }) {
    try {
      const payout = await razorpay.payouts.create({
        account_number: accountNumber || process.env.RAZORPAY_ACCOUNT_NUMBER,
        fund_account_id: null, // Can create fund account separately
        amount: Math.round(amount * 100),
        currency,
        mode,
        purpose,
        queue_if_low_balance: true,
        reference_id: notes.reference_id || `payout_${Date.now()}`,
        narration: notes.narration || 'Marketplace Payout',
        notes
      });

      logger.info(`Payout created: ${payout.id}`);
      return payout;
    } catch (error) {
      logger.error('Payout creation failed:', error);
      throw error;
    }
  }

  /**
   * Create fund account for payout
   */
  async createFundAccount({ userId, name, accountNumber, ifsc, vpa }) {
    try {
      const contact = await razorpay.contacts.create({
        name,
        email: null,
        contact: userId,
        type: 'vendor',
        reference_id: `user_${userId}`,
        notes: { userId }
      });

      const fundAccount = await razorpay.fundAccounts.create({
        contact_id: contact.id,
        account_type: vpa ? 'vpa' : 'bank_account',
        ...(vpa ? {
          vpa: { address: vpa }
        } : {
          bank_account: {
            name,
            ifsc,
            account_number: accountNumber
          }
        })
      });

      logger.info(`Fund account created: ${fundAccount.id} for user ${userId}`);
      return fundAccount;
    } catch (error) {
      logger.error('Fund account creation failed:', error);
      throw error;
    }
  }

  /**
   * Get payout details
   */
  async getPayout(payoutId) {
    try {
      const payout = await razorpay.payouts.fetch(payoutId);
      return payout;
    } catch (error) {
      logger.error(`Failed to fetch payout ${payoutId}:`, error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(event, payload) {
    try {
      logger.info(`Processing webhook: ${event}`);

      switch (event) {
        case 'payment.captured':
          // Handle successful payment
          return { event, status: 'processed', data: payload.payment };

        case 'payment.failed':
          // Handle failed payment
          return { event, status: 'processed', data: payload.payment };

        case 'order.paid':
          // Handle order payment
          return { event, status: 'processed', data: payload.order };

        case 'refund.created':
        case 'refund.processed':
          // Handle refund
          return { event, status: 'processed', data: payload.refund };

        case 'payout.processed':
        case 'payout.reversed':
        case 'payout.failed':
          // Handle payout status
          return { event, status: 'processed', data: payload.payout };

        default:
          logger.warn(`Unhandled webhook event: ${event}`);
          return { event, status: 'unhandled' };
      }
    } catch (error) {
      logger.error(`Webhook processing failed for ${event}:`, error);
      throw error;
    }
  }
}

module.exports = new RazorpayService();
