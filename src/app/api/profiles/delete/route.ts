/**
 * Account Deletion API
 * DELETE /api/profiles/delete - Delete authenticated user's account
 * GDPR-compliant account deletion with content anonymization
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAuthenticatedWallet } from '@/lib/auth'

/**
 * DELETE /api/profiles/delete
 * Permanently delete authenticated user's account
 * 
 * Process:
 * 1. Verify authentication
 * 2. Call SQL function to anonymize content
 * 3. Delete profile (CASCADE deletes related data)
 * 
 * GDPR Compliance:
 * - Deletes all personal data
 * - Anonymizes user-generated content
 * - Follows Art. 17 GDPR (Right to be forgotten)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Step 1: Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🗑️  Account deletion request for:', walletAddress)

    // Step 2: Call SQL function to delete account
    // This function will:
    // - Anonymize proposals, blog posts, comments
    // - Delete profile (CASCADE deletes stats, badges, follows, etc.)
    const { error } = await supabase.rpc('delete_user_account', {
      wallet_text: walletAddress
    })

    if (error) {
      console.error('❌ Account deletion failed:', error)
      return NextResponse.json(
        { error: 'Account deletion failed. Please try again.' },
        { status: 500 }
      )
    }

    console.log('✅ Account deleted successfully:', walletAddress)

    // Step 3: Return success response
    // The client will handle logout and redirect
    return NextResponse.json({
      message: 'Account deleted successfully',
      wallet: walletAddress
    })

  } catch (error) {
    console.error('❌ Error deleting account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

