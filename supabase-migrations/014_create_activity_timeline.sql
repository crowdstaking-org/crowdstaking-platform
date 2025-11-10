-- Migration: Create activity timeline
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Activity events for user timeline/feed

CREATE TABLE IF NOT EXISTS activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Constraints
  CONSTRAINT activity_events_event_type_check 
    CHECK (event_type IN (
      'profile_created',
      'proposal_submitted',
      'proposal_accepted',
      'proposal_completed',
      'project_created',
      'project_launched',
      'mission_created',
      'mission_completed',
      'badge_earned',
      'endorsement_received',
      'milestone_reached'
    ))
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_activity_wallet_time 
  ON activity_events(wallet_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_public_time 
  ON activity_events(is_public, created_at DESC) 
  WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_activity_type 
  ON activity_events(event_type, created_at DESC);

-- Partition by month for better performance (optional, for future scaling)
-- CREATE INDEX idx_activity_created_month ON activity_events(date_trunc('month', created_at));

-- Function to create activity event
CREATE OR REPLACE FUNCTION create_activity_event(
  p_wallet_address TEXT,
  p_event_type TEXT,
  p_event_data JSONB,
  p_is_public BOOLEAN DEFAULT true
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO activity_events (wallet_address, event_type, event_data, is_public)
  VALUES (p_wallet_address, p_event_type, p_event_data, p_is_public)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update last_active_at when activity is created
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profile_stats 
  SET last_active_at = NEW.created_at
  WHERE wallet_address = NEW.wallet_address;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_activity_created
AFTER INSERT ON activity_events
FOR EACH ROW EXECUTE FUNCTION update_last_active();

-- Comments
COMMENT ON TABLE activity_events IS 
  'Activity timeline events for user profiles';

COMMENT ON COLUMN activity_events.event_type IS 
  'Type of activity (proposal_submitted, project_created, etc.)';

COMMENT ON COLUMN activity_events.event_data IS 
  'Flexible JSON data specific to each event type';

COMMENT ON COLUMN activity_events.is_public IS 
  'Whether this event is visible on public profile (respects privacy settings)';

-- Example event_data structures:
-- proposal_submitted: {"proposal_id": "uuid", "project_name": "...", "title": "..."}
-- badge_earned: {"badge_id": "first_mission", "badge_name": "First Mission Complete"}
-- project_created: {"project_id": "uuid", "project_name": "...", "token_symbol": "..."}

