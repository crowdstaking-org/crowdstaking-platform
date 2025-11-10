-- Migration: Create social features tables
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Follow system, bookmarks, and endorsements

-- Follow System
CREATE TABLE IF NOT EXISTS follows (
  follower_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  following_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  PRIMARY KEY (follower_address, following_address),
  
  -- Cannot follow yourself
  CHECK (follower_address != following_address)
);

-- Indexes for follow queries
CREATE INDEX IF NOT EXISTS idx_follows_follower 
  ON follows(follower_address);

CREATE INDEX IF NOT EXISTS idx_follows_following 
  ON follows(following_address);

-- Bookmarks (save users for later)
CREATE TABLE IF NOT EXISTS user_bookmarks (
  bookmarker_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  bookmarked_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  PRIMARY KEY (bookmarker_address, bookmarked_address),
  
  -- Cannot bookmark yourself
  CHECK (bookmarker_address != bookmarked_address),
  
  -- Notes length limit
  CONSTRAINT user_bookmarks_notes_length 
    CHECK (notes IS NULL OR length(notes) <= 500)
);

-- Endorsements (LinkedIn-style skill endorsements)
CREATE TABLE IF NOT EXISTS endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endorser_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  endorsed_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Each endorser can endorse each skill only once per person
  UNIQUE(endorser_address, endorsed_address, skill),
  
  -- Cannot endorse yourself
  CHECK (endorser_address != endorsed_address),
  
  -- Constraints
  CONSTRAINT endorsements_skill_length 
    CHECK (length(skill) >= 2 AND length(skill) <= 50),
  CONSTRAINT endorsements_message_length 
    CHECK (message IS NULL OR length(message) <= 500)
);

-- Indexes for endorsements
CREATE INDEX IF NOT EXISTS idx_endorsements_endorsed 
  ON endorsements(endorsed_address);

CREATE INDEX IF NOT EXISTS idx_endorsements_skill 
  ON endorsements(endorsed_address, skill);

-- Function to update follower/following counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update follower's following count
    UPDATE profile_stats 
    SET following_count = following_count + 1
    WHERE wallet_address = NEW.follower_address;
    
    -- Update following's followers count
    UPDATE profile_stats 
    SET followers_count = followers_count + 1
    WHERE wallet_address = NEW.following_address;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Update follower's following count
    UPDATE profile_stats 
    SET following_count = GREATEST(0, following_count - 1)
    WHERE wallet_address = OLD.follower_address;
    
    -- Update following's followers count
    UPDATE profile_stats 
    SET followers_count = GREATEST(0, followers_count - 1)
    WHERE wallet_address = OLD.following_address;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_follow_changed
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- Function to update endorsement counts
CREATE OR REPLACE FUNCTION update_endorsement_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profile_stats 
    SET endorsements_count = endorsements_count + 1
    WHERE wallet_address = NEW.endorsed_address;
    
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profile_stats 
    SET endorsements_count = GREATEST(0, endorsements_count - 1)
    WHERE wallet_address = OLD.endorsed_address;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_endorsement_changed
AFTER INSERT OR DELETE ON endorsements
FOR EACH ROW EXECUTE FUNCTION update_endorsement_count();

-- Comments
COMMENT ON TABLE follows IS 
  'User follow relationships (similar to Twitter/GitHub)';

COMMENT ON TABLE user_bookmarks IS 
  'Private bookmarks to save interesting users with personal notes';

COMMENT ON TABLE endorsements IS 
  'Skill endorsements from other users (LinkedIn-style)';

COMMENT ON COLUMN user_bookmarks.notes IS 
  'Private notes visible only to the bookmarker';

