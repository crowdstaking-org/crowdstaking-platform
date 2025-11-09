/**
 * Logout API Endpoint
 * Invalidates user session and clears authentication cookie
 */

import { NextRequest } from 'next/server'
import { deleteSession } from '@/lib/auth/sessions'
import { successResponse } from '@/lib/api'

/**
 * POST /api/auth/logout
 * Logs out the current user by deleting their session
 * 
 * Response:
 * - Deletes session from storage
 * - Clears session_id cookie
 * - Returns success (even if no active session)
 */
export async function POST(request: NextRequest) {
  try {
    // Get session ID from cookie
    const sessionId = request.cookies.get('session_id')?.value
    
    // Delete session if exists
    if (sessionId) {
      deleteSession(sessionId)
    }
    
    // Create response
    const response = successResponse({
      message: 'Logout successful',
    })
    
    // Clear session cookie
    response.cookies.delete('session_id')
    
    return response
    
  } catch (error) {
    // Even on error, try to clear cookie
    const response = successResponse({
      message: 'Logout completed',
    })
    response.cookies.delete('session_id')
    return response
  }
}

