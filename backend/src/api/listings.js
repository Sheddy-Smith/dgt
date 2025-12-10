const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { emitListingUpdate, emitToUser, emitToAdmins } = require('../services/websocket.service');
const { sendListingApproved, sendExpiringReminder } = require('../services/email.service');

/**
 * Create new listing
 * POST /api/listings
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      categoryId,
      location,
      images,
      attributes,
      negotiable
    } = req.body;

    const userId = req.user.id;

    // Validate category
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category || !category.isActive) {
      throw new AppError('Invalid category', 400);
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        sellerId: userId,
        location: JSON.stringify(location),
        images: JSON.stringify(images),
        attributes: JSON.stringify(attributes),
        negotiable: negotiable || false,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
      },
      include: {
        category: true,
        seller: { select: { id: true, name: true, phone: true } }
      }
    });

    // Notify admins about new listing
    emitToAdmins('listing:new', listing);

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
});

/**
 * Get all listings with filters
 * GET /api/listings
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      categoryId,
      search,
      minPrice,
      maxPrice,
      location,
      status = 'ACTIVE',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {
      ...(categoryId && { categoryId }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } }
        ]
      }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } })
    };

    // Get listings
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: true,
          seller: { select: { id: true, name: true, phone: true } },
          _count: { select: { favorites: true } }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      }),
      prisma.listing.count({ where })
    ]);

    res.json({
      data: listings,
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
 * Get single listing
 * GET /api/listings/:id
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            phone: true,
            createdAt: true,
            _count: { select: { listings: true } }
          }
        },
        _count: { select: { favorites: true } }
      }
    });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    // Increment views
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json(listing);
  } catch (error) {
    next(error);
  }
});

/**
 * Update listing
 * PUT /api/listings/:id
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    if (listing.sellerId !== userId && req.user.role === 'USER') {
      throw new AppError('Not authorized to update this listing', 403);
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...req.body,
        ...(req.body.location && { location: JSON.stringify(req.body.location) }),
        ...(req.body.images && { images: JSON.stringify(req.body.images) }),
        ...(req.body.attributes && { attributes: JSON.stringify(req.body.attributes) })
      },
      include: {
        category: true,
        seller: { select: { id: true, name: true, phone: true } }
      }
    });

    // Emit real-time update
    emitListingUpdate(id, updated);

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * Delete listing
 * DELETE /api/listings/:id
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    if (listing.sellerId !== userId && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      throw new AppError('Not authorized to delete this listing', 403);
    }

    await prisma.listing.delete({
      where: { id }
    });

    // Emit deletion event
    emitListingUpdate(id, { deleted: true });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * Approve/Reject listing (Admin)
 * POST /api/listings/:id/review
 */
router.post('/:id/review', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      throw new AppError('Invalid action', 400);
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { seller: true }
    });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'ACTIVE' : 'REJECTED',
        ...(action === 'reject' && { rejectionReason: reason })
      }
    });

    // Send email notification
    if (action === 'approve') {
      await sendListingApproved(listing.seller.email, {
        userName: listing.seller.name,
        listingTitle: listing.title,
        listingUrl: `${process.env.FRONTEND_URL}/listing/${id}`
      });
    }

    // Emit real-time update
    emitToUser(listing.sellerId, `listing:${action}d`, updated);
    emitListingUpdate(id, updated);

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * Boost listing
 * POST /api/listings/:id/boost
 */
router.post('/:id/boost', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { planId } = req.body;
    const userId = req.user.id;

    // Get listing
    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    if (listing.sellerId !== userId) {
      throw new AppError('Not authorized', 403);
    }

    // Get boost plan
    const plan = await prisma.boostPlan.findUnique({
      where: { id: planId }
    });

    if (!plan || !plan.isActive) {
      throw new AppError('Invalid boost plan', 400);
    }

    // Check wallet balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (wallet.balance < plan.price) {
      throw new AppError('Insufficient wallet balance', 400);
    }

    // Process boost
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from wallet
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: parseFloat(plan.price) },
          totalDebits: { increment: parseFloat(plan.price) }
        }
      });

      // Create transaction
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEBIT_BOOST',
          amount: parseFloat(plan.price),
          balanceBefore: wallet.balance,
          balanceAfter: updatedWallet.balance,
          description: `Boost listing: ${listing.title}`,
          metadata: JSON.stringify({ listingId: id, planId }),
          status: 'completed'
        }
      });

      // Update listing
      const boostedUntil = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
      const updatedListing = await tx.listing.update({
        where: { id },
        data: {
          isBoosted: true,
          boostedUntil,
          boostCount: { increment: 1 }
        }
      });

      return { listing: updatedListing, wallet: updatedWallet };
    });

    // Emit real-time updates
    emitToUser(userId, 'wallet:updated', { balance: result.wallet.balance });
    emitListingUpdate(id, result.listing);

    res.json({
      message: 'Listing boosted successfully',
      listing: result.listing,
      balance: parseFloat(result.wallet.balance)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Mark listing as sold
 * POST /api/listings/:id/sold
 */
router.post('/:id/sold', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    if (listing.sellerId !== userId) {
      throw new AppError('Not authorized', 403);
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: { status: 'SOLD', soldAt: new Date() }
    });

    emitListingUpdate(id, updated);

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
