import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    let wallet = await db.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobile: true
          }
        }
      }
    })
    
    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await db.wallet.create({
        data: {
          userId,
          tokens: 0
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              mobile: true
            }
          }
        }
      })
    }
    
    return NextResponse.json({ wallet })
  } catch (error) {
    console.error('Wallet fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, tokens, type, description } = await request.json()
    
    if (!userId || !tokens || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get or create wallet
    let wallet = await db.wallet.findUnique({
      where: { userId }
    })
    
    if (!wallet) {
      wallet = await db.wallet.create({
        data: {
          userId,
          tokens: 0
        }
      })
    }
    
    // Update wallet tokens
    const newTokenCount = type === 'add' 
      ? wallet.tokens + tokens 
      : Math.max(0, wallet.tokens - tokens)
    
    await db.wallet.update({
      where: { userId },
      data: { tokens: newTokenCount }
    })
    
    // Create transaction record
    await db.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        type: type === 'add' ? 'purchase' : 'spend',
        amount: tokens,
        description: description || `${type === 'add' ? 'Added' : 'Spent'} ${tokens} tokens`
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      newBalance: newTokenCount,
      message: `Successfully ${type === 'add' ? 'added' : 'spent'} ${tokens} tokens`
    })
  } catch (error) {
    console.error('Wallet update error:', error)
    return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 })
  }
}