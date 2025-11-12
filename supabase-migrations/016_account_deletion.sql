-- Migration: Account Deletion Functions
-- Author: CrowdStaking Team
-- Date: 2025-11-12
-- Description: GDPR-compliant account deletion with content anonymization

-- Function 1: Anonymize user-generated content
-- This preserves platform integrity while removing personal data
CREATE OR REPLACE FUNCTION anonymize_user_content(wallet_text TEXT)
RETURNS void AS $$
BEGIN
  -- Anonymize proposals
  -- Set creator_address to NULL for all proposals by this user
  UPDATE proposals 
  SET creator_address = NULL
  WHERE creator_address = wallet_text;
  
  -- Anonymize blog posts
  -- Set author info to NULL/"Deleted User"
  UPDATE blog_posts 
  SET 
    author_address = NULL,
    author_name = 'Deleted User'
  WHERE author_address = wallet_text;
  
  -- Anonymize blog comments
  -- Set author info to NULL/"Deleted User"
  UPDATE blog_comments 
  SET 
    author_address = NULL,
    author_name = 'Deleted User'
  WHERE author_address = wallet_text;
  
  RAISE NOTICE 'Anonymized content for wallet: %', wallet_text;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Delete user account
-- This is the main deletion function that handles all cleanup
CREATE OR REPLACE FUNCTION delete_user_account(wallet_text TEXT)
RETURNS void AS $$
BEGIN
  -- Step 1: Anonymize all user-generated content
  -- This must happen BEFORE deleting the profile to maintain FK integrity
  PERFORM anonymize_user_content(wallet_text);
  
  -- Step 2: Delete the profile
  -- This will CASCADE delete the following via existing FK constraints:
  --   - profile_stats (ON DELETE CASCADE)
  --   - user_badges (ON DELETE CASCADE)
  --   - follows (both directions, ON DELETE CASCADE)
  --   - user_bookmarks (both directions, ON DELETE CASCADE)
  --   - endorsements (both directions, ON DELETE CASCADE)
  --   - activity_timeline (ON DELETE CASCADE)
  --   - profile_privacy (ON DELETE CASCADE)
  DELETE FROM profiles WHERE wallet_address = wallet_text;
  
  RAISE NOTICE 'Deleted account for wallet: %', wallet_text;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON FUNCTION anonymize_user_content(TEXT) IS 
  'Anonymizes all user-generated content (proposals, blog posts, comments) by removing personal identifiers';

COMMENT ON FUNCTION delete_user_account(TEXT) IS 
  'GDPR-compliant account deletion: anonymizes content, then deletes profile and all related data via CASCADE';

-- Grant execute permissions (adjust if you have specific roles)
-- For development, these are typically accessible to authenticated users via RPC
GRANT EXECUTE ON FUNCTION anonymize_user_content(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_account(TEXT) TO authenticated;

