-- Migration: Add email to profiles table
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Adds email field to profiles for super-admin identification

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Create index on email for super-admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email 
  ON profiles(email) 
  WHERE email IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.email IS 
  'Email address for super-admin identification (optional, unique)';

