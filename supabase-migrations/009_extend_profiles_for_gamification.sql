-- Migration: Extend profiles for gamification
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Adds gamification fields to profiles table

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'open',
ADD COLUMN IF NOT EXISTS twitter_username TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS total_earned_tokens NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS trust_score NUMERIC DEFAULT 50,
ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;

-- Add constraints
ALTER TABLE profiles
ADD CONSTRAINT profiles_availability_status_check 
  CHECK (availability_status IN ('open', 'busy', 'unavailable'));

ALTER TABLE profiles
ADD CONSTRAINT profiles_trust_score_range 
  CHECK (trust_score >= 0 AND trust_score <= 100);

ALTER TABLE profiles
ADD CONSTRAINT profiles_total_earned_tokens_positive 
  CHECK (total_earned_tokens >= 0);

ALTER TABLE profiles
ADD CONSTRAINT profiles_profile_views_positive 
  CHECK (profile_views >= 0);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_trust_score 
  ON profiles(trust_score DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_availability 
  ON profiles(availability_status) 
  WHERE availability_status = 'open';

CREATE INDEX IF NOT EXISTS idx_profiles_skills 
  ON profiles USING GIN(skills);

-- Comments
COMMENT ON COLUMN profiles.skills IS 
  'Array of skill tags (e.g., ["Solidity", "React", "Design"])';

COMMENT ON COLUMN profiles.availability_status IS 
  'Current availability: open, busy, or unavailable';

COMMENT ON COLUMN profiles.total_earned_tokens IS 
  'Cached total earnings across all missions';

COMMENT ON COLUMN profiles.trust_score IS 
  'Trust/reputation score from 0-100, calculated periodically';

COMMENT ON COLUMN profiles.profile_views IS 
  'Number of times this profile has been viewed';

