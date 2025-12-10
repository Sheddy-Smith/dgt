import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/refunds - Get refund requests with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (type && type !== 'all') {
      where.type = type
    }

    const [refunds, total] = await Promise.all([
      prisma.refundRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.refundRequest.count({ where }),
    ])

    const formattedRefunds = refunds.map(refund => ({
      id: refund.id,
      type: refund.type,
      userId: refund.userId,
      userName: refund.user.name,
      userPhone: refund.user.phone,
      amount: refund.amount,
      linkedListing: refund.listingId,
      listingTitle: refund.listing?.title,
      reason: refund.reason,
      date: refund.createdAt,
      status: refund.status,
      autoRefund: refund.autoRefund,
    }))

    return NextResponse.json({
      success: true,
      data: formattedRefunds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching refunds:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/refunds - Process refund (approve/reject)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refundId, action, adminId, notes } = body

    if (!refundId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const refund = await prisma.refundRequest.findUnique({
      where: { id: refundId },
      include: {
        user: true,
        wallet: true,
      },
    })

    if (!refund) {
      return NextResponse.json(
        { success: false, error: 'Refund request not found' },
        { status: 404 }
      )
    }

    if (refund.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Refund already processed' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Update refund status
      await prisma.refundRequest.update({
        where: { id: refundId },
        data: {
          status: 'approved',
          processedBy: adminId,
          processedAt: new Date(),
          notes,
        },
      })

      // Credit wallet
      await prisma.wallet.update({
        where: { id: refund.walletId },
        data: {
          balance: { increment: refund.amount },
        },
      })

      // Create transaction record
      await prisma.walletTransaction.create({
        data: {
          walletId: refund.walletId,
          type: 'refund',
          amount: refund.amount,
          description: `Refund: ${refund.reason}`,
          gateway: 'internal',
          refId: refundId,
          status: 'success',
          metadata: {
            refundType: refund.type,
            listingId: refund.listingId,
            processedBy: adminId,
            notes,
          },
        },
      })

      // Update listing if applicable
      if (refund.listingId) {
        await prisma.listing.update({
          where: { id: refund.listingId },
          data: { refunded: true },
        })
      }

      // Send push notification
      // await sendPushNotification(refund.userId, {
      //   title: 'Refund Processed',
      //   body: `₹${refund.amount} has been credited to your wallet.`,
      // })

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          action: 'REFUND_APPROVE',
          adminId,
          targetType: 'refund',
          targetId: refundId,
          details: {
            userId: refund.userId,
            amount: refund.amount,
            type: refund.type,
            reason: refund.reason,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          refundId,
          status: 'approved',
          message: 'Refund approved and credited successfully',
        },
      })
    } else if (action === 'reject') {
      // Update refund status
      await prisma.refundRequest.update({
        where: { id: refundId },
        data: {
          status: 'rejected',
          processedBy: adminId,
          processedAt: new Date(),
          notes,
        },
      })

      // Send notification
      // await sendPushNotification(refund.userId, {
      //   title: 'Refund Request Rejected',
      //   body: 'Your refund request has been reviewed and rejected.',
      // })

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          action: 'REFUND_REJECT',
          adminId,
          targetType: 'refund',
          targetId: refundId,
          details: {
            userId: refund.userId,
            amount: refund.amount,
            notes,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          refundId,
          status: 'rejected',
          message: 'Refund rejected successfully',
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error processing refund:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
