/**
 * Admin KYC Verification API
 * 
 * POST /api/admin/kyc/:id/verify - Approve KYC
 * POST /api/admin/kyc/:id/reject - Reject KYC
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'
import { withAudit } from '@/lib/middleware/audit'
import { prisma } from '@/lib/db'
import { EventEmitter } from '@/lib/events'
import { notificationQueue } from '@/lib/queues'

/**
 * POST /api/admin/kyc/:id/verify
 * Approve user's KYC submission
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Only admins and moderators can verify KYC
  const authResult = await requireAuth(req, ['admin', 'moderator'])
  if (authResult instanceof NextResponse) return authResult
  const admin = authResult
  
  try {
    const { action, rejectionReason } = await req.json()
    const kycId = params.id
    
    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be approve or reject' },
        { status: 400 }
      )
    }
    
    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason required' },
        { status: 400 }
      )
    }
    
    // Fetch KYC record
    const kyc = await prisma.kYC.findUnique({
      where: { id: kycId },
      include: { user: true }
    })
    
    if (!kyc) {
      return NextResponse.json(
        { success: false, error: 'KYC record not found' },
        { status: 404 }
      )
    }
    
    if (kyc.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'KYC already processed' },
        { status: 400 }
      )
    }
    
    // Update KYC and user status
    const result = await prisma.$transaction(async (tx) => {
      const updatedKyc = await tx.kYC.update({
        where: { id: kycId },
        data: {
          status: action === 'approve' ? 'verified' : 'rejected',
          verifiedAt: action === 'approve' ? new Date() : null,
          rejectedAt: action === 'reject' ? new Date() : null,
          rejectionReason: action === 'reject' ? rejectionReason : null,
          verifiedBy: action === 'approve' ? admin.sub : null
        }
      })
      
      await tx.user.update({
        where: { id: kyc.userId },
        data: {
          kycStatus: action === 'approve' ? 'verified' : 'rejected'
        }
      })
      
      return updatedKyc
    })
    
    // Emit user event
    await EventEmitter.getInstance().emit('user.blocked', {
      userId: kyc.userId,
      kycStatus: action === 'approve' ? 'verified' : 'rejected',
      timestamp: new Date().toISOString()
    }, req.headers.get('x-request-id') || '')
    
    // Send notification to user
    if (action === 'approve') {
      await notificationQueue.add('notification', {
        userId: kyc.userId,
        templateKey: 'kyc_approved',
        payload: {
          title: 'KYC Verified! 🎉',
          message: 'Your KYC has been verified. You can now access all features.',
          kycId
        },
        channel: 'push',
        priority: 'high'
      })
    } else {
      await notificationQueue.add('notification', {
        userId: kyc.userId,
        templateKey: 'kyc_rejected',
        payload: {
          title: 'KYC Rejected',
          message: `Your KYC was rejected. Reason: ${rejectionReason}`,
          kycId,
          reason: rejectionReason
        },
        channel: 'push',
        priority: 'high'
      })
    }
    
    // Audit log
    await withAudit(
      req,
      admin.sub,
      action === 'approve' ? 'verify' : 'reject',
      'kyc',
      kycId,
      action === 'approve' 
        ? `Verified KYC for user ${kyc.userId}`
        : `Rejected KYC: ${rejectionReason}`
    )
    
    return NextResponse.json({
      success: true,
      kyc: {
        id: result.id,
        status: result.status,
        verifiedAt: result.verifiedAt,
        rejectedAt: result.rejectedAt,
        rejectionReason: result.rejectionReason
      },
      message: action === 'approve' 
        ? 'KYC verified successfully'
        : 'KYC rejected successfully'
    })
  } catch (error) {
    console.error('[Admin KYC Verify] Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to process KYC' },
      { status: 500 }
    )
  }
}
