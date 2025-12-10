import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/chargebacks - Get chargebacks/disputes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const gateway = searchParams.get('gateway')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (gateway && gateway !== 'all') {
      where.gateway = gateway
    }

    const [chargebacks, total] = await Promise.all([
      prisma.chargeback.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          transaction: {
            select: {
              id: true,
              amount: true,
              refId: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.chargeback.count({ where }),
    ])

    const formattedChargebacks = chargebacks.map(cb => ({
      id: cb.id,
      userId: cb.userId,
      userName: cb.user.name,
      userPhone: cb.user.phone,
      amount: cb.amount,
      reason: cb.reason,
      gateway: cb.gateway,
      date: cb.createdAt,
      deadline: cb.deadline,
      status: cb.status,
      evidence: cb.evidence,
      transactionRef: cb.transaction?.refId,
    }))

    return NextResponse.json({
      success: true,
      data: formattedChargebacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching chargebacks:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/chargebacks - Update chargeback status or add evidence
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chargebackId, action, evidence, notes, adminId } = body

    if (!chargebackId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const chargeback = await prisma.chargeback.findUnique({
      where: { id: chargebackId },
      include: { user: true },
    })

    if (!chargeback) {
      return NextResponse.json(
        { success: false, error: 'Chargeback not found' },
        { status: 404 }
      )
    }

    if (action === 'add_evidence') {
      await prisma.chargeback.update({
        where: { id: chargebackId },
        data: {
          evidence: {
            ...chargeback.evidence,
            items: [...(chargeback.evidence?.items || []), evidence],
            updatedAt: new Date(),
            updatedBy: adminId,
          },
        },
      })

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          action: 'CHARGEBACK_EVIDENCE_ADD',
          adminId,
          targetType: 'chargeback',
          targetId: chargebackId,
          details: {
            userId: chargeback.userId,
            evidence,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          chargebackId,
          message: 'Evidence added successfully',
        },
      })
    } else if (action === 'resolve') {
      await prisma.chargeback.update({
        where: { id: chargebackId },
        data: {
          status: 'resolved',
          resolvedBy: adminId,
          resolvedAt: new Date(),
          resolutionNotes: notes,
        },
      })

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          action: 'CHARGEBACK_RESOLVE',
          adminId,
          targetType: 'chargeback',
          targetId: chargebackId,
          details: {
            userId: chargeback.userId,
            amount: chargeback.amount,
            notes,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          chargebackId,
          status: 'resolved',
          message: 'Chargeback resolved successfully',
        },
      })
    } else if (action === 'escalate') {
      await prisma.chargeback.update({
        where: { id: chargebackId },
        data: {
          status: 'escalated',
          escalatedBy: adminId,
          escalatedAt: new Date(),
          escalationNotes: notes,
        },
      })

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          action: 'CHARGEBACK_ESCALATE',
          adminId,
          targetType: 'chargeback',
          targetId: chargebackId,
          details: {
            userId: chargeback.userId,
            notes,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          chargebackId,
          status: 'escalated',
          message: 'Chargeback escalated successfully',
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error updating chargeback:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
