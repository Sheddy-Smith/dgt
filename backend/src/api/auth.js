const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const emailService = require('../services/email.service');
const { logger } = require('../utils/logger');

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

/**
 * Generate OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to phone/email
 * POST /api/auth/send-otp
 */
router.post('/send-otp', otpLimiter, async (req, res, next) => {
  try {
    const { phone, email } = req.body;

    if (!phone && !email) {
      throw new AppError('Phone or email is required', 400);
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    const key = phone || email;
    otpStore.set(key, { otp, expiresAt });

    // Send OTP via email (in production, also send SMS)
    if (email) {
      await emailService.sendOTP(email, otp);
    }

    logger.info(`OTP sent to ${key}: ${otp}`); // Remove in production

    res.json({
      message: 'OTP sent successfully',
      expiresIn: 300 // seconds
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Verify OTP and login/register
 * POST /api/auth/verify-otp
 */
router.post('/verify-otp', authLimiter, async (req, res, next) => {
  try {
    const { phone, email, otp, name, deviceToken } = req.body;

    const key = phone || email;
    const stored = otpStore.get(key);

    if (!stored) {
      throw new AppError('OTP not found or expired', 400);
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      throw new AppError('OTP expired', 400);
    }

    if (stored.otp !== otp) {
      throw new AppError('Invalid OTP', 400);
    }

    // OTP verified, remove from store
    otpStore.delete(key);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: phone ? { phone } : { email }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          phone,
          email,
          name,
          phoneVerified: !!phone,
          emailVerified: !!email,
          deviceTokens: deviceToken ? JSON.stringify([deviceToken]) : null,
          wallet: {
            create: {
              balance: 0,
              holdBalance: 0
            }
          }
        },
        include: {
          wallet: true
        }
      });

      logger.info(`New user registered: ${user.id}`);
    } else {
      // Update existing user
      const deviceTokens = user.deviceTokens ? JSON.parse(user.deviceTokens) : [];
      if (deviceToken && !deviceTokens.includes(deviceToken)) {
        deviceTokens.push(deviceToken);
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: req.ip,
          deviceTokens: JSON.stringify(deviceTokens)
        },
        include: {
          wallet: true,
          kycProfile: true
        }
      });

      logger.info(`User logged in: ${user.id}`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        wallet: user.wallet,
        kycStatus: user.kycProfile?.status || 'PENDING'
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Refresh token
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('Invalid refresh token', 401);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

/**
 * Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res, next) => {
  try {
    const { deviceToken, userId } = req.body;

    if (userId && deviceToken) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (user && user.deviceTokens) {
        const tokens = JSON.parse(user.deviceTokens);
        const updated = tokens.filter(t => t !== deviceToken);

        await prisma.user.update({
          where: { id: userId },
          data: {
            deviceTokens: JSON.stringify(updated)
          }
        });
      }
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
