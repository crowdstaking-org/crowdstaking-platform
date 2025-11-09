-- Add deliverable column to proposals table
-- Phase 3: Complete proposal form enhancement

ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS deliverable TEXT;

-- Add comment for documentation
COMMENT ON COLUMN proposals.deliverable IS 'Detailed description of what will be delivered';

