import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const bundles = await db.tokenBundle.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    })
    
    return NextResponse.json({ bundles })
  } catch (error) {
    console.error('Token bundles fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch token bundles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, price, tokens, freeTokens } = await request.json()
    
    if (!name || !price || !tokens) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const bundle = await db.tokenBundle.create({
      data: {
        name,
        price,
        tokens,
        freeTokens: freeTokens || 0,
        totalTokens: tokens + (freeTokens || 0)
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      bundle,
      message: 'Token bundle created successfully'
    })
  } catch (error) {
    console.error('Token bundle creation error:', error)
    return NextResponse.json({ error: 'Failed to create token bundle' }, { status: 500 })
  }
}