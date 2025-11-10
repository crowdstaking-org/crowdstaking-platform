/**
 * Blog Comment Detail API
 * DELETE /api/blog/comments/[id] - Delete a comment
 * 
 * Requires authentication and ownership
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'

/**
 * DELETE /api/blog/comments/[id]
 * 
 * Deletes a comment
 * Requires authentication - user can only delete their own comments
 * 
 * @returns Success message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const walletAddress = requireAuth(request)
    
    const { id } = await params
    
    // Verify comment exists and belongs to user
    const { data: comment, error: fetchError } = await supabase
      .from('blog_comments')
      .select('author_wallet_address')
      .eq('id', id)
      .single()
    
    if (fetchError || !comment) {
      return errorResponse('Comment not found', 404)
    }
    
    // Check ownership
    if (comment.author_wallet_address.toLowerCase() !== walletAddress.toLowerCase()) {
      return errorResponse('You can only delete your own comments', 403)
    }
    
    // Delete comment
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
    
    return successResponse({ message: 'Comment deleted successfully' })
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, error.message.includes('Forbidden') ? 403 : 401)
    }
    
    // Handle other errors
    console.error('Comment DELETE error:', error)
    return errorResponse(
      error.message || 'Failed to delete comment',
      500
    )
  }
}

