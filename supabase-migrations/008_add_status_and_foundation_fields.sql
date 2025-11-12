-- Migration: Add status and foundation fields to proposals
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Adds workflow status tracking and foundation response fields

-- Add status column with default
ALTER TABLE proposals 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending_review';

-- Add foundation response columns
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS foundation_offer_cstake_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS foundation_notes TEXT;

-- Add status constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'proposals_status_check'
  ) THEN
    ALTER TABLE proposals 
      ADD CONSTRAINT proposals_status_check 
      CHECK (status IN (
        'pending_review',
        'counter_offer_pending',
        'approved',
        'accepted',
        'work_in_progress',
        'completed',
        'rejected'
      ));
  END IF;
END $$;

-- Add index on status for filtering
CREATE INDEX IF NOT EXISTS idx_proposals_status 
  ON proposals(status);

-- Add comments for documentation
COMMENT ON COLUMN proposals.status IS 
  'Current workflow status: pending_review, counter_offer_pending, approved, accepted, work_in_progress, completed, rejected';

COMMENT ON COLUMN proposals.foundation_offer_cstake_amount IS 
  'Foundation counter-offer amount (if different from requested)';

COMMENT ON COLUMN proposals.foundation_notes IS 
  'Foundation feedback or notes regarding the proposal';



