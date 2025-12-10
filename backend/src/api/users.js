const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const bcrypt = require('bcryptjs');

/**
 * Get all users (Admin)
 * GET /api/users
 */
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    const { 
      search, 
      role, 
      status, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } }
        ]
      }),
      ...(role && { role }),
      ...(status && { status })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              listings: true,
              reports: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      data: users,
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
 * Get single user (Admin)
 * GET /api/users/:id
 */
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        kycProfile: true,
        wallet: true,
        _count: {
          select: {
            listings: true,
            payoutRequests: true,
            reports: true,
            notifications: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * Update user status (Admin)
 * PUT /api/users/:id/status
 */
router.put('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'USER_STATUS_UPDATE',
        resourceType: 'User',
        resourceId: id,
        changes: JSON.stringify({ status, reason })
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * Update user role (Admin)
 * PUT /api/users/:id/role
 */
router.put('/:id/role', authenticate, authorize('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN', 'MODERATOR', 'FINANCE'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'USER_ROLE_UPDATE',
        resourceType: 'User',
        resourceId: id,
        changes: JSON.stringify({ role })
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * Get current user profile
 * GET /api/users/me
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        wallet: true,
        kycProfile: true
      }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * Update current user profile
 * PUT /api/users/me
 */
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email })
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
