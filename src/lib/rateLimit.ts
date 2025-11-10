/**
 * Rate Limiting Utilities
 * Phase 7: Production-ready rate limiting to prevent abuse
 * 
 * TODO: Install dependencies:
 * npm install @upstash/ratelimit @upstash/redis
 * 
 * Setup Upstash Redis:
 * 1. Create account at https://upstash.com
 * 2. Create Redis database
 * 3. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local
 */

import { NextRequest } from 'next/server'

/**
 * In-Memory Rate Limiter (Development/MVP)
 * 
 * WARNING: This is NOT production-ready!
 * - Does not work across multiple server instances
 * - Resets on server restart
 * - Use Upstash Redis for production
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Simple sliding window rate limiter
 * 
 * @param identifier - Unique key (IP, wallet address, etc.)
 * @param limit - Max requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with success boolean and remaining count
 */
export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // No entry or expired window - create new
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })
    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
    }
  }

  // Within window - check limit
  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetAt,
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(identifier, entry)

  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  }
}

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
  LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  PROPOSAL_CREATE: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  PROPOSAL_GET: { limit: 100, windowMs: 60 * 1000 }, // 100 per minute
  ADMIN_ACTION: { limit: 60, windowMs: 60 * 1000 }, // 60 per minute
  DEFAULT: { limit: 30, windowMs: 60 * 1000 }, // 30 per minute
} as const

/**
 * Get client identifier from request (IP + optional wallet)
 */
export function getClientIdentifier(
  request: NextRequest,
  wallet?: string | null
): string {
  const ip =
    request.ip ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'

  return wallet ? `${ip}:${wallet}` : ip
}

/**
 * Cleanup expired entries (prevent memory leak)
 */
export function cleanupRateLimits(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000)
}

/**
 * Rate limit middleware helper
 * 
 * Usage:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = checkRateLimit(request, 'PROPOSAL_CREATE')
 *   if (!rateLimitResult.success) {
 *     return rateLimitResult.response
 *   }
 *   
 *   // Continue with request handling...
 * }
 * ```
 */
export function checkRateLimit(
  request: NextRequest,
  limitType: keyof typeof RATE_LIMITS = 'DEFAULT',
  wallet?: string | null
): {
  success: boolean
  remaining: number
  reset: number
  response?: Response
} {
  const config = RATE_LIMITS[limitType]
  const identifier = getClientIdentifier(request, wallet)

  const result = rateLimit(identifier, config.limit, config.windowMs)

  if (!result.success) {
    const response = new Response(
      JSON.stringify({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(config.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.reset),
        },
      }
    )

    return {
      ...result,
      response,
    }
  }

  return result
}

/**
 * Production-Ready Upstash Implementation (commented out until dependencies installed)
 * 
 * Uncomment this after:
 * 1. npm install @upstash/ratelimit @upstash/redis
 * 2. Add Upstash credentials to .env.local
 */

/*
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create rate limiters for different endpoints
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
})

export const proposalCreateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:proposal:create",
})

export const proposalGetRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "ratelimit:proposal:get",
})

// Usage in API route:
export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request)
  const { success, limit, remaining, reset } = await loginRateLimit.limit(identifier)
  
  if (!success) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((reset - Date.now()) / 1000)
      }),
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
        }
      }
    )
  }
  
  // Continue with request...
}
*/

