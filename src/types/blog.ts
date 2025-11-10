/**
 * Blog Types & Validation
 * Type definitions and Zod schemas for blog posts and comments
 */

import { z } from 'zod'
import { Profile } from './profile'

// Blog Post Status
export type BlogPostStatus = 'draft' | 'published'

// Blog Post Interface
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  author_wallet_address: string
  status: BlogPostStatus
  published_at: string | null
  tags: string[]
  view_count: number
  created_at: string
  updated_at: string
  author?: Profile // Optional joined author info
}

// Blog Comment Interface
export interface BlogComment {
  id: string
  post_id: string
  author_wallet_address: string
  content: string
  created_at: string
  author?: Profile // Optional joined author info
}

// Create Blog Post Input
export interface CreateBlogPostInput {
  title: string
  content: string
  tags: string[]
  status: BlogPostStatus
}

// Update Blog Post Input (all fields optional except what's being updated)
export interface UpdateBlogPostInput {
  title?: string
  content?: string
  tags?: string[]
  status?: BlogPostStatus
}

// Create Comment Input
export interface CreateCommentInput {
  content: string
}

// Zod Schemas for Validation
export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be max 200 characters'),
  content: z.string().min(1, 'Content is required').max(50000, 'Content must be max 50000 characters'),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'published']),
})

export const updateBlogPostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(50000).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment must be max 1000 characters'),
})

/**
 * Generate URL-friendly slug from title
 * Converts to lowercase, replaces spaces/special chars with hyphens
 * @param title - The blog post title
 * @returns URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace umlauts and special characters
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    // Replace spaces and non-alphanumeric chars with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
}

/**
 * Generate excerpt from content (first 200 characters)
 * Strips markdown formatting
 * @param content - The full blog post content
 * @returns Excerpt string
 */
export function generateExcerpt(content: string, maxLength: number = 200): string {
  // Strip markdown formatting
  const stripped = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .trim()
  
  if (stripped.length <= maxLength) {
    return stripped
  }
  
  // Cut at word boundary
  const truncated = stripped.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...'
}

