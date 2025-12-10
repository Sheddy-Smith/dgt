// src/lib/middleware/rate-limit.ts
// Rate limiting middleware

import { NextRequest, NextResponse } from 'next/server'
import { Redis } from 'ioredis'

// const redis = new Redis(process.env.REDIS_URL!)

interface RateLimitConfig {
  window: number // seconds
  max: number // max requests
}

const LIMITS: Record<string, RateLimitConfig> = {
  'otp': { window: 3600, max: 5 }, // 5 OTP per hour
  'listing_create': { window: 86400, max: 10 }, // 10 listings per day
  'payout': { window: 86400, max: 3 }, // 3 payouts per day
  'api_general': { window: 60, max: 100 }, // 100 requests per minute
}

export async function rateLimit(
  request: NextRequest,
  type: keyof typeof LIMITS,
  identifier: string // userId or IP
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  
  const config = LIMITS[type]
  const key = `ratelimit:${type}:${identifier}`
  
  try {
    // Get current count from Redis
    // const current = await redis.get(key)
    const current = null // Mock
    
    if (!current) {
      // First request in window
      // await redis.setex(key, config.window, '1')
      return {
        allowed: true,
        remaining: config.max - 1,
        resetAt: Date.now() + (config.window * 1000)
      }
    }
    
    const count = parseInt(current)
    
    if (count >= config.max) {
      // Rate limit exceeded
      // const ttl = await redis.ttl(key)
      const ttl = config.window
      
      return {
        allowed: false,
        remaining: 0,
        resetAt: Date.now() + (ttl * 1000)
      }
    }
    
    // Increment counter
    // await redis.incr(key)
    
    return {
      allowed: true,
      remaining: config.max - count - 1,
      resetAt: Date.now() + (config.window * 1000)
    }
    
  } catch (error) {
    console.error('[RateLimit] Error', { type, identifier, error })
    // Fail open in case of Redis error
    return { allowed: true, remaining: config.max, resetAt: Date.now() }
  }
}

// Middleware wrapper
export function withRateLimit(
  type: keyof typeof LIMITS,
  getIdentifier: (req: NextRequest) => string
) {
  return async (request: NextRequest) => {
    const identifier = getIdentifier(request)
    const limit = await rateLimit(request, type, identifier)
    
    if (!limit.allowed) {
      return NextResponse.json(
        {
          code: 'E_RATE_LIMIT',
          message: 'Rate limit exceeded',
          resetAt: new Date(limit.resetAt).toISOString()
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': LIMITS[type].max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limit.resetAt.toString(),
            'Retry-After': Math.ceil((limit.resetAt - Date.now()) / 1000).toString()
          }
        }
      )
    }
    
    // Add rate limit headers to response
    return null // Continue to handler
  }
}
