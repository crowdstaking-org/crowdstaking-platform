/**
 * Profile Types
 * User profiles with display names and social links
 */

/**
 * Core profile interface
 * Represents a user profile in the CrowdStaking platform
 */
export interface Profile {
  wallet_address: string
  display_name: string
  bio?: string
  avatar_url?: string
  github_username?: string
  created_at: string
  updated_at: string
}

/**
 * Profile creation input
 * Used when inserting new profiles
 */
export interface CreateProfileInput {
  wallet_address: string
  display_name: string
  bio?: string
  avatar_url?: string
  github_username?: string
}

