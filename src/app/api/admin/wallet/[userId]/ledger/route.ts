import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/wallet/[userId]/ledger - Get wallet transaction ledger
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const gateway = searchParams.get('gateway')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet not found' },
        { status: 404 }
      )
    }

    const where: any = { walletId: wallet.id }

    if (type && type !== 'all') {
      where.type = type
    }

    if (gateway && gateway !== 'all') {
      where.gateway = gateway
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.walletTransaction.count({ where }),
    ])

    // Calculate running balance
    let runningBalance = wallet.balance
    const ledgerEntries = transactions.map((txn, index) => {
      const balanceAfter = runningBalance
      const change = txn.type === 'credit' ? -txn.amount : txn.amount
      runningBalance += change

      return {
        id: txn.id,
        date: txn.createdAt,
        type: txn.type,
        description: txn.description,
        amount: txn.amount,
        balanceAfter,
        refId: txn.refId,
        gateway: txn.gateway,
        status: txn.status,
        metadata: txn.metadata,
      }
    })

    return NextResponse.json({
      success: true,
      data: ledgerEntries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      currentBalance: wallet.balance,
    })
  } catch (error: any) {
    console.error('Error fetching ledger:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
