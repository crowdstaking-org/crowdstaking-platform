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
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    
    // Apply tag filter if provided
    if (tag) {
      query = query.contains('tags', [tag])
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    // Execute query
    const { data: posts, error, count } = await query
    
    if (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }

    // Manual join for authors
    let postsWithAuthors = posts as BlogPost[]
    if (posts && posts.length > 0) {
      // Collect unique author IDs
      const authorIds = Array.from(new Set(posts.map((p: any) => p.author_id).filter(id => id)))
      
      // Fetch authors from blog_authors table
      const { data: authors, error: authorsError } = await supabase
        .from('blog_authors')
        .select('id, name, avatar_url, slug')
        .in('id', authorIds)
        
      if (!authorsError && authors) {
        // Map authors by ID for O(1) lookup
        const authorMap = new Map(authors.map(a => [a.id, a]))
        
        // Attach author to posts
        postsWithAuthors = posts.map((post: any) => {
           const authorData = authorMap.get(post.author_id);
           return {
            ...post,
            author: authorData ? {
              display_name: authorData.name, // Map 'name' to 'display_name' for frontend compatibility
              avatar_url: authorData.avatar_url,
              slug: authorData.slug,
              wallet_address: null // Blog authors might not have wallets linked here
            } : {
              display_name: 'Unknown Author',
              avatar_url: null,
              slug: null,
              wallet_address: null
            }
          }
        })
      }
    }
    
    return successResponse({
      posts: postsWithAuthors,
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
