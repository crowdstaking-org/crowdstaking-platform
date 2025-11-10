-- Migration: Create profile stats table
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Cached metrics for contributor and founder performance

CREATE TABLE IF NOT EXISTS profile_stats (
  wallet_address TEXT PRIMARY KEY REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  
  -- Contributor Metrics
  proposals_submitted INTEGER DEFAULT 0,
  proposals_accepted INTEGER DEFAULT 0,
  proposals_completed INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  completion_rate NUMERIC DEFAULT 0, -- % completed vs accepted
  avg_response_time_hours NUMERIC,
  
  -- Founder Metrics
  projects_created INTEGER DEFAULT 0,
  projects_live INTEGER DEFAULT 0,
  missions_created INTEGER DEFAULT 0,
  total_missions_payout NUMERIC DEFAULT 0,
  
  -- Social Metrics
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  endorsements_count INTEGER DEFAULT 0,
  
  -- Activity Metrics
  last_active_at TIMESTAMPTZ DEFAULT now(),
  streak_days INTEGER DEFAULT 0,
  total_activity_days INTEGER DEFAULT 0,
  
  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Constraints
  CONSTRAINT profile_stats_proposals_positive 
    CHECK (proposals_submitted >= 0 AND proposals_accepted >= 0 AND proposals_completed >= 0),
  CONSTRAINT profile_stats_completion_rate_range 
    CHECK (completion_rate >= 0 AND completion_rate <= 100),
  CONSTRAINT profile_stats_social_positive 
    CHECK (followers_count >= 0 AND following_count >= 0 AND endorsements_count >= 0),
  CONSTRAINT profile_stats_streak_positive 
    CHECK (streak_days >= 0 AND total_activity_days >= 0)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profile_stats_completion_rate 
  ON profile_stats(completion_rate DESC) 
  WHERE proposals_accepted >= 5;

CREATE INDEX IF NOT EXISTS idx_profile_stats_missions_completed 
  ON profile_stats(missions_completed DESC);

CREATE INDEX IF NOT EXISTS idx_profile_stats_projects_live 
  ON profile_stats(projects_live DESC);

CREATE INDEX IF NOT EXISTS idx_profile_stats_last_active 
  ON profile_stats(last_active_at DESC);

-- Auto-create stats row when profile is created
CREATE OR REPLACE FUNCTION create_default_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profile_stats (wallet_address)
  VALUES (NEW.wallet_address)
  ON CONFLICT (wallet_address) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created_stats
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION create_default_profile_stats();

-- Comments
COMMENT ON TABLE profile_stats IS 
  'Cached performance metrics for users (updated by backend services)';

COMMENT ON COLUMN profile_stats.completion_rate IS 
  'Percentage of accepted proposals that were completed';

COMMENT ON COLUMN profile_stats.avg_response_time_hours IS 
  'Average time in hours to submit a proposal after mission posting';

