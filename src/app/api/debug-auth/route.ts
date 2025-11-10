/**
 * Debug Auth Endpoint
 * Hilft beim Debugging der Auth-Funktionalität
 * 
 * SECURITY: Only available in development mode
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(request: NextRequest) {
  // SECURITY: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return errorResponse('Not Found', 404)
  }
  
  const sessionCookie = request.cookies.get('session_id')
  const headerWallet = request.headers.get('x-wallet-address')
  const cookieHeader = request.headers.get('cookie')
  
  return successResponse({
    sessionCookie: sessionCookie?.value || null,
    headerWallet,
    cookieHeader,
    nodeEnv: process.env.NODE_ENV,
  })
}

