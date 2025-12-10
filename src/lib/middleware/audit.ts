// src/lib/middleware/audit.ts
// Audit logging middleware

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export interface AuditLogData {
  action: string
  entityType: string
  entityId: string
  userId: string
  reason?: string
  metadata?: Record<string, any>
  ipAddress: string
  requestId: string
}

export async function createAuditLog(data: AuditLogData) {
  try {
    // Store in database
    // await prisma.auditLog.create({ data })
    
    // Also log to external service (optional)
    // await logToElasticsearch(data)
    
    console.log('[Audit]', data.action, {
      entity: `${data.entityType}:${data.entityId}`,
      user: data.userId,
      requestId: data.requestId
    })
    
  } catch (error) {
    console.error('[Audit] Failed to create log', error)
    // Don't throw - audit failure shouldn't break the request
  }
}

export function extractIpAddress(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

// Middleware for sensitive operations
export function withAudit(
  action: string,
  entityType: string
) {
  return async (
    request: NextRequest,
    handler: () => Promise<any>
  ) => {
    const requestId = crypto.randomUUID()
    const startTime = Date.now()
    
    try {
      // Execute handler
      const result = await handler()
      
      // Log successful action
      await createAuditLog({
        action,
        entityType,
        entityId: result.id || 'unknown',
        userId: (request as any).user?.id || 'system',
        metadata: {
          duration: Date.now() - startTime,
          success: true
        },
        ipAddress: extractIpAddress(request),
        requestId
      })
      
      return result
      
    } catch (error: any) {
      // Log failed action
      await createAuditLog({
        action: `${action}_FAILED`,
        entityType,
        entityId: 'unknown',
        userId: (request as any).user?.id || 'system',
        metadata: {
          duration: Date.now() - startTime,
          success: false,
          error: error.message
        },
        ipAddress: extractIpAddress(request),
        requestId
      })
      
      throw error
    }
  }
}
