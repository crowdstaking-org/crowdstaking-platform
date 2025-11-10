/**
 * Endorsements List API
 * GET /api/social/endorsements/[address] - Get endorsements for a user
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/social/endorsements/[address]
 * Get endorsements for a user, grouped by skill
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params

    // Validate address
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Get endorsements with endorser profile info
    const { data, error } = await supabase
      .from('endorsements')
      .select(
        `
        id,
        endorser_address,
        skill,
        message,
        created_at,
        profiles:endorser_address (
          wallet_address,
          display_name,
          avatar_url,
          trust_score
        )
      `
      )
      .eq('endorsed_address', address)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching endorsements:', error)
      return NextResponse.json({ error: 'Failed to fetch endorsements' }, { status: 500 })
    }

    // Group endorsements by skill
    const endorsementsBySkill: Record<
      string,
      { count: number; endorsements: typeof data }
    > = {}

    data?.forEach((endorsement) => {
      if (!endorsementsBySkill[endorsement.skill]) {
        endorsementsBySkill[endorsement.skill] = {
          count: 0,
          endorsements: [],
        }
      }
      endorsementsBySkill[endorsement.skill].count++
      endorsementsBySkill[endorsement.skill].endorsements.push(endorsement)
    })

    return NextResponse.json({
      endorsements: data || [],
      bySkill: endorsementsBySkill,
    })
  } catch (error) {
    console.error('Error fetching endorsements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

