/**
 * Admin Blog Posts API
 * GET /api/blog/admin/posts - Fetch all blog posts (including drafts)
 * POST /api/blog/admin/posts - Create new blog post
 * 
 * Requires super-admin authentication
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireSuperAdmin } from '@/lib/auth'
import { blogPostSchema, generateSlug } from '@/types/blog'
import type { BlogPost } from '@/types/blog'

/**
 * GET /api/blog/admin/posts
 * 
 * Fetches all blog posts including drafts for admin management
 * Requires super-admin authentication
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * 
 * @returns All blog posts with author info, paginated
 */
export async function GET(request: NextRequest) {
  try {
    // Verify super-admin authentication
    await requireSuperAdmin(request)
    
    // Get pagination params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = (page - 1) * limit
    
    // Fetch posts with author info
    const { data, error, count } = await supabase
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
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
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
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 403)
    }
    
    // Handle other errors
    console.error('Admin blog posts GET error:', error)
    return errorResponse(
      error.message || 'Failed to fetch blog posts',
      500
    )
  }
}

/**
 * POST /api/blog/admin/posts
 * 
 * Creates a new blog post
 * Requires super-admin authentication
 * 
 * Body: { title, content, tags, status }
 * 
 * @returns Created blog post
 */
export async function POST(request: NextRequest) {
  try {
    // Verify super-admin authentication
    const walletAddress = await requireSuperAdmin(request)
    
    // Parse and validate request body
    const body = await request.json()
    const validated = blogPostSchema.parse(body)
    
    // Generate slug from title
    const slug = generateSlug(validated.title)
    
    // Check if slug already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (existing) {
      return errorResponse('A post with this title already exists', 400)
    }
    
    // Prepare post data
    const postData = {
      title: validated.title,
      slug,
      content: validated.content,
      tags: validated.tags,
      status: validated.status,
      author_wallet_address: walletAddress,
      published_at: validated.status === 'published' ? new Date().toISOString() : null,
    }
    
    // Insert post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
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
      console.error('Error creating blog post:', error)
      throw error
    }
    
    return successResponse(data as BlogPost, 201)
    
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
    console.error('Admin blog posts POST error:', error)
    return errorResponse(
      error.message || 'Failed to create blog post',
      500
    )
  }
}

