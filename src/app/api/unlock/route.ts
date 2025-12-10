import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { listingId, userId, tokensUsed = 1 } = await request.json()
    
    if (!listingId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Check if already unlocked
    const existingUnlock = await db.unlock.findUnique({
      where: {
        listingId_userId: {
          listingId,
          userId
        }
      }
    })
    
    if (existingUnlock) {
      return NextResponse.json({ 
        success: true, 
        alreadyUnlocked: true,
        message: 'Contact already unlocked'
      })
    }
    
    // Get user wallet
    const wallet = await db.wallet.findUnique({
      where: { userId }
    })
    
    if (!wallet || wallet.tokens < tokensUsed) {
      return NextResponse.json({ 
        error: 'Insufficient tokens', 
        required: tokensUsed,
        available: wallet?.tokens || 0
      }, { status: 400 })
    }
    
    // Get listing details
    const listing = await db.listing.findUnique({
      where: { id: listingId }
    })
    
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    
    // Start transaction
    await db.$transaction(async (tx) => {
      // Deduct tokens from wallet
      await tx.wallet.update({
        where: { userId },
        data: {
          tokens: {
            decrement: tokensUsed
          }
        }
      })
      
      // Create unlock record
      await tx.unlock.create({
        data: {
          listingId,
          userId,
          tokensUsed
        }
      })
      
      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type: 'spend',
          amount: tokensUsed,
          description: `Unlocked contact for ${listing.title}`,
          metadata: JSON.stringify({ listingId, listingTitle: listing.title })
        }
      })
    })
    
    return NextResponse.json({ 
      success: true, 
      contactNumber: listing.contactNumber,
      sellerName: listing.sellerName,
      tokensUsed,
      message: 'Contact unlocked successfully'
    })
  } catch (error) {
    console.error('Unlock error:', error)
    return NextResponse.json({ error: 'Failed to unlock contact' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const listingId = searchParams.get('listingId')
    
    if (!userId || !listingId) {
      return NextResponse.json({ error: 'User ID and Listing ID required' }, { status: 400 })
    }
    
    const unlock = await db.unlock.findUnique({
      where: {
        listingId_userId: {
          listingId,
          userId
        }
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            contactNumber: true,
            sellerName: true
          }
        }
      }
    })
    
    return NextResponse.json({ 
      isUnlocked: !!unlock,
      unlock: unlock ? {
        contactNumber: unlock.listing.contactNumber,
        sellerName: unlock.listing.sellerName,
        unlockedAt: unlock.createdAt
      } : null
    })
  } catch (error) {
    console.error('Unlock status check error:', error)
    return NextResponse.json({ error: 'Failed to check unlock status' }, { status: 500 })
  }
}