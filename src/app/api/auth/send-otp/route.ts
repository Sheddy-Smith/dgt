import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { mobile, name, email } = await request.json()
    
    if (!mobile) {
      return NextResponse.json({ error: 'Mobile number required' }, { status: 400 })
    }
    
    // Validate mobile number (basic validation for Indian numbers)
    const mobileRegex = /^[6-9]\d{9}$/
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 })
    }
    
    // Check if user exists
    let user = await db.user.findUnique({
      where: { mobile }
    })
    
    // Create user if doesn't exist
    if (!user) {
      user = await db.user.create({
        data: {
          mobile,
          name: name || `User_${mobile.slice(-4)}`,
          email: email || null
        }
      })
    } else if (name || email) {
      // Update existing user with new info if provided
      user = await db.user.update({
        where: { mobile },
        data: {
          ...(name && { name }),
          ...(email && { email })
        }
      })
    }
    
    // Generate OTP (for demo, using fixed OTP)
    const otp = '1234' // In production, use random 6-digit OTP
    
    // Store OTP in database (you might want to create a separate OTP table)
    // For now, we'll simulate it
    
    // Simulate sending OTP via TexGuru SMS service
    console.log(`Sending OTP ${otp} to ${mobile}`)
    
    // In production, you would integrate with TexGuru API
    // const response = await fetch('https://texguru.in/api/send-sms', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     mobile,
    //     message: `Your DGT verification code is: ${otp}. Valid for 10 minutes.`,
    //     sender: 'DGTIND'
    //   })
    // })
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      maskedMobile: `••••${mobile.slice(-4)}`,
      // For demo only, remove in production
      demoOTP: otp
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}