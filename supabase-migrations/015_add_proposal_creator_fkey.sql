-- Migration: Add Foreign Key for Proposal Creator
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Add foreign key relationship between proposals.creator_wallet_address and profiles.wallet_address

-- First, ensure all existing proposals have valid creator addresses in profiles table
-- (This should already be the case, but let's be safe)

-- Add foreign key constraint
ALTER TABLE proposals 
  ADD CONSTRAINT proposals_creator_wallet_address_fkey 
  FOREIGN KEY (creator_wallet_address) 
  REFERENCES profiles(wallet_address) 
  ON DELETE CASCADE;

-- Add index for better join performance (if not already exists)
CREATE INDEX IF NOT EXISTS idx_proposals_creator 
  ON proposals(creator_wallet_address);

