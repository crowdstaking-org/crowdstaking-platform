/**
 * Proposal Types and Validation Schema
 * Defines the structure and validation rules for proposal submissions
 */

import { z } from 'zod'

/**
 * Zod validation schema for proposal form data
 * Ensures all fields meet requirements before submission
 */
export const proposalSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .refine(val => val.trim().length >= 5, 'Title cannot be just whitespace'),
  
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .refine(val => val.trim().length >= 50, 'Description cannot be just whitespace'),
  
  deliverable: z.string()
    .min(20, 'Deliverable must be at least 20 characters')
    .max(2000, 'Deliverable must be less than 2000 characters')
    .refine(val => val.trim().length >= 20, 'Deliverable cannot be just whitespace'),
  
  requested_cstake_amount: z.number()
    .positive('Amount must be greater than 0')
    .max(1000000, 'Amount must be less than 1,000,000')
    .refine(val => !isNaN(val), 'Amount must be a valid number'),
})

/**
 * TypeScript type inferred from the Zod schema
 * Used for form state management
 */
export type ProposalFormData = z.infer<typeof proposalSchema>

/**
 * Status of a proposal in the double handshake process
 * - pending_review: Initial state, awaiting admin review
 * - counter_offer_pending: Admin made counter-offer, awaiting pioneer response
 * - approved: Admin approved, awaiting pioneer acceptance
 * - accepted: Both parties agreed, triggers smart contract agreement creation
 * - work_in_progress: Smart contract created, pioneer is working on deliverable
 * - completed: Work verified and tokens released to pioneer
 * - rejected: Rejected by admin or pioneer (final failure state)
 */
export type ProposalStatus = 
  | 'pending_review'
  | 'counter_offer_pending'
  | 'approved'
  | 'accepted'
  | 'work_in_progress'
  | 'completed'
  | 'rejected'

/**
 * Creator profile data (optional, loaded via join)
 */
export interface ProposalCreator {
  wallet_address: string
  display_name: string
  avatar_url?: string
  trust_score?: number
}

/**
 * Complete proposal interface including database fields
 * Used when fetching proposals from the API
 */
export interface Proposal {
  id: string
  creator_wallet_address: string
  title: string
  description: string
  deliverable: string
  requested_cstake_amount: number
  created_at: string
  status: ProposalStatus
  foundation_offer_cstake_amount?: number
  foundation_notes?: string
  // Smart contract fields (Phase 5)
  contract_agreement_tx?: string | null
  contract_release_tx?: string | null
  pioneer_confirmed_at?: string | null
  // Profile data (loaded via API join)
  creator?: ProposalCreator
}

/**
 * API response for successful proposal creation
 */
export interface CreateProposalResponse {
  success: boolean
  message: string
  proposal: Proposal
}

/**
 * API response for fetching proposals list
 */
export interface ProposalsListResponse {
  success: boolean
  proposals: Proposal[]
  count: number
}

