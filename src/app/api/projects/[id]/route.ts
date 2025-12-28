/**
 * Single Project API Endpoint
 * Handles fetching a specific project by ID
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import type { Project } from '@/types/project'

/**
 * GET /api/projects/[id]
 * Retrieves a single project by ID
 * 
 * Example: GET /api/projects/123e4567-e89b-12d3-a456-426614174000
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
    
    const { data: projectData, error } = await supabase
      .from('projects_v4')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Project not found', 404)
      }
      console.error('Database error:', error)
      return errorResponse('Failed to fetch project', 500)
    }

    // Map V4 project to legacy Project type
    const project: Project = {
      id: projectData.id,
      created_at: projectData.created_at,
      updated_at: projectData.created_at,
      founder_wallet_address: projectData.created_by || '',
      name: projectData.name,
      description: projectData.mission || '',
      token_name: projectData.name,
      // Dynamic token symbol: SBT-<Slug> or V4-PROJECT
      token_symbol: `SBT-${(projectData.slug || projectData.name).toUpperCase().substring(0, 10)}`, 
      total_supply: 1000000,
      token_status: 'live',
      status: projectData.status === 'active' ? 'active' : 'paused'
    }
    
    return successResponse({
      project,
    })
    
  } catch (error) {
    console.error('Project fetch error:', error)
    return errorResponse('Failed to fetch project', 500)
  }
}

