const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

/**
 * Create report
 * POST /api/reports
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { type, entityType, entityId, reason, evidence } = req.body;

    const report = await prisma.report.create({
      data: {
        reporterId: req.user.id,
        type,
        entityType,
        entityId,
        reason,
        evidence: JSON.stringify(evidence),
        status: 'PENDING'
      }
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

/**
 * Get all reports (Admin)
 * GET /api/reports
 */
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    const { 
      status, 
      type, 
      entityType,
      page = 1,
      limit = 20
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(status && { status }),
      ...(type && { type }),
      ...(entityType && { entityType })
    };

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: { id: true, name: true, phone: true }
          },
          assignedTo: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.report.count({ where })
    ]);

    res.json({
      data: reports,
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
 * Get single report (Admin)
 * GET /api/reports/:id
 */
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: true,
        assignedTo: true
      }
    });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
});

/**
 * Update report status (Admin)
 * PUT /api/reports/:id/status
 */
router.put('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    const updated = await prisma.report.update({
      where: { id },
      data: {
        status,
        ...(resolution && { resolution }),
        ...(status === 'RESOLVED' && { resolvedAt: new Date() })
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * Assign report (Admin)
 * PUT /api/reports/:id/assign
 */
router.put('/:id/assign', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignedToId } = req.body;

    const updated = await prisma.report.update({
      where: { id },
      data: { assignedToId }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
