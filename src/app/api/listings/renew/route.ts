/**
 * Listing Renewal API
 * 
 * POST /api/listings/renew
 * Allows user to renew an expired/expiring listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'
import { withRateLimit } from '@/lib/middleware/rate-limit'
import { withAudit } from '@/lib/middleware/audit'
import { prisma } from '@/lib/db'
import { EventEmitter } from '@/lib/events'
import { notificationQueue } from '@/lib/queues'

export async function POST(req: NextRequest) {
  // Authentication required
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult
  const user = authResult
  
  // Rate limit: 10 renewals per day
  const rateLimitResult = await withRateLimit(req, 'listing', user.sub)
  if (rateLimitResult instanceof NextResponse) return rateLimitResult
  
  try {
    const { listingId, renewalDays } = await req.json()
    
    // Validate input
    if (!listingId || !renewalDays) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (![7, 14, 30].includes(renewalDays)) {
      return NextResponse.json(
        { success: false, error: 'Invalid renewal period. Must be 7, 14, or 30 days' },
        { status: 400 }
      )
    }
    
    // Fetch listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true }
    })
    
    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }
    
    // Verify ownership
    if (listing.userId !== user.sub) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    // Can only renew expired or expiring listings
    if (listing.status === 'active') {
      const daysUntilExpiry = Math.ceil(
        (new Date(listing.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      
      if (daysUntilExpiry > 7) {
        return NextResponse.json(
          { success: false, error: 'Can only renew listings within 7 days of expiry' },
          { status: 400 }
        )
      }
    }
    
    // Calculate renewal fee (free for basic, charged for featured)
    const renewalFee = listing.featured ? renewalDays * 10 : 0 // ₹10/day for featured
    
    // Check wallet balance if fee required
    if (renewalFee > 0) {
      const wallet = await prisma.wallet.findUnique({
        where: { userId: user.sub }
      })
      
      if (!wallet || wallet.balance < renewalFee) {
        return NextResponse.json(
          { success: false, error: 'Insufficient wallet balance' },
          { status: 402 }
        )
      }
    }
    
    // Process renewal in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct fee if applicable
      if (renewalFee > 0) {
        await tx.wallet.update({
          where: { userId: user.sub },
          data: { balance: { decrement: renewalFee } }
        })
        
        await tx.transaction.create({
          data: {
            userId: user.sub,
            type: 'renewal_fee',
            amount: renewalFee,
            status: 'completed',
            refId: listingId,
            metadata: { renewalDays }
          }
        })
      }
      
      // Extend expiry date
      const newExpiryDate = new Date()
      newExpiryDate.setDate(newExpiryDate.getDate() + renewalDays)
      
      const updatedListing = await tx.listing.update({
        where: { id: listingId },
        data: {
          status: 'active',
          expiresAt: newExpiryDate,
          reminderSent3d: false,
          reminderSent1d: false
        }
      })
      
      return updatedListing
    })
    
    // Emit real-time event
    await EventEmitter.getInstance().emit('listings.update', {
      listingId,
      userId: user.sub,
      status: 'active',
      expiresAt: result.expiresAt.toISOString(),
      timestamp: new Date().toISOString()
    }, req.headers.get('x-request-id') || '')
    
    // Send confirmation notification
    await notificationQueue.add('notification', {
      userId: user.sub,
      templateKey: 'listing_renewed',
      payload: {
        title: 'Listing Renewed',
        message: `Your listing has been renewed for ${renewalDays} days`,
        listingId,
        expiresAt: result.expiresAt.toISOString()
      },
      channel: 'push',
      priority: 'medium'
    })
    
    // Audit log
    await withAudit(
      req,
      user.sub,
      'renew',
      'listing',
      listingId,
      `Renewed listing for ${renewalDays} days (Fee: ₹${renewalFee})`
    )
    
    return NextResponse.json({
      success: true,
      listing: {
        id: result.id,
        status: result.status,
        expiresAt: result.expiresAt,
        renewalFee
      }
    })
  } catch (error) {
    console.error('[Listing Renewal] Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to renew listing' },
      { status: 500 }
    )
  }
}
