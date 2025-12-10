import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/transactions - Get all transactions with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const gateway = searchParams.get('gateway')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    if (type && type !== 'all') {
      where.type = type
    }

    if (gateway && gateway !== 'all') {
      where.gateway = gateway
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { refId: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.walletTransaction.count({ where }),
    ])

    const formattedTransactions = transactions.map(txn => ({
      id: txn.id,
      type: txn.type,
      from: txn.type === 'credit' ? txn.gateway : txn.wallet.user.id,
      to: txn.type === 'debit' || txn.type === 'payout' ? 'System' : txn.wallet.user.id,
      amount: txn.amount,
      gateway: txn.gateway,
      ref: txn.refId || txn.id,
      status: txn.status,
      timestamp: txn.createdAt,
      description: txn.description,
      userId: txn.wallet.userId,
      userName: txn.wallet.user.name,
    }))

    return NextResponse.json({
      success: true,
      data: formattedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Export transactions as CSV
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filters, format = 'csv' } = body

    // Apply same filters as GET
    const where: any = {}
    
    if (filters?.type) where.type = filters.type
    if (filters?.gateway) where.gateway = filters.gateway
    if (filters?.status) where.status = filters.status
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate)
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate)
    }

    const transactions = await prisma.walletTransaction.findMany({
      where,
      include: {
        wallet: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10000, // Limit export to 10k records
    })

    if (format === 'csv') {
      const csvHeader = 'ID,Date,Type,User ID,User Name,Amount,Gateway,Ref ID,Status,Description\n'
      const csvRows = transactions.map(txn => {
        return [
          txn.id,
          txn.createdAt.toISOString(),
          txn.type,
          txn.wallet.userId,
          txn.wallet.user.name,
          txn.amount,
          txn.gateway,
          txn.refId || '',
          txn.status,
          `"${txn.description.replace(/"/g, '""')}"`,
        ].join(',')
      }).join('\n')

      const csv = csvHeader + csvRows

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="transactions_${Date.now()}.csv"`,
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid format' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error exporting transactions:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
