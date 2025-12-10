const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email transporter verification failed:', error);
  } else {
    logger.info('✅ Email service ready');
  }
});

class EmailService {
  /**
   * Send email
   */
  async sendEmail({ to, subject, text, html, attachments = [] }) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'DGT Marketplace <noreply@dgt.com>',
        to,
        subject,
        text,
        html,
        attachments
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  /**
   * Send OTP email
   */
  async sendOTP(email, otp) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">DGT Marketplace - OTP Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Your OTP for DGT Marketplace',
      html
    });
  }

  /**
   * Send listing approval notification
   */
  async sendListingApproved(email, listingTitle) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">✅ Listing Approved!</h2>
        <p>Great news! Your listing has been approved and is now live on DGT Marketplace.</p>
        <p><strong>Listing:</strong> ${listingTitle}</p>
        <p>Your listing is now visible to thousands of buyers. Good luck with your sale!</p>
        <a href="${process.env.APP_URL}/my-listings" style="display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px;">View My Listings</a>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Your Listing is Now Live!',
      html
    });
  }

  /**
   * Send payout processed notification
   */
  async sendPayoutProcessed(email, amount) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">💰 Payout Processed</h2>
        <p>Your payout request has been successfully processed.</p>
        <p><strong>Amount:</strong> ₹${amount.toFixed(2)}</p>
        <p>The amount will be credited to your bank account within 2-3 business days.</p>
        <a href="${process.env.APP_URL}/wallet" style="display: inline-block; background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px;">View Wallet</a>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Payout Processed Successfully',
      html
    });
  }

  /**
   * Send listing expiring soon reminder
   */
  async sendExpiringReminder(email, listingTitle, daysLeft) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF9800;">⏰ Listing Expiring Soon</h2>
        <p>Your listing will expire in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}.</p>
        <p><strong>Listing:</strong> ${listingTitle}</p>
        <p>Renew your listing to keep it active and visible to buyers.</p>
        <a href="${process.env.APP_URL}/my-listings" style="display: inline-block; background: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Renew Now</a>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Listing Expiring in ${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'}`,
      html
    });
  }
}

module.exports = new EmailService();
