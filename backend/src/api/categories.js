const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

/**
 * Get all categories
 * GET /api/categories
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { includeInactive = false } = req.query;

    const categories = await prisma.category.findMany({
      where: {
        ...(includeInactive === 'false' && { isActive: true })
      },
      orderBy: [
        { parentId: 'asc' },
        { order: 'asc' },
        { name: 'asc' }
      ],
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        _count: { select: { listings: true } }
      }
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * Get category tree
 * GET /api/categories/tree
 */
router.get('/tree', async (req, res, next) => {
  try {
    // Get root categories with their subcategories
    const rootCategories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true
      },
      orderBy: { order: 'asc' },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            _count: { select: { listings: true } }
          }
        },
        _count: { select: { listings: true } }
      }
    });

    res.json(rootCategories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
