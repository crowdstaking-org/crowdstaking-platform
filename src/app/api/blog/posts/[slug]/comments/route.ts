/**
 * Blog Comments API
 * GET /api/blog/posts/[slug]/comments - Fetch all comments for a post
 * POST /api/blog/posts/[slug]/comments - Create new comment
 * 
 * GET is public, POST requires authentication
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'
import { commentSchema } from '@/types/blog'
import type { BlogComment } from '@/types/blog'

/**
 * GET /api/blog/posts/[slug]/comments
 * 
 * Fetches all comments for a blog post
 * Public endpoint
 * 
 * @returns Comments with author info, ordered by created_at ASC
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // First get the post ID from slug
    const { data: post } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (!post) {
      return errorResponse('Blog post not found', 404)
    }
    
    // Fetch comments with author info
    const { data, error } = await supabase
      .from('blog_comments')
      .select(`
        *,
        author:profiles!blog_comments_author_wallet_address_fkey (
          wallet_address,
          display_name,
          avatar_url,
          github_username
        )
      `)
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
    
    return successResponse({
      comments: data as BlogComment[],
      count: data?.length || 0
    })
    
  } catch (error: any) {
    console.error('Comments GET error:', error)
    return errorResponse(
      error.message || 'Failed to fetch comments',
      500
    )
  }
}

/**
 * POST /api/blog/posts/[slug]/comments
 * 
 * Creates a new comment on a blog post
 * Requires authentication
 * 
 * Body: { content }
 * 
 * @returns Created comment with author info
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Verify authentication
    const walletAddress = requireAuth(request)
    
    const { slug } = await params
    
    // Get post by slug
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id, status')
      .eq('slug', slug)
      .single()
    
    if (postError || !post) {
      return errorResponse('Blog post not found', 404)
    }
    
    if (post.status !== 'published') {
      return errorResponse('Cannot comment on unpublished posts', 400)
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validated = commentSchema.parse(body)
    
    // Create comment
    const commentData = {
      post_id: post.id,
      author_wallet_address: walletAddress,
      content: validated.content,
    }
    
    const { data, error } = await supabase
      .from('blog_comments')
      .insert([commentData])
      .select(`
        *,
        author:profiles!blog_comments_author_wallet_address_fkey (
          wallet_address,
          display_name,
          avatar_url,
          github_username
        )
      `)
      .single()
    
    if (error) {
      console.error('Error creating comment:', error)
      throw error
    }
    
    return successResponse(data as BlogComment, 201)
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 401)
    }
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return errorResponse('Validation failed', 400, error.errors)
    }
    
    // Handle other errors
    console.error('Comments POST error:', error)
    return errorResponse(
      error.message || 'Failed to create comment',
      500
    )
  }
}
