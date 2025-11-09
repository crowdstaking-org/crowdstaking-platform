-- Migration: Add contract tracking fields to proposals table
-- Author: CrowdStaking Team
-- Date: 2025-11-09
-- Description: Adds fields to track smart contract interactions for vesting agreements

-- Add contract-related columns
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS contract_agreement_tx TEXT,
  ADD COLUMN IF NOT EXISTS contract_release_tx TEXT,
  ADD COLUMN IF NOT EXISTS pioneer_confirmed_at TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN proposals.contract_agreement_tx IS 
  'Transaction hash for createAgreement call on VestingContract';

COMMENT ON COLUMN proposals.contract_release_tx IS 
  'Transaction hash for releaseAgreement call on VestingContract';

COMMENT ON COLUMN proposals.pioneer_confirmed_at IS 
  'Timestamp when pioneer confirmed work completion (triggers smart contract confirmWorkDone)';

-- Add index for querying by confirmation status
CREATE INDEX IF NOT EXISTS idx_proposals_pioneer_confirmed 
  ON proposals(pioneer_confirmed_at) 
  WHERE pioneer_confirmed_at IS NOT NULL;

-- Add index for querying by contract transactions
CREATE INDEX IF NOT EXISTS idx_proposals_contract_agreement_tx 
  ON proposals(contract_agreement_tx) 
  WHERE contract_agreement_tx IS NOT NULL;

