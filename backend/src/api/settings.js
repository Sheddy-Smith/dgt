const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all settings (Admin)
 * GET /api/settings
 */
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { category } = req.query;

    const settings = await prisma.setting.findMany({
      where: {
        ...(category && { category })
      },
      orderBy: { category: 'asc' }
    });

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

/**
 * Get setting by key
 * GET /api/settings/:key
 */
router.get('/:key', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { key } = req.params;

    const setting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!setting) {
      throw new AppError('Setting not found', 404);
    }

    res.json(setting);
  } catch (error) {
    next(error);
  }
});

/**
 * Update setting
 * PUT /api/settings/:key
 */
router.put('/:key', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const updated = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
        type: typeof value,
        category: req.body.category || 'general'
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'SETTING_UPDATE',
        resourceType: 'Setting',
        resourceId: key,
        changes: JSON.stringify({ value })
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * Bulk update settings
 * POST /api/settings/bulk
 */
router.post('/bulk', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { settings } = req.body;

    const operations = settings.map(({ key, value, category }) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          type: typeof value,
          category: category || 'general'
        }
      })
    );

    await prisma.$transaction(operations);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'SETTINGS_BULK_UPDATE',
        resourceType: 'Setting',
        resourceId: 'bulk',
        changes: JSON.stringify({ count: settings.length })
      }
    });

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
