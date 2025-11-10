/**
 * Project Missions API Endpoint
 * Handles fetching missions for a specific project
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import type { Mission, MissionWithStats } from '@/types/mission'

/**
 * GET /api/projects/[id]/missions
 * Retrieves all missions for a specific project
 * 
 * Query parameters:
 * - include_stats: If 'true', includes proposal counts for each mission
 * 
 * Example: GET /api/projects/123.../missions?include_stats=true
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('include_stats') === 'true'
    
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return errorResponse('Invalid project ID format', 400)
    }
    
    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single()
    
    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return errorResponse('Project not found', 404)
      }
      console.error('Database error:', projectError)
      return errorResponse('Failed to verify project', 500)
    }
    
    // Fetch missions
    const { data: missions, error } = await supabase
      .from('missions')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      return errorResponse('Failed to fetch missions', 500)
    }
    
    // If stats requested, fetch proposal counts for each mission
    if (includeStats && missions && missions.length > 0) {
      const missionIds = missions.map((m) => m.id)
      
      // Fetch proposal counts for all missions
      const { data: proposalCounts } = await supabase
        .from('proposals')
        .select('mission_id, status')
        .in('mission_id', missionIds)
      
      // Build stats map
      const statsMap = new Map<
        string,
        { total: number; pending: number }
      >()
      
      proposalCounts?.forEach((p) => {
        if (!p.mission_id) return
        
        const current = statsMap.get(p.mission_id) || { total: 0, pending: 0 }
        current.total++
        if (p.status === 'pending_review') {
          current.pending++
        }
        statsMap.set(p.mission_id, current)
      })
      
      // Merge stats with missions
      const missionsWithStats: MissionWithStats[] = missions.map((m) => {
        const stats = statsMap.get(m.id) || { total: 0, pending: 0 }
        return {
          ...m,
          proposals_count: stats.total,
          pending_proposals_count: stats.pending,
        } as MissionWithStats
      })
      
      return successResponse({
        missions: missionsWithStats,
        count: missionsWithStats.length,
      })
    }
    
    return successResponse({
      missions: missions as Mission[],
      count: missions?.length || 0,
    })
    
  } catch (error) {
    console.error('Missions fetch error:', error)
    return errorResponse('Failed to fetch missions', 500)
  }
}

