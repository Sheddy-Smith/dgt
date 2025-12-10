// src/app/api/settings/banners/route.ts
// Admin API: Publish banner (triggers settings.update event)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { EventEmitter, EventChannel } from '@/lib/events'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  
  try {
    // 1. Authentication & Authorization
    const session = await getServerSession()
    if (!session || !['admin', 'content'].includes(session.user.role)) {
      return NextResponse.json(
        { code: 'E_AUTH', message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Get request body
    const { 
      placement, 
      title, 
      imageUrl, 
      link, 
      startDate, 
      endDate, 
      priority = 0 
    } = await request.json()

    if (!placement || !title || !imageUrl) {
      return NextResponse.json(
        { code: 'E_VALIDATION', message: 'placement, title, imageUrl required' },
        { status: 400 }
      )
    }

    // 3. Create banner
    const banner = await prisma.banner.create({
      data: {
        placement,
        title,
        imageUrl,
        link,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        priority,
        status: 'active',
        createdBy: session.user.id
      }
    })

    // 4. Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'BANNER_PUBLISHED',
        entityType: 'banner',
        entityId: banner.id,
        userId: session.user.id,
        reason: 'Banner published',
        metadata: {
          placement,
          title,
          priority
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        requestId
      }
    })

    // 5. Emit settings update event (triggers User App refresh)
    const eventEmitter = EventEmitter.getInstance()
    await eventEmitter.emit(
      EventChannel.SETTINGS_UPDATE,
      {
        keys: ['banners']
      },
      requestId
    )

    // 6. Bust cache
    await bustCache(['banners', `banners:${placement}`])

    // 7. Return response
    return NextResponse.json({
      success: true,
      data: banner,
      requestId
    })

  } catch (error: any) {
    console.error('[Publish Banner] Error', { requestId, error })
    
    return NextResponse.json(
      {
        code: 'E_SERVER_ERROR',
        message: 'Failed to publish banner',
        requestId
      },
      { status: 500 }
    )
  }
}

async function bustCache(keys: string[]) {
  // Redis cache invalidation
  // await redis.del(keys)
}
