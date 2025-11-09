/**
 * Test API Endpoint
 * Simple health check to verify API routes are working
 */

import { successResponse } from '@/lib/api'

export async function GET() {
  return successResponse({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
}

