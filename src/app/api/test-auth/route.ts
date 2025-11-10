/**
 * Test Auth Endpoint
 * Verifies authentication helper functions work correctly
 * 
 * SECURITY: Only available in development mode
 */

import { NextRequest } from 'next/server'
import { requireAuth, getAuthenticatedWallet } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(request: NextRequest) {
  // SECURITY: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return errorResponse('Not Found', 404)
  }
  

  try {
    // Try to get wallet (optional auth)
    const wallet = getAuthenticatedWallet(request)
    
    if (!wallet) {
      return errorResponse('No wallet address provided', 401)
    }
    
    return successResponse({
      message: 'Authentication successful',
      wallet,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Authentication failed',
      401
    )
  }
}

export async function POST(request: NextRequest) {
  // SECURITY: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return errorResponse('Not Found', 404)
  }
  
  try {
    // Require authentication (mandatory)
    const wallet = requireAuth(request)
    
    return successResponse({
      message: 'Protected endpoint accessed',
      wallet,
      timestamp: new Date().toISOString()
    }, 200)
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Authentication failed',
      401
    )
  }
}

