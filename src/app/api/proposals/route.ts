/**
 * Proposals API Endpoint
 * Handles proposal creation and retrieval
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'

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
    const { title, description, requested_cstake_amount } = body
    
    // Validate required fields
    if (!title || typeof title !== 'string') {
      return errorResponse('Title is required and must be a string', 400)
    }
    
    if (!description || typeof description !== 'string') {
      return errorResponse('Description is required and must be a string', 400)
    }
    
    if (!requested_cstake_amount || typeof requested_cstake_amount !== 'number') {
      return errorResponse('Requested cSTAKE amount is required and must be a number', 400)
    }
    
    // Validate field lengths
    if (title.length < 1 || title.length > 200) {
      return errorResponse('Title must be between 1 and 200 characters', 400)
    }
    
    if (description.length < 10 || description.length > 5000) {
      return errorResponse('Description must be between 10 and 5000 characters', 400)
    }
    
    // Validate amount
    if (requested_cstake_amount <= 0) {
      return errorResponse('Requested cSTAKE amount must be greater than 0', 400)
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from('proposals')
      .insert({
        creator_wallet_address: wallet,
        title: title.trim(),
        description: description.trim(),
        requested_cstake_amount,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return errorResponse('Failed to create proposal', 500)
    }
    
    return successResponse({
      message: 'Proposal created successfully',
      proposal: data
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

