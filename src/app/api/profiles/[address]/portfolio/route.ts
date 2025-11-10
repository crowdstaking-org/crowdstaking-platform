/**
 * Profile Portfolio API
 * GET /api/profiles/[address]/portfolio - Get completed missions and projects
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/profiles/[address]/portfolio
 * Returns completed missions + founded projects
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await context.params

    // Validate address format
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Fetch completed proposals/missions
    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .select(
        `
        id,
        title,
        description,
        deliverable,
        requested_cstake_amount,
        status,
        created_at
      `
      )
      .eq('creator_wallet_address', address)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    // Fetch founded projects
    const { data: projects, error: projectsError} = await supabase
      .from('projects')
      .select(
        `
        id,
        name,
        description,
        token_symbol,
        status,
        token_status,
        created_at
      `
      )
      .eq('founder_wallet_address', address)
      .order('created_at', { ascending: false })

    if (proposalsError || projectsError) {
      console.error('Error fetching portfolio:', proposalsError || projectsError)
      return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
    }

    return NextResponse.json({
      completedMissions: proposals || [],
      foundedProjects: projects || [],
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
