-- Migration: Create privacy settings
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: User privacy controls for profile visibility

CREATE TABLE IF NOT EXISTS profile_privacy (
  wallet_address TEXT PRIMARY KEY REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  
  -- What's visible on profile
  show_token_holdings BOOLEAN DEFAULT false,
  show_earnings BOOLEAN DEFAULT false,
  show_wallet_address BOOLEAN DEFAULT false, -- If false: show as 0x123...abc
  show_activity_feed BOOLEAN DEFAULT true,
  show_github_activity BOOLEAN DEFAULT true,
  
  -- Who can interact
  allow_follows BOOLEAN DEFAULT true,
  allow_endorsements BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default privacy for new users (trigger)
CREATE OR REPLACE FUNCTION create_default_privacy()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profile_privacy (wallet_address)
  VALUES (NEW.wallet_address)
  ON CONFLICT (wallet_address) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created_privacy
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION create_default_privacy();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_privacy_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_privacy_updated
BEFORE UPDATE ON profile_privacy
FOR EACH ROW EXECUTE FUNCTION update_privacy_timestamp();

-- Comments
COMMENT ON TABLE profile_privacy IS 
  'Privacy settings for user profiles';

COMMENT ON COLUMN profile_privacy.show_token_holdings IS 
  'Whether to show token holdings on profile';

COMMENT ON COLUMN profile_privacy.show_earnings IS 
  'Whether to show total earnings and mission payouts';

COMMENT ON COLUMN profile_privacy.show_wallet_address IS 
  'If false, wallet address is truncated as 0x123...abc';

COMMENT ON COLUMN profile_privacy.allow_follows IS 
  'Whether other users can follow this profile';

COMMENT ON COLUMN profile_privacy.allow_endorsements IS 
  'Whether other users can endorse skills';

