import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp, name, email } = await request.json()
    
    if (!mobile || !otp) {
      return NextResponse.json({ error: 'Mobile number and OTP required' }, { status: 400 })
    }
    
    // Validate OTP (for demo, accept '1234')
    if (otp !== '1234') {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
    
    // Find or create user
    let user = await db.user.findUnique({
      where: { mobile },
      include: {
        wallet: true
      }
    })
    
    if (!user) {
      // Create new user if doesn't exist
      user = await db.user.create({
        data: {
          mobile,
          name: name || `User_${mobile.slice(-4)}`,
          email: email || null
        },
        include: {
          wallet: true
        }
      })
    } else if (name || email) {
      // Update existing user with new info if provided
      user = await db.user.update({
        where: { mobile },
        data: {
          ...(name && { name }),
          ...(email && { email })
        },
        include: {
          wallet: true
        }
      })
    }
    
    // Create wallet if doesn't exist
    if (!user.wallet) {
      await db.wallet.create({
        data: {
          userId: user.id,
          tokens: 0
        }
      })
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        mobile: user.mobile,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        email: user.email
      }
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })
    
    return response
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}