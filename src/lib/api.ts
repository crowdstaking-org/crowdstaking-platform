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
 * 
 * @param message - Error message to display
 * @param status - HTTP status code (default: 400)
 * @returns NextResponse with error object
 */
export function errorResponse(
  message: string, 
  status: number = 400
) {
  return jsonResponse({ 
    error: message,
    success: false
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

