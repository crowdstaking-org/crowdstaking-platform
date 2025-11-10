-- Migration: Add project and mission foreign keys to proposals
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Links proposals to projects and missions (nullable for backwards compatibility)

-- Add foreign key columns (nullable for backwards compatibility)
ALTER TABLE proposals 
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS mission_id UUID REFERENCES missions(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_proposals_project_id 
  ON proposals(project_id) 
  WHERE project_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_proposals_mission_id 
  ON proposals(mission_id) 
  WHERE mission_id IS NOT NULL;

-- Combined index for filtering by project and status
CREATE INDEX IF NOT EXISTS idx_proposals_project_status 
  ON proposals(project_id, status) 
  WHERE project_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN proposals.project_id IS 
  'Reference to the project this proposal belongs to (nullable for backwards compatibility)';

COMMENT ON COLUMN proposals.mission_id IS 
  'Reference to the mission this proposal is for (optional - proposals can be direct to project)';

