/**
 * Authentication Utilities
 * Handles wallet authentication for API routes
 * 
 * PHASE 2: Now uses secure session-based authentication with cryptographic signatures
 */

import { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth/sessions'
import { supabase } from '@/lib/supabase'

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
 * PHASE 4: Reads admin addresses from ADMIN_WALLET_ADDRESS environment variable
 * Supports multiple admin addresses separated by commas
 * 
 * @param walletAddress - Wallet address to check
 * @returns true if wallet is an admin
 */
export function isAdmin(walletAddress: string): boolean {
  const adminAddressesEnv = process.env.ADMIN_WALLET_ADDRESS
  
  if (!adminAddressesEnv) {
    console.warn('⚠️ ADMIN_WALLET_ADDRESS not set in environment')
    return false
  }
  
  const adminAddresses = adminAddressesEnv
    .split(',')
    .map(addr => addr.trim().toLowerCase())
    .filter(addr => addr.length > 0)
  
  return adminAddresses.includes(walletAddress.toLowerCase())
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

/**
 * Checks if a wallet address belongs to a super-admin
 * 
 * Super-admins are identified by their email address in the profiles table.
 * Emails are configured via SUPER_ADMIN_EMAILS environment variable (comma-separated).
 * 
 * @param walletAddress - Wallet address to check
 * @returns true if wallet is a super-admin
 */
export async function isSuperAdmin(walletAddress: string): Promise<boolean> {
  try {
    // Get super-admin emails from environment
    const superAdminEmailsEnv = process.env.SUPER_ADMIN_EMAILS
    
    if (!superAdminEmailsEnv) {
      console.warn('⚠️ SUPER_ADMIN_EMAILS not set in environment')
      return false
    }
    
    const superAdminEmails = superAdminEmailsEnv
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0)
    
    // Fetch profile from database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()
    
    if (error || !profile || !profile.email) {
      return false
    }
    
    return superAdminEmails.includes(profile.email.toLowerCase())
  } catch (error) {
    console.error('Error checking super-admin status:', error)
    return false
  }
}

/**
 * Requires super-admin authentication
 * 
 * @param request - Request object (supports both Request and NextRequest)
 * @returns Super-admin wallet address
 * @throws Error if not authenticated or not super-admin
 */
export async function requireSuperAdmin(request: Request | NextRequest): Promise<string> {
  const wallet = requireAuth(request)
  
  const isSuperAdminUser = await isSuperAdmin(wallet)
  
  if (!isSuperAdminUser) {
    throw new Error('Forbidden: Super-admin access required')
  }
  
  return wallet
}

