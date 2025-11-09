/**
 * Debug Auth Endpoint
 * Hilft beim Debugging der Auth-Funktionalität
 */

import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api'

export async function GET(request: NextRequest) {
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

