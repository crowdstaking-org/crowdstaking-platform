-- Migration: Create missions table
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Stores missions (grouping of proposals) for projects

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Foreign Key
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Mission Details
  title TEXT NOT NULL,
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  
  -- Constraints
  CONSTRAINT missions_title_length CHECK (length(title) >= 5 AND length(title) <= 200)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_missions_project_id 
  ON missions(project_id);

CREATE INDEX IF NOT EXISTS idx_missions_status 
  ON missions(status) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_missions_created_at 
  ON missions(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE missions IS 
  'Missions are groupings of proposals within a project (e.g., "Logo Design", "Landing Page")';

COMMENT ON COLUMN missions.project_id IS 
  'Reference to the parent project';

COMMENT ON COLUMN missions.status IS 
  'Mission lifecycle: active (accepting proposals), completed (finished), paused, archived';

