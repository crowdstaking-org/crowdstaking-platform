/**
 * Proposals API Endpoint
 * Handles proposal creation and retrieval
 * Phase 3: Enhanced with Zod validation
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'
import { proposalSchema } from '@/types/proposal'

/**
 * POST /api/proposals
 * Creates a new proposal
 * 
 * Required headers:
 * - x-wallet-address: User's wallet address
 * 
 * Request body:
 * {
 *   "title": string (1-200 chars),
 *   "description": string (10-5000 chars),
 *   "deliverable": string (20-2000 chars),
 *   "requested_cstake_amount": number (> 0),
 *   "project_id"?: string (UUID, optional),
 *   "mission_id"?: string (UUID, optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const wallet = requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    
    // Validate with Zod schema
    const validation = proposalSchema.safeParse(body)
    
    if (!validation.success) {
      // Return first validation error for better UX
      const firstError = validation.error.issues[0]
      return errorResponse(
        `${firstError.path.join('.')}: ${firstError.message}`,
        400
      )
    }
    
    const data = validation.data
    
    // Insert into database
    const insertData: any = {
      creator_wallet_address: wallet,
      title: data.title.trim(),
      description: data.description.trim(),
      deliverable: data.deliverable.trim(),
      requested_cstake_amount: data.requested_cstake_amount,
    }
    
    // Add optional project_id and mission_id if provided
    if (body.project_id) {
      insertData.project_id = body.project_id
    }
    
    if (body.mission_id) {
      insertData.mission_id = body.mission_id
    }
    
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return errorResponse('Failed to create proposal', 500)
    }
    
    return successResponse({
      message: 'Proposal created successfully',
      proposal
    }, 201)
    
  } catch (error) {
    console.error('Proposal creation error:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to create proposal', 500)
  }
}

/**
 * GET /api/proposals
 * Retrieves proposals with optional filtering
 * 
 * Query parameters:
 * - project_id: Filter by project ID
 * - mission_id: Filter by mission ID
 * - status: Filter by status (pending_review, approved, etc.)
 * - creator: Filter by creator wallet address
 * 
 * Example: GET /api/proposals?project_id=123...&status=pending_review
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')
    const missionId = searchParams.get('mission_id')
    const status = searchParams.get('status')
    const creator = searchParams.get('creator')
    
    let query = supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    if (missionId) {
      query = query.eq('mission_id', missionId)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (creator) {
      query = query.eq('creator_wallet_address', creator.toLowerCase())
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return errorResponse('Failed to fetch proposals', 500)
    }
    
    return successResponse({
      proposals: data,
      count: data.length
    })
    
  } catch (error) {
    console.error('Proposals fetch error:', error)
    return errorResponse('Failed to fetch proposals', 500)
  }
}

