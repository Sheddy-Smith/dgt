import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PATCH /api/admin/wallet/[userId]/freeze - Freeze/Unfreeze wallet
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json()
    const { action, reason, notes, expiryDate, adminId } = body
    const { userId } = params

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: { user: true },
    })

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet not found' },
        { status: 404 }
      )
    }

    const newStatus = action === 'freeze' ? 'frozen' : 'active'
    
    // Update wallet status
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        status: newStatus,
        freezeReason: action === 'freeze' ? reason : null,
        freezeExpiryDate: action === 'freeze' && expiryDate ? new Date(expiryDate) : null,
        updatedAt: new Date(),
      },
    })

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        action: action === 'freeze' ? 'WALLET_FREEZE' : 'WALLET_UNFREEZE',
        adminId,
        targetType: 'wallet',
        targetId: wallet.id,
        details: {
          userId,
          reason,
          notes,
          expiryDate,
          previousStatus: wallet.status,
          newStatus,
        },
      },
    })

    // Send push notification to user
    // await sendPushNotification(userId, {
    //   title: `Wallet ${action === 'freeze' ? 'Frozen' : 'Unfrozen'}`,
    //   body: action === 'freeze' 
    //     ? 'Your wallet has been temporarily frozen. Contact support for details.'
    //     : 'Your wallet access has been restored.',
    // })

    return NextResponse.json({
      success: true,
      data: {
        userId,
        status: newStatus,
        message: `Wallet ${action === 'freeze' ? 'frozen' : 'unfrozen'} successfully`,
      },
    })
  } catch (error: any) {
    console.error('Error updating wallet status:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
