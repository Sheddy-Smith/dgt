// src/lib/middleware/auth.ts
// Authentication & Authorization middleware

import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    role: string
    permissions: string[]
  }
}

export async function authenticate(request: NextRequest): Promise<{
  success: boolean
  user?: any
  error?: string
}> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' }
    }
    
    const token = authHeader.substring(7)
    
    // Verify JWT
    const decoded = verify(token, JWT_SECRET) as any
    
    // Check token expiry
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return { success: false, error: 'Token expired' }
    }
    
    return {
      success: true,
      user: {
        id: decoded.sub,
        role: decoded.role,
        permissions: decoded.permissions || []
      }
    }
    
  } catch (error) {
    console.error('[Auth] Verification failed', error)
    return { success: false, error: 'Invalid token' }
  }
}

export function requireAuth(allowedRoles: string[] = []) {
  return async (request: NextRequest) => {
    const auth = await authenticate(request)
    
    if (!auth.success) {
      return NextResponse.json(
        {
          code: 'E_AUTH',
          message: auth.error || 'Unauthorized'
        },
        { status: 401 }
      )
    }
    
    // Check role authorization
    if (allowedRoles.length > 0 && !allowedRoles.includes(auth.user!.role)) {
      return NextResponse.json(
        {
          code: 'E_AUTH',
          message: 'Insufficient permissions'
        },
        { status: 403 }
      )
    }
    
    // Attach user to request
    ;(request as any).user = auth.user
    
    return null // Continue to handler
  }
}

// Check specific permission
export function requirePermission(permission: string) {
  return async (request: NextRequest) => {
    const auth = await authenticate(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { code: 'E_AUTH', message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    if (!auth.user!.permissions.includes(permission)) {
      return NextResponse.json(
        {
          code: 'E_AUTH',
          message: `Permission required: ${permission}`
        },
        { status: 403 }
      )
    }
    
    ;(request as any).user = auth.user
    return null
  }
}
