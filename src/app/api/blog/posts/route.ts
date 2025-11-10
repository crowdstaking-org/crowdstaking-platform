/**
 * Public Blog Posts API
 * GET /api/blog/posts - Fetch published blog posts
 * 
 * Public endpoint (no authentication required)
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import type { BlogPost } from '@/types/blog'

/**
 * GET /api/blog/posts
 * 
 * Fetches published blog posts with author info
 * Public endpoint
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - tag: Filter by tag (optional)
 * 
 * @returns Published blog posts with author info, paginated
 */
export async function GET(request: NextRequest) {
  try {
    // Get query params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const tag = searchParams.get('tag')
    const offset = (page - 1) * limit
    
    // Build query - only published posts
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles!fk_blog_posts_author (
          wallet_address,
          display_name,
          avatar_url,
          github_username
        )
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    
    // Apply tag filter if provided
    if (tag) {
      query = query.contains('tags', [tag])
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    // Execute query
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }
    
    return successResponse({
      posts: data as BlogPost[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error: any) {
    console.error('Blog posts GET error:', error)
    return errorResponse(
      error.message || 'Failed to fetch blog posts',
      500
    )
  }
}
