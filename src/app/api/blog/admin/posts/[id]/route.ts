/**
 * Admin Blog Post Detail API
 * GET /api/blog/admin/posts/[id] - Fetch single blog post
 * PUT /api/blog/admin/posts/[id] - Update blog post
 * DELETE /api/blog/admin/posts/[id] - Delete blog post
 * 
 * Requires super-admin authentication
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireSuperAdmin } from '@/lib/auth'
import { updateBlogPostSchema, generateSlug } from '@/types/blog'
import type { BlogPost } from '@/types/blog'

/**
 * GET /api/blog/admin/posts/[id]
 * 
 * Fetches a single blog post by ID (including drafts)
 * Requires super-admin authentication
 * 
 * @returns Blog post with author info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify super-admin authentication
    await requireSuperAdmin(request)
    
    const { id } = await params
    
    // Fetch post with author info
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
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Blog post not found', 404)
      }
      console.error('Error fetching blog post:', error)
      throw error
    }
    
    return successResponse(data as BlogPost)
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 403)
    }
    
    // Handle other errors
    console.error('Admin blog post GET error:', error)
    return errorResponse(
      error.message || 'Failed to fetch blog post',
      500
    )
  }
}

/**
 * PUT /api/blog/admin/posts/[id]
 * 
 * Updates a blog post
 * Requires super-admin authentication
 * 
 * Body: { title?, content?, tags?, status? }
 * 
 * @returns Updated blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify super-admin authentication
    await requireSuperAdmin(request)
    
    const { id } = await params
    
    // Parse and validate request body
    const body = await request.json()
    const validated = updateBlogPostSchema.parse(body)
    
    // Check if post exists
    const { data: existing, error: fetchError } = await supabase
      .from('blog_posts')
      .select('slug, status')
      .eq('id', id)
      .single()
    
    if (fetchError || !existing) {
      return errorResponse('Blog post not found', 404)
    }
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }
    
    if (validated.title !== undefined) {
      updateData.title = validated.title
      updateData.slug = generateSlug(validated.title)
      
      // Check if new slug conflicts with another post
      if (updateData.slug !== existing.slug) {
        const { data: slugConflict } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', updateData.slug)
          .neq('id', id)
          .single()
        
        if (slugConflict) {
          return errorResponse('A post with this title already exists', 400)
        }
      }
    }
    
    if (validated.content !== undefined) {
      updateData.content = validated.content
    }
    
    if (validated.tags !== undefined) {
      updateData.tags = validated.tags
    }
    
    if (validated.status !== undefined) {
      updateData.status = validated.status
      
      // Set published_at when changing from draft to published
      if (validated.status === 'published' && existing.status === 'draft') {
        updateData.published_at = new Date().toISOString()
      }
      
      // Clear published_at when changing from published to draft
      if (validated.status === 'draft' && existing.status === 'published') {
        updateData.published_at = null
      }
    }
    
    // Update post
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        author:profiles!fk_blog_posts_author (
          wallet_address,
          display_name,
          avatar_url,
          github_username
        )
      `)
      .single()
    
    if (error) {
      console.error('Error updating blog post:', error)
      throw error
    }
    
    return successResponse(data as BlogPost)
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 403)
    }
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return errorResponse('Validation failed', 400, error.errors)
    }
    
    // Handle other errors
    console.error('Admin blog post PUT error:', error)
    return errorResponse(
      error.message || 'Failed to update blog post',
      500
    )
  }
}

/**
 * DELETE /api/blog/admin/posts/[id]
 * 
 * Deletes a blog post (CASCADE deletes all comments)
 * Requires super-admin authentication
 * 
 * @returns Success message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify super-admin authentication
    await requireSuperAdmin(request)
    
    const { id } = await params
    
    // Delete post (CASCADE will delete comments)
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting blog post:', error)
      throw error
    }
    
    return successResponse({ message: 'Blog post deleted successfully' })
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 403)
    }
    
    // Handle other errors
    console.error('Admin blog post DELETE error:', error)
    return errorResponse(
      error.message || 'Failed to delete blog post',
      500
    )
  }
}

