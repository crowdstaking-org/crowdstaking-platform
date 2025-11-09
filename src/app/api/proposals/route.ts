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
 *   "requested_cstake_amount": number (> 0)
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
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        creator_wallet_address: wallet,
        title: data.title.trim(),
        description: data.description.trim(),
        deliverable: data.deliverable.trim(),
        requested_cstake_amount: data.requested_cstake_amount,
      })
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
 * Retrieves all proposals (for MVP - will add filtering later)
 */
export async function GET() {
  try {
    // Optional: Get wallet for user-specific queries later
    // For MVP, return all proposals
    
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })
    
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

