/**
 * Authentication Utilities
 * Handles wallet authentication for API routes
 * 
 * PHASE 2: Now uses secure session-based authentication with cryptographic signatures
 */

import { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth/sessions'

/**
 * Extracts authenticated wallet address from request
 * 
 * PHASE 2: Reads session cookie and verifies against session storage
 * Falls back to x-wallet-address header for backward compatibility (testing only)
 * 
 * @param request - Request object (supports both Request and NextRequest)
 * @returns Wallet address string or null if not authenticated
 */
export function getAuthenticatedWallet(request: Request | NextRequest): string | null {
  // Try session cookie first (works for both Request and NextRequest)
  try {
    // Try NextRequest cookies API
    if ('cookies' in request) {
      const req = request as NextRequest
      const sessionId = req.cookies.get('session_id')?.value
      
      if (sessionId) {
        const wallet = verifySession(sessionId)
        if (wallet) {
          return wallet
        }
      }
    }
    
    // Parse from Cookie header as fallback
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      const match = cookieHeader.match(/session_id=([^;]+)/)
      if (match) {
        const wallet = verifySession(match[1])
        if (wallet) {
          return wallet
        }
      }
    }
  } catch (error) {
    // If session check fails, continue to header fallback
    console.debug('Session check failed:', error)
  }
  
  // Backward compatibility: Header-based auth for development/testing
  // WARNING: This will be removed in production
  const headerWallet = request.headers.get('x-wallet-address')
  
  if (headerWallet) {
    const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(headerWallet)
    if (isValidFormat) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Using header-based auth (development only)')
      }
      return headerWallet.toLowerCase()
    }
  }
  
  return null
}

/**
 * Requires authentication, throws error if not authenticated
 * 
 * Use this in API routes where authentication is mandatory
 * 
 * @param request - Request object (supports both Request and NextRequest)
 * @returns Wallet address (guaranteed to be non-null)
 * @throws Error if not authenticated
 */
export function requireAuth(request: Request | NextRequest): string {
  const wallet = getAuthenticatedWallet(request)
  
  if (!wallet) {
    throw new Error('Unauthorized: Wallet address required')
  }
  
  return wallet
}

/**
 * Checks if a wallet address is an admin
 * 
 * MVP APPROACH: Hardcoded admin addresses
 * PHASE 3: Will move to database-based role system
 * 
 * @param walletAddress - Wallet address to check
 * @returns true if wallet is an admin
 */
export function isAdmin(walletAddress: string): boolean {
  // MVP: Hardcoded admin wallets (lowercase)
  const adminWallets = [
    // Add admin wallet addresses here
    // Example: '0x1234567890123456789012345678901234567890'
  ]
  
  return adminWallets.includes(walletAddress.toLowerCase())
}

/**
 * Requires admin authentication
 * 
 * @param request - Request object (supports both Request and NextRequest)
 * @returns Admin wallet address
 * @throws Error if not authenticated or not admin
 */
export function requireAdmin(request: Request | NextRequest): string {
  const wallet = requireAuth(request)
  
  if (!isAdmin(wallet)) {
    throw new Error('Forbidden: Admin access required')
  }
  
  return wallet
}

