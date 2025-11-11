-- Migration: Create profiles table
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Stores user profiles with display names and social links

CREATE TABLE IF NOT EXISTS profiles (
  wallet_address TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Constraints
  CONSTRAINT profiles_wallet_address_check 
    CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$'),
  CONSTRAINT profiles_display_name_length 
    CHECK (length(display_name) >= 2 AND length(display_name) <= 100),
  CONSTRAINT profiles_bio_length 
    CHECK (bio IS NULL OR length(bio) <= 500)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_created_at 
  ON profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_github_username 
  ON profiles(github_username) 
  WHERE github_username IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE profiles IS 
  'User profiles with display names and social links';

COMMENT ON COLUMN profiles.wallet_address IS 
  'Ethereum wallet address (primary key, must start with 0x)';

COMMENT ON COLUMN profiles.display_name IS 
  'Public display name for the user (required)';

COMMENT ON COLUMN profiles.bio IS 
  'Short biography or description (max 500 characters)';

COMMENT ON COLUMN profiles.github_username IS 
  'GitHub username for social linking';


