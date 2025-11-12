-- CrowdStaking Proposals Table
-- To be executed manually in Supabase SQL Editor

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  creator_wallet_address TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requested_cstake_amount NUMERIC NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_proposals_creator 
ON proposals(creator_wallet_address);

CREATE INDEX IF NOT EXISTS idx_proposals_created_at 
ON proposals(created_at DESC);

-- Optional: Enable Row Level Security (RLS) for future use
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (MVP)
-- This will be refined in Phase 2 with proper authentication
CREATE POLICY "Enable all operations for MVP" ON proposals
FOR ALL USING (true);

-- Verify the table was created
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'proposals' 
ORDER BY ordinal_position;



