/**
 * Project Stats API Endpoint
 * Computes project statistics on-the-fly
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import type { ProjectStats } from '@/types/project'

/**
 * GET /api/projects/[id]/stats
 * Retrieves aggregated statistics for a project
 * 
 * Returns:
 * - Mission counts (active, total)
 * - Proposal counts (total, by status)
 * - Team member count
 * - Distributed tokens percentage
 * 
 * Example: GET /api/projects/123e4567-e89b-12d3-a456-426614174000/stats
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return errorResponse('Invalid project ID format', 400)
    }
    
    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, total_supply')
      .eq('id', id)
      .single()
    
    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return errorResponse('Project not found', 404)
      }
      console.error('Database error:', projectError)
      return errorResponse('Failed to fetch project', 500)
    }
    
    // Count missions
    const { count: totalMissionsCount } = await supabase
      .from('missions')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', id)
    
    const { count: activeMissionsCount } = await supabase
      .from('missions')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', id)
      .eq('status', 'active')
    
    // Count proposals by status
    const { count: totalProposalsCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', id)
    
    const { count: pendingProposalsCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', id)
      .eq('status', 'pending_review')
    
    const { count: approvedProposalsCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', id)
      .in('status', ['approved', 'accepted'])
    
    const { count: workInProgressCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', id)
      .eq('status', 'work_in_progress')
    
    const { count: completedProposalsCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', id)
      .eq('status', 'completed')
    
    // Calculate team members (unique wallet addresses with completed proposals)
    const { data: teamMembers } = await supabase
      .from('proposals')
      .select('creator_wallet_address')
      .eq('project_id', id)
      .eq('status', 'completed')
    
    const uniqueTeamMembers = new Set(
      teamMembers?.map((m) => m.creator_wallet_address) || []
    )
    
    // Calculate distributed tokens percentage
    // Sum of completed proposals' foundation_offer_cstake_amount
    const { data: completedProposals } = await supabase
      .from('proposals')
      .select('foundation_offer_cstake_amount, requested_cstake_amount')
      .eq('project_id', id)
      .eq('status', 'completed')
    
    const totalDistributed = completedProposals?.reduce((sum, proposal) => {
      const amount =
        proposal.foundation_offer_cstake_amount ||
        proposal.requested_cstake_amount ||
        0
      return sum + amount
    }, 0) || 0
    
    const distributedPercentage =
      project.total_supply > 0
        ? (totalDistributed / project.total_supply) * 100
        : 0
    
    // Build stats object
    const stats: ProjectStats = {
      active_missions_count: activeMissionsCount || 0,
      total_missions_count: totalMissionsCount || 0,
      total_proposals_count: totalProposalsCount || 0,
      pending_proposals_count: pendingProposalsCount || 0,
      approved_proposals_count: approvedProposalsCount || 0,
      work_in_progress_count: workInProgressCount || 0,
      completed_proposals_count: completedProposalsCount || 0,
      team_members_count: uniqueTeamMembers.size,
      distributed_tokens_percentage: Math.round(distributedPercentage * 100) / 100,
    }
    
    return successResponse({ stats })
    
  } catch (error) {
    console.error('Project stats fetch error:', error)
    return errorResponse('Failed to fetch project stats', 500)
  }
}

