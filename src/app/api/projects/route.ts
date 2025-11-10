/**
 * Projects API Endpoint
 * Handles project creation and retrieval
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'
import type { Project } from '@/types/project'

/**
 * GET /api/projects
 * Retrieves projects with optional filtering
 * 
 * Query parameters:
 * - founder: Filter by founder wallet address
 * 
 * Example: GET /api/projects?founder=0x123...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const founderAddress = searchParams.get('founder')
    
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Filter by founder if provided
    if (founderAddress) {
      query = query.eq('founder_wallet_address', founderAddress.toLowerCase())
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return errorResponse('Failed to fetch projects', 500)
    }
    
    return successResponse({
      projects: data as Project[],
      count: data.length,
    })
    
  } catch (error) {
    console.error('Projects fetch error:', error)
    return errorResponse('Failed to fetch projects', 500)
  }
}

/**
 * POST /api/projects
 * Creates a new project
 * 
 * Required headers:
 * - x-wallet-address: Founder's wallet address
 * 
 * Request body:
 * {
 *   "name": string,
 *   "description"?: string,
 *   "token_name": string,
 *   "token_symbol": string,
 *   "total_supply"?: number (default: 1000000000)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const wallet = requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.token_name || !body.token_symbol) {
      return errorResponse(
        'Missing required fields: name, token_name, token_symbol',
        400
      )
    }
    
    // Validate token symbol length
    if (body.token_symbol.length < 2 || body.token_symbol.length > 10) {
      return errorResponse(
        'Token symbol must be between 2 and 10 characters',
        400
      )
    }
    
    // Check if user already has a project (MVP: one project per founder)
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('founder_wallet_address', wallet.toLowerCase())
      .limit(1)
    
    if (existingProjects && existingProjects.length > 0) {
      return errorResponse(
        'You already have a project. Multiple projects per founder will be supported in a future update.',
        400
      )
    }
    
    // Insert into database
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        founder_wallet_address: wallet.toLowerCase(),
        name: body.name.trim(),
        description: body.description?.trim() || null,
        token_name: body.token_name.trim(),
        token_symbol: body.token_symbol.trim().toUpperCase(),
        total_supply: body.total_supply || 1000000000,
        token_status: 'illiquid',
        status: 'active',
      })
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return errorResponse('Failed to create project', 500)
    }
    
    return successResponse(
      {
        message: 'Project created successfully',
        project: project as Project,
      },
      201
    )
    
  } catch (error) {
    console.error('Project creation error:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to create project', 500)
  }
}

