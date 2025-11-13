import { NextResponse } from 'next/server'

// Legacy endpoint removed. Use /login with phone+PIN.
export async function POST() {
  return NextResponse.json(
    { error: 'OTP login removed. Use /login with phone + PIN.' },
    { status: 410 }
  )
}