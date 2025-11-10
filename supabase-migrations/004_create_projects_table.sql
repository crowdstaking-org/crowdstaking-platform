-- Migration: Create projects table
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Stores project metadata, token information, and founder details

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Founder Information
  founder_wallet_address TEXT NOT NULL,
  
  -- Project Metadata
  name TEXT NOT NULL,
  description TEXT,
  
  -- Token Information
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  total_supply NUMERIC DEFAULT 1000000000,
  
  -- Status
  token_status TEXT DEFAULT 'illiquid' CHECK (token_status IN ('illiquid', 'pending', 'live')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  
  -- Constraints
  CONSTRAINT projects_founder_wallet_address_check CHECK (founder_wallet_address ~ '^0x[a-fA-F0-9]{40}$'),
  CONSTRAINT projects_token_symbol_check CHECK (length(token_symbol) >= 2 AND length(token_symbol) <= 10)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_founder_wallet 
  ON projects(founder_wallet_address);

CREATE INDEX IF NOT EXISTS idx_projects_status 
  ON projects(status) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_projects_created_at 
  ON projects(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE projects IS 
  'Stores project metadata including token information and founder details';

COMMENT ON COLUMN projects.founder_wallet_address IS 
  'Ethereum wallet address of the project founder (must start with 0x)';

COMMENT ON COLUMN projects.token_status IS 
  'Current liquidity status: illiquid (no DEX), pending (liquidity wizard), live (tradeable)';

COMMENT ON COLUMN projects.total_supply IS 
  'Total token supply (default: 1 billion)';

