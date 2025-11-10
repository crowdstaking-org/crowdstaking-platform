/**
 * Bookmark API
 * POST /api/social/bookmark - Bookmark a user
 * DELETE /api/social/bookmark - Remove bookmark
 * GET /api/social/bookmarks - Get bookmarked users
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAuthenticatedWallet } from '@/lib/auth'

/**
 * GET /api/social/bookmarks
 * Get bookmarked users
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get bookmarks with profile info
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select(
        `
        bookmarked_address,
        notes,
        created_at,
        profiles:bookmarked_address (
          wallet_address,
          display_name,
          avatar_url,
          bio,
          trust_score
        )
      `
      )
      .eq('bookmarker_address', walletAddress)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
      return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
    }

    return NextResponse.json({ bookmarks: data || [] })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/social/bookmark
 * Bookmark a user
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const { bookmarked_address, notes } = await request.json()

    if (!bookmarked_address || !bookmarked_address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Cannot bookmark yourself
    if (walletAddress.toLowerCase() === bookmarked_address.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot bookmark yourself' }, { status: 400 })
    }

    // Insert bookmark
    const { error } = await supabase.from('user_bookmarks').insert({
      bookmarker_address: walletAddress,
      bookmarked_address: bookmarked_address,
      notes: notes || null,
    })

    if (error) {
      if (error.code === '23505') {
        // Already bookmarked - update notes instead
        const { error: updateError } = await supabase
          .from('user_bookmarks')
          .update({ notes: notes || null, updated_at: new Date().toISOString() })
          .eq('bookmarker_address', walletAddress)
          .eq('bookmarked_address', bookmarked_address)

        if (updateError) {
          console.error('Error updating bookmark:', updateError)
          return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 })
        }

        return NextResponse.json({ success: true, updated: true })
      }

      console.error('Error bookmarking user:', error)
      return NextResponse.json({ error: 'Failed to bookmark user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error bookmarking user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/social/bookmark
 * Remove bookmark
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get address from query params
    const url = new URL(request.url)
    const bookmarked_address = url.searchParams.get('address')

    if (!bookmarked_address || !bookmarked_address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Delete bookmark
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('bookmarker_address', walletAddress)
      .eq('bookmarked_address', bookmarked_address)

    if (error) {
      console.error('Error removing bookmark:', error)
      return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing bookmark:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

