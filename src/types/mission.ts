/**
 * Mission Types and Interfaces
 * Defines the structure for missions (groupings of proposals within projects)
 */

/**
 * Mission lifecycle status
 * - active: Accepting proposals
 * - completed: Mission accomplished
 * - paused: Temporarily on hold
 * - archived: No longer relevant
 */
export type MissionStatus = 'active' | 'completed' | 'paused' | 'archived'

/**
 * Core mission interface
 * Represents a mini-mission within a project
 */
export interface Mission {
  id: string
  created_at: string
  updated_at: string
  
  // Foreign Keys
  project_id: string
  
  // Mission Details
  title: string
  description?: string
  
  // Status
  status: MissionStatus
}

/**
 * Mission with proposal counts
 * Extended interface including proposal statistics
 */
export interface MissionWithStats extends Mission {
  proposals_count: number
  pending_proposals_count: number
}

/**
 * API response for creating a mission
 */
export interface CreateMissionResponse {
  success: boolean
  message: string
  mission: Mission
}

/**
 * API response for fetching missions list
 */
export interface MissionsListResponse {
  success: boolean
  missions: Mission[]
  count: number
}

/**
 * API response for fetching missions with stats
 */
export interface MissionsWithStatsResponse {
  success: boolean
  missions: MissionWithStats[]
  count: number
}

