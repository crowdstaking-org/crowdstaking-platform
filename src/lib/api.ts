/**
 * API Response Utilities
 * Standardized response helpers for consistent API responses
 */

import { NextResponse } from 'next/server'

/**
 * Creates a standardized JSON response
 * 
 * @param data - The data to return in the response
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with JSON data
 */
export function jsonResponse<T>(
  data: T, 
  status: number = 200
): NextResponse<T> {
  return NextResponse.json(data, { status })
}

/**
 * Creates a standardized error response
 * PHASE 7: Enhanced with production-safe error messages
 * 
 * @param message - Error message to display
 * @param status - HTTP status code (default: 400)
 * @param details - Optional error details (only included in development)
 * @returns NextResponse with error object
 */
export function errorResponse(
  message: string, 
  status: number = 400,
  details?: any
) {
  // Log full error server-side for debugging
  if (details) {
    console.error('[API Error]', { 
      message, 
      status, 
      details,
      timestamp: new Date().toISOString()
    })
  }
  
  // Sanitize error message for production
  const isProduction = process.env.NODE_ENV === 'production'
  const sanitizedMessage = isProduction && status === 500 
    ? 'An internal error occurred' 
    : message
  
  return jsonResponse({ 
    error: sanitizedMessage,
    success: false,
    // Only include details in development
    ...(process.env.NODE_ENV === 'development' && details ? { details } : {})
  }, status)
}

/**
 * Creates a success response with data
 * 
 * @param data - The data to return
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success object
 */
export function successResponse<T>(
  data: T,
  status: number = 200
) {
  return jsonResponse({
    success: true,
    data
  }, status)
}

