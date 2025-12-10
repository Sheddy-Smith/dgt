import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/payouts - Get payout requests with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const kycVerified = searchParams.get('kycVerified')
    const minAmount = searchParams.get('minAmount')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (kycVerified === 'true') {
      where.user = { kycVerified: true }
    }

    if (minAmount) {
      where.amount = { gte: parseFloat(minAmount) }
    }

    const [payouts, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              kycVerified: true,
              trustScore: true,
            },
          },
          wallet: {
            select: {
              balance: true,
              heldAmount: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payoutRequest.count({ where }),
    ])

    const formattedPayouts = payouts.map(payout => ({
      id: payout.id,
      userId: payout.userId,
      userName: payout.user.name,
      userPhone: payout.user.phone,
      amount: payout.amount,
      method: payout.method,
      bankDetails: payout.bankDetails,
      kycStatus: payout.user.kycVerified,
      trustScore: payout.user.trustScore || 0,
      fraudScore: payout.fraudScore || 0,
      requestDate: payout.createdAt,
      status: payout.status,
      walletBalance: payout.wallet.balance,
      heldAmount: payout.wallet.heldAmount,
    }))

    return NextResponse.json({
      success: true,
      data: formattedPayouts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching payouts:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/payouts - Process payout request (approve/reject)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payoutId, action, reason, adminId } = body

    if (!payoutId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const payout = await prisma.payoutRequest.findUnique({
      where: { id: payoutId },
      include: {
        user: true,
        wallet: true,
      },
    })

    if (!payout) {
      return NextResponse.json(
        { success: false, error: 'Payout request not found' },
        { status: 404 }
      )
    }

    if (payout.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Payout already processed' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Check if wallet has sufficient balance
      if (payout.wallet.balance < payout.amount) {
        return NextResponse.json(
          { success: false, error: 'Insufficient wallet balance' },
          { status: 400 }
        )
      }

      // Update payout status
      await prisma.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: 'approved',
          approvedBy: adminId,
          approvedAt: new Date(),
        },
      })

      // Debit wallet
      await prisma.wallet.update({
        where: { id: payout.wallet.id },
        data: {
          balance: { decrement: payout.amount },
        },
      })

      // Create transaction record
      await prisma.walletTransaction.create({
        data: {
          walletId: payout.wallet.id,
          type: 'payout',
          amount: payout.amount,
          description: `Payout request ${payoutId}`,
          gateway: payout.method,
          refId: payoutId,
          status: 'success',
          metadata: {
            method: payout.method,
            bankDetails: payout.bankDetails,
            approvedBy: adminId,
          },
        },
      })

      // Trigger gateway payout API
      // await processGatewayPayout(payout)

      // Send push notification
      // await sendPushNotification(payout.userId, {
      //   title: 'Payout Approved',
      //   body: `Your payout request of ₹${payout.amount} has been approved and processed.`,
      // })

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          action: 'PAYOUT_APPROVE',
          adminId,
          targetType: 'payout',
          targetId: payoutId,
          details: {
            userId: payout.userId,
            amount: payout.amount,
            method: payout.method,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          payoutId,
          status: 'approved',
          message: 'Payout approved and processed successfully',
        },
      })
    } else if (action === 'reject') {
      // Update payout status
      await prisma.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: 'rejected',
          rejectedBy: adminId,
          rejectedAt: new Date(),
          rejectionReason: reason,
        },
      })

      // Send notification
      // await sendPushNotification(payout.userId, {
      //   title: 'Payout Rejected',
      //   body: `Your payout request has been rejected. Reason: ${reason}`,
      // })

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          action: 'PAYOUT_REJECT',
          adminId,
          targetType: 'payout',
          targetId: payoutId,
          details: {
            userId: payout.userId,
            amount: payout.amount,
            reason,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          payoutId,
          status: 'rejected',
          message: 'Payout rejected successfully',
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error processing payout:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
