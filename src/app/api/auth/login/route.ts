/**
 * Login API Endpoint
 * Handles wallet authentication via signature verification
 * 
 * PHASE 2: Secure authentication with cryptographic signatures
 */

import { NextRequest } from 'next/server'
import { verifyLoginSignature, extractAddressFromMessage } from '@/lib/auth/thirdweb-auth'
import { createSession } from '@/lib/auth/sessions'
import { successResponse, errorResponse } from '@/lib/api'

/**
 * POST /api/auth/login
 * Authenticates a user by verifying their wallet signature
 * 
 * Request body:
 * {
 *   "address": "0x...",  // Wallet address
 *   "message": "Sign in to CrowdStaking...",  // Message that was signed
 *   "signature": "0x..."  // Cryptographic signature from wallet
 * }
 * 
 * Response:
 * - Sets httpOnly cookie 'session_id'
 * - Returns { success: true, address }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, message, signature } = body
    
    // Validate required fields
    if (!address || !message || !signature) {
      return errorResponse('Missing required fields: address, message, signature', 400)
    }
    
    // Validate Ethereum address format (0x + 40 hex characters)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return errorResponse('Invalid Ethereum address format', 400)
    }
    
    // Extract address from message and verify it matches
    const messageAddress = extractAddressFromMessage(message)
    if (!messageAddress || messageAddress.toLowerCase() !== address.toLowerCase()) {
      return errorResponse('Address in message does not match provided address', 400)
    }
    
    // Verify the signature cryptographically
    const isValid = await verifyLoginSignature({
      address,
      message,
      signature,
    })
    
    if (!isValid) {
      return errorResponse('Invalid signature - authentication failed', 401)
    }
    
    // Create session
    const sessionId = createSession(address)
    
    // Create response with session cookie
    const response = successResponse({
      message: 'Login successful',
      address: address.toLowerCase(),
    })
    
    // Set secure httpOnly cookie
    response.cookies.set('session_id', sessionId, {
      httpOnly: true, // Cannot be accessed by JavaScript (XSS protection)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/', // Available site-wide
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Login failed',
      500
    )
  }
}






