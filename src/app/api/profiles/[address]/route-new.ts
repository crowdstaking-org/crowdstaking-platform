/**
 * Profile API Routes
 * GET /api/profiles/[address] - Get profile with stats
 * PUT /api/profiles/[address] - Update profile (owner only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth, getAuthenticatedWallet } from '@/lib/auth'

/**
 * GET /api/profiles/[address]
 * Get profile with stats, badges, and privacy-filtered data
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await context.params
