const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all banners
 * GET /api/banners
 */
router.get('/', async (req, res, next) => {
  try {
    const { type, isActive = true } = req.query;

    const banners = await prisma.banner.findMany({
      where: {
        ...(type && { type }),
        ...(isActive !== undefined && { isActive: isActive === 'true' })
      },
      orderBy: { displayOrder: 'asc' }
    });

    res.json(banners);
  } catch (error) {
    next(error);
  }
});

/**
 * Get single banner
 * GET /api/banners/:id
 */
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!banner) {
      throw new AppError('Banner not found', 404);
    }

    res.json(banner);
  } catch (error) {
    next(error);
  }
});

/**
 * Create banner (Admin)
 * POST /api/banners
 */
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { type, title, imageUrl, link, displayOrder, isActive } = req.body;

    const banner = await prisma.banner.create({
      data: {
        type,
        title,
        imageUrl,
        link,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
});

/**
 * Update banner (Admin)
 * PUT /api/banners/:id
 */
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.update({
      where: { id },
      data: req.body
    });

    res.json(banner);
  } catch (error) {
    next(error);
  }
});

/**
 * Delete banner (Admin)
 * DELETE /api/banners/:id
 */
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.banner.delete({
      where: { id }
    });

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
