/**
 * Team API for Projects
 * GET /api/projects/[projectId]/team
 * 
 * Returns all team members (co-founders) for a project
 * based on accepted/completed proposals
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'

/**
 * GET /api/projects/[projectId]/team
 * 
 * Fetches all team members (co-founders) based on accepted proposals
 * - Finds all accepted/completed proposals (NOTE: currently no project_id in proposals)
 * - Groups by creator (pioneer)
 * - Joins with profile data
 * - Calculates contribution stats
 * 
 * @returns Team members with profiles and contribution stats
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await context.params
    
    // NOTE: Current proposals table does not have project_id field
    // For now, we fetch ALL accepted/completed proposals
    // TODO: Add project_id to proposals table in future migration
    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .select(`
        id,
        creator_wallet_address,
        requested_cstake_amount,
        foundation_offer_cstake_amount,
        created_at,
        status
      `)
      .in('status', ['accepted', 'work_in_progress', 'completed'])
      .order('created_at', { ascending: true })
    
    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError)
      throw proposalsError
    }
    
    if (!proposals || proposals.length === 0) {
      return successResponse({
        team: [],
        count: 0
      })
    }
    
    // Group by creator address
    const creatorMap = new Map<string, {
      walletAddress: string
      missionsCompleted: number
      missionsInProgress: number
      totalCstakeEarned: number
      firstContribution: string
      latestContribution: string
    }>()
    
    proposals.forEach(proposal => {
      const existing = creatorMap.get(proposal.creator_wallet_address)
      const amount = proposal.foundation_offer_cstake_amount || proposal.requested_cstake_amount
      
      if (existing) {
        if (proposal.status === 'completed') {
          existing.missionsCompleted++
          existing.totalCstakeEarned += amount
        } else {
          existing.missionsInProgress++
        }
        existing.latestContribution = proposal.created_at
      } else {
        creatorMap.set(proposal.creator_wallet_address, {
          walletAddress: proposal.creator_wallet_address,
          missionsCompleted: proposal.status === 'completed' ? 1 : 0,
          missionsInProgress: proposal.status !== 'completed' ? 1 : 0,
          totalCstakeEarned: proposal.status === 'completed' ? amount : 0,
          firstContribution: proposal.created_at,
          latestContribution: proposal.created_at
        })
      }
    })
    
    // Get unique creator addresses
    const creatorAddresses = Array.from(creatorMap.keys())
    
    // Fetch profiles for all creators
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('wallet_address, display_name, avatar_url, trust_score, bio, skills')
      .in('wallet_address', creatorAddresses)
    
    if (profilesError) {
      console.warn('Error fetching profiles, continuing without profile data:', profilesError)
    }
    
    // Create profile map
    const profileMap = new Map(profiles?.map(p => [p.wallet_address, p]))
    
    // Combine data
    const team = Array.from(creatorMap.values()).map(member => {
      const profile = profileMap.get(member.walletAddress)
      
      return {
        walletAddress: member.walletAddress,
        profile: profile ? {
          displayName: profile.display_name,
          avatarUrl: profile.avatar_url,
          trustScore: profile.trust_score,
          bio: profile.bio,
          skills: profile.skills
        } : undefined,
        contributions: {
          missionsCompleted: member.missionsCompleted,
          missionsInProgress: member.missionsInProgress,
          totalCstakeEarned: member.totalCstakeEarned,
          firstContribution: member.firstContribution,
          latestContribution: member.latestContribution
        }
      }
    })
    
    // Sort by trust score (highest first), then by missions completed
    team.sort((a, b) => {
      const scoreA = a.profile?.trustScore || 0
      const scoreB = b.profile?.trustScore || 0
      if (scoreA !== scoreB) {
        return scoreB - scoreA
      }
      return b.contributions.missionsCompleted - a.contributions.missionsCompleted
    })
    
    return successResponse({
      team,
      count: team.length
    })
    
  } catch (error: any) {
    console.error('Team API error:', error)
    return errorResponse(
      error.message || 'Failed to fetch team members',
      500
    )
  }
}

