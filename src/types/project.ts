/**
 * Project Types and Interfaces
 * Defines the structure for projects and project-related data
 */

/**
 * Project token status lifecycle
 * - illiquid: No DEX liquidity, tokens cannot be traded
 * - pending: Liquidity wizard in progress
 * - live: Tokens are tradeable on DEX
 */
export type TokenStatus = 'illiquid' | 'pending' | 'live'

/**
 * Project lifecycle status
 * - active: Project is active and accepting proposals
 * - paused: Temporarily paused
 * - archived: No longer active
 */
export type ProjectStatus = 'active' | 'paused' | 'archived'

/**
 * Core project interface
 * Represents a project in the CrowdStaking platform
 */
export interface Project {
  id: string
  created_at: string
  updated_at: string
  
  // Founder
  founder_wallet_address: string
  
  // Metadata
  name: string
  description?: string
  
  // Token Information
  token_name: string
  token_symbol: string
  total_supply: number
  
  // Status
  token_status: TokenStatus
  status: ProjectStatus
}

/**
 * Project statistics computed on-the-fly
 * Used for dashboard displays
 */
export interface ProjectStats {
  // Missions
  active_missions_count: number
  total_missions_count: number
  
  // Proposals
  total_proposals_count: number
  pending_proposals_count: number
  approved_proposals_count: number
  work_in_progress_count: number
  completed_proposals_count: number
  
  // Team
  team_members_count: number
  
  // Tokens
  distributed_tokens_percentage: number
}

/**
 * API response for creating a project
 */
export interface CreateProjectResponse {
  success: boolean
  message: string
  project: Project
}

/**
 * API response for fetching projects list
 */
export interface ProjectsListResponse {
  success: boolean
  projects: Project[]
  count: number
}

/**
 * API response for fetching project stats
 */
export interface ProjectStatsResponse {
  success: boolean
  stats: ProjectStats
}

