/**
 * Missions API Endpoint
 * Handles mission creation and retrieval
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'
import type { Mission } from '@/types/mission'

/**
 * GET /api/missions
 * Retrieves missions with optional filtering
 * 
 * Query parameters:
 * - project_id: Filter by project ID
 * - status: Filter by status (active, completed, paused, archived)
 * 
 * Example: GET /api/missions?project_id=123...&status=active
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')
    const status = searchParams.get('status')
    
    let query = supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Filter by project_id if provided
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return errorResponse('Failed to fetch missions', 500)
    }
    
    return successResponse({
      missions: data as Mission[],
      count: data.length,
    })
    
  } catch (error) {
    console.error('Missions fetch error:', error)
    return errorResponse('Failed to fetch missions', 500)
  }
}

/**
 * POST /api/missions
 * Creates a new mission
 * 
 * Required headers:
 * - x-wallet-address: User's wallet address (must be project founder)
 * 
 * Request body:
 * {
 *   "project_id": string (UUID),
 *   "title": string (5-200 chars),
 *   "description"?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const wallet = requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    
    // Validate required fields
    if (!body.project_id || !body.title) {
      return errorResponse('Missing required fields: project_id, title', 400)
    }
    
    // Validate title length
    if (body.title.length < 5 || body.title.length > 200) {
      return errorResponse('Title must be between 5 and 200 characters', 400)
    }
    
    // Verify project exists and user is the founder
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, founder_wallet_address')
      .eq('id', body.project_id)
      .single()
    
    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return errorResponse('Project not found', 404)
      }
      console.error('Database error:', projectError)
      return errorResponse('Failed to verify project', 500)
    }
    
    // Check if user is the founder
    if (project.founder_wallet_address.toLowerCase() !== wallet.toLowerCase()) {
      return errorResponse(
        'Unauthorized: Only the project founder can create missions',
        403
      )
    }
    
    // Insert into database
    const { data: mission, error } = await supabase
      .from('missions')
      .insert({
        project_id: body.project_id,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        status: 'active',
      })
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return errorResponse('Failed to create mission', 500)
    }
    
    return successResponse(
      {
        message: 'Mission created successfully',
        mission: mission as Mission,
      },
      201
    )
    
  } catch (error) {
    console.error('Mission creation error:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to create mission', 500)
  }
}

