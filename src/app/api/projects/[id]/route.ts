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
    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects_v4')
      .select('*')
      .eq('id', id)
      .single()
    
    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return errorResponse('Project not found', 404)
      }
      console.error('Database error:', projectError)
      return errorResponse('Failed to fetch project', 500)
    }

    // Fetch contracts
    const { data: contracts } = await supabase
      .from('project_contracts')
      .select('contract_type, address, chain_id')
      .eq('project_id', id)

    // Map to Project type
    const projectData = {
      id: project.id,
      created_at: project.created_at,
      updated_at: project.created_at,
      founder_wallet_address: project.created_by || project.founder_wallet || '',
      name: project.name,
      description: project.mission || '',
      token_name: project.name,
      // Dynamic token symbol: SBT-<Slug> or V4-PROJECT
      token_symbol: project.token_symbol || `SBT-${(project.slug || project.name).toUpperCase().substring(0, 10)}`,
      total_supply: 1000000,
      token_status: 'live',
      status: project.status === 'active' ? 'active' : 'paused',
      contracts: contracts || []
    }
    
    return successResponse({ project: projectData })
    
  } catch (error) {
    console.error('Project fetch error:', error)
    return errorResponse('Failed to fetch project', 500)
  }
}
