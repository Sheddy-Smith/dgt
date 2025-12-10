import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { listingId, userId } = await request.json()
    
    if (!listingId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get listing
    const listing = await db.listing.findUnique({
      where: { id: listingId }
    })
    
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    
    // Check if user owns the listing
    if (listing.userId !== userId) {
      return NextResponse.json({ error: 'Only listing owner can verify' }, { status: 403 })
    }
    
    // Check if already verified
    if (listing.isVerified) {
      return NextResponse.json({ 
        success: true, 
        alreadyVerified: true,
        message: 'Listing already verified'
      })
    }
    
    // Get user wallet
    const wallet = await db.wallet.findUnique({
      where: { userId }
    })
    
    if (!wallet || wallet.tokens < 1) {
      return NextResponse.json({ 
        error: 'Insufficient tokens', 
        required: 1,
        available: wallet?.tokens || 0
      }, { status: 400 })
    }
    
    // Start transaction
    await db.$transaction(async (tx) => {
      // Deduct 1 token from wallet
      await tx.wallet.update({
        where: { userId },
        data: {
          tokens: {
            decrement: 1
          }
        }
      })
      
      // Update listing verification
      await tx.listing.update({
        where: { id: listingId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          expiresAt: null // Remove expiry for verified listings
        }
      })
      
      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type: 'spend',
          amount: 1,
          description: `Verified listing: ${listing.title}`,
          metadata: JSON.stringify({ listingId, listingTitle: listing.title, action: 'verify' })
        }
      })
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Listing verified successfully',
      verifiedAt: new Date()
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Failed to verify listing' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')
    const userId = searchParams.get('userId')
    
    if (!listingId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get listing
    const listing = await db.listing.findUnique({
      where: { id: listingId }
    })
    
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    
    // Check if user owns the listing or is admin (simplified)
    if (listing.userId !== userId) {
      return NextResponse.json({ error: 'Only listing owner can unverify' }, { status: 403 })
    }
    
    // Update listing to remove verification
    await db.listing.update({
      where: { id: listingId },
      data: {
        isVerified: false,
        verifiedAt: null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Listing verification removed'
    })
  } catch (error) {
    console.error('Unverification error:', error)
    return NextResponse.json({ error: 'Failed to unverify listing' }, { status: 500 })
  }
}