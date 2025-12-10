/**
 * KYC Submission API
 * 
 * POST /api/kyc - Submit KYC documents
 * GET /api/kyc - Get KYC status
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'
import { withAudit } from '@/lib/middleware/audit'
import { prisma } from '@/lib/db'
import { EventEmitter } from '@/lib/events'
import { notificationQueue } from '@/lib/queues'

/**
 * GET /api/kyc
 * Get current user's KYC status
 */
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult
  const user = authResult
  
  try {
    const kyc = await prisma.kYC.findUnique({
      where: { userId: user.sub },
      select: {
        id: true,
        status: true,
        submittedAt: true,
        verifiedAt: true,
        rejectedAt: true,
        rejectionReason: true,
        documentType: true
        // Don't return actual document URLs for security
      }
    })
    
    return NextResponse.json({
      success: true,
      kyc: kyc || { status: 'not_submitted' }
    })
  } catch (error) {
    console.error('[KYC Get] Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KYC status' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/kyc
 * Submit KYC documents for verification
 */
export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult
  const user = authResult
  
  try {
    const { documentType, documentNumber, frontImageUrl, backImageUrl, selfieUrl } = await req.json()
    
    // Validate input
    if (!documentType || !documentNumber || !frontImageUrl || !selfieUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (!['aadhaar', 'pan', 'passport', 'driving_license'].includes(documentType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      )
    }
    
    // Check if already submitted
    const existing = await prisma.kYC.findUnique({
      where: { userId: user.sub }
    })
    
    if (existing && existing.status === 'verified') {
      return NextResponse.json(
        { success: false, error: 'KYC already verified' },
        { status: 400 }
      )
    }
    
    if (existing && existing.status === 'pending') {
      return NextResponse.json(
        { success: false, error: 'KYC verification in progress' },
        { status: 400 }
      )
    }
    
    // Create or update KYC record
    const kyc = await prisma.kYC.upsert({
      where: { userId: user.sub },
      create: {
        userId: user.sub,
        documentType,
        documentNumber,
        frontImageUrl,
        backImageUrl,
        selfieUrl,
        status: 'pending',
        submittedAt: new Date()
      },
      update: {
        documentType,
        documentNumber,
        frontImageUrl,
        backImageUrl,
        selfieUrl,
        status: 'pending',
        submittedAt: new Date(),
        rejectedAt: null,
        rejectionReason: null
      }
    })
    
    // Update user's KYC status
    await prisma.user.update({
      where: { id: user.sub },
      data: { kycStatus: 'pending' }
    })
    
    // Emit event for admin dashboard
    await EventEmitter.getInstance().emit('notify.push', {
      userId: 'admin',
      title: 'New KYC Submission',
      message: `User ${user.sub} submitted KYC for verification`,
      priority: 'medium',
      timestamp: new Date().toISOString()
    }, req.headers.get('x-request-id') || '')
    
    // Send confirmation to user
    await notificationQueue.add('notification', {
      userId: user.sub,
      templateKey: 'kyc_submitted',
      payload: {
        title: 'KYC Submitted',
        message: 'Your KYC documents have been submitted for verification. You will be notified once verified.',
        kycId: kyc.id
      },
      channel: 'push',
      priority: 'high'
    })
    
    // Audit log
    await withAudit(
      req,
      user.sub,
      'submit',
      'kyc',
      kyc.id,
      `Submitted ${documentType} for KYC verification`
    )
    
    return NextResponse.json({
      success: true,
      kyc: {
        id: kyc.id,
        status: kyc.status,
        submittedAt: kyc.submittedAt
      },
      message: 'KYC submitted successfully. Verification typically takes 24-48 hours.'
    })
  } catch (error) {
    console.error('[KYC Submit] Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to submit KYC' },
      { status: 500 }
    )
  }
}
