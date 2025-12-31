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
    
    // Fetch post (only published)
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    if (postError) {
      if (postError.code === 'PGRST116') {
        return errorResponse('Blog post not found', 404)
      }
      console.error('Error fetching blog post:', postError)
      throw postError
    }
    
    // Manual join for author from blog_authors
    if (post.author_id) {
      const { data: author } = await supabase
        .from('blog_authors')
        .select('name, avatar_url, slug')
        .eq('id', post.author_id)
        .single()
      
      if (author) {
        post.author = {
          display_name: author.name,
          avatar_url: author.avatar_url,
          slug: author.slug,
          wallet_address: null
        }
      }
    }

    // Increment view count asynchronously (don't wait for it)
    supabase
      .from('blog_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id)
      .then(({ error: updateError }) => {
        if (updateError) {
          console.error('Error updating view count:', updateError)
        }
      })
    
    return successResponse(post as BlogPost)
    
  } catch (error: any) {
    console.error('Blog post GET error:', error)
    return errorResponse(
      error.message || 'Failed to fetch blog post',
      500
    )
  }
}
