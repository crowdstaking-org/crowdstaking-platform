-- Migration: Create badges system
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Badge definitions and user badges for gamification

-- Badge Definitions (system-defined badges)
CREATE TABLE IF NOT EXISTS badge_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_emoji TEXT,
  category TEXT NOT NULL, -- 'contributor', 'founder', 'community', 'special'
  rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  criteria JSONB NOT NULL, -- Criteria for automatic badge awarding
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Constraints
  CONSTRAINT badge_definitions_category_check 
    CHECK (category IN ('contributor', 'founder', 'community', 'special')),
  CONSTRAINT badge_definitions_rarity_check 
    CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'))
);

-- User Badges (earned badges)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  
  -- Each user can earn each badge only once
  UNIQUE(wallet_address, badge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_badges_wallet 
  ON user_badges(wallet_address);

CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id 
  ON user_badges(badge_id);

CREATE INDEX IF NOT EXISTS idx_badge_definitions_category 
  ON badge_definitions(category, sort_order);

-- Insert initial badge definitions
INSERT INTO badge_definitions (id, name, description, icon_emoji, category, rarity, criteria, sort_order) VALUES
  ('first_mission', 'First Mission Complete', 'Completed your first mission on CrowdStaking', '🎯', 'contributor', 'common', '{"type": "missions_completed", "threshold": 1}'::jsonb, 10),
  ('speed_demon', 'Speed Demon', 'Completed a mission in less than 48 hours', '⚡', 'contributor', 'rare', '{"type": "fast_completion", "max_hours": 48}'::jsonb, 20),
  ('reliable', 'Reliable Contributor', 'Maintained 90%+ completion rate with 5+ missions', '💎', 'contributor', 'epic', '{"type": "completion_rate", "min_rate": 90, "min_missions": 5}'::jsonb, 30),
  ('lift_off', 'Lift-Off', 'Created your first project', '🚀', 'founder', 'common', '{"type": "projects_created", "threshold": 1}'::jsonb, 40),
  ('token_launcher', 'Token Launcher', 'Successfully launched a token on DEX', '💰', 'founder', 'rare', '{"type": "token_launched", "threshold": 1}'::jsonb, 50),
  ('fair_founder', 'Fair Founder', 'Paid out 100% on 10+ missions', '🤝', 'founder', 'epic', '{"type": "fair_payout", "min_missions": 10}'::jsonb, 60),
  ('networker', 'Networker', 'Collaborated with 10+ different users', '🌐', 'community', 'rare', '{"type": "unique_collaborators", "threshold": 10}'::jsonb, 70),
  ('early_adopter', 'Early Adopter', 'Among the first 100 users', '🌟', 'special', 'legendary', '{"type": "early_user", "max_rank": 100}'::jsonb, 80)
ON CONFLICT (id) DO NOTHING;

-- Comments
COMMENT ON TABLE badge_definitions IS 
  'System-defined badges that users can earn';

COMMENT ON TABLE user_badges IS 
  'Badges earned by users';

COMMENT ON COLUMN badge_definitions.criteria IS 
  'JSON criteria for automatic badge awarding (checked by backend service)';

