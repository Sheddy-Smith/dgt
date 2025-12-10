import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/wallet - Get all user wallets with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const kycVerified = searchParams.get('kycVerified')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (kycVerified !== null && kycVerified !== 'all') {
      where.kycVerified = kycVerified === 'true'
    }

    if (search) {
      where.OR = [
        { userId: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [wallets, total] = await Promise.all([
      prisma.wallet.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              kycVerified: true,
            },
          },
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.wallet.count({ where }),
    ])

    const formattedWallets = wallets.map(wallet => ({
      id: wallet.userId,
      name: wallet.user.name,
      phone: wallet.user.phone,
      balance: wallet.balance,
      heldAmount: wallet.heldAmount,
      lastTransaction: wallet.transactions[0]?.createdAt || null,
      kycVerified: wallet.user.kycVerified,
      status: wallet.status,
    }))

    return NextResponse.json({
      success: true,
      data: formattedWallets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching wallets:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/wallet - Create wallet or adjust balance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, amount, reason, notes, adminId } = body

    if (!action || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: { user: true },
    })

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          heldAmount: 0,
          status: 'active',
        },
        include: { user: true },
      })
    }

    if (action === 'adjust') {
      const type = amount > 0 ? 'credit' : 'debit'
      const absAmount = Math.abs(amount)

      // Create transaction record
      const transaction = await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type,
          amount: absAmount,
          description: reason || 'Manual adjustment',
          gateway: 'admin',
          status: 'success',
          metadata: {
            notes,
            adminId,
            adjustedBy: 'admin',
          },
        },
      })

      // Update wallet balance
      const newBalance = wallet.balance + amount
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: newBalance,
          updatedAt: new Date(),
        },
      })

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          action: 'WALLET_ADJUST',
          adminId,
          targetType: 'wallet',
          targetId: wallet.id,
          details: {
            userId,
            type,
            amount: absAmount,
            reason,
            notes,
            previousBalance: wallet.balance,
            newBalance,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          transactionId: transaction.id,
          newBalance,
          message: `Wallet ${type === 'credit' ? 'credited' : 'debited'} successfully`,
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error adjusting wallet:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
