/**
 * Public Blog Post Detail API
 * GET /api/blog/posts/[slug] - Fetch single published blog post by slug
 * 
 * Public endpoint (no authentication required)
 * Increments view count on each request
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import type { BlogPost } from '@/types/blog'

/**
 * GET /api/blog/posts/[slug]
 * 
 * Fetches a single published blog post by slug
 * Increments view count on each request
 * Public endpoint
 * 
 * @returns Blog post with author info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Fetch post with author info (only published)
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles!fk_blog_posts_author (
          wallet_address,
          display_name,
          avatar_url,
          github_username
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Blog post not found', 404)
      }
      console.error('Error fetching blog post:', error)
      throw error
    }
    
    // Increment view count asynchronously (don't wait for it)
    supabase
      .from('blog_posts')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', data.id)
      .then(({ error: updateError }) => {
        if (updateError) {
          console.error('Error updating view count:', updateError)
        }
      })
    
    return successResponse(data as BlogPost)
    
  } catch (error: any) {
    console.error('Blog post GET error:', error)
    return errorResponse(
      error.message || 'Failed to fetch blog post',
      500
    )
  }
}
