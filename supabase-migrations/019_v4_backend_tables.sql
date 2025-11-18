-- V4-specific backend tables for projects, partner shares, governance, and claims

-- Ensure extension for UUID generation is enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS projects_v4 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    mission TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    legacy_project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS project_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects_v4(id) ON DELETE CASCADE,
    contract_type TEXT NOT NULL,
    address TEXT NOT NULL,
    chain_id INTEGER NOT NULL,
    deployed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(project_id, contract_type)
);

CREATE TABLE IF NOT EXISTS partner_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects_v4(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE SET NULL,
    wallet_address TEXT NOT NULL,
    share_bps INTEGER NOT NULL CHECK (share_bps >= 0 AND share_bps <= 10000),
    status TEXT NOT NULL DEFAULT 'pending',
    activated_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    sbt_token_id TEXT,
    UNIQUE(project_id, wallet_address)
);

CREATE TABLE IF NOT EXISTS governance_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects_v4(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_review',
    deadline TIMESTAMPTZ,
    result JSONB
);

CREATE TABLE IF NOT EXISTS governance_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
    voter_address TEXT NOT NULL,
    support BOOLEAN NOT NULL,
    voting_power_bps INTEGER NOT NULL CHECK (voting_power_bps >= 0 AND voting_power_bps <= 10000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(proposal_id, voter_address)
);

CREATE TABLE IF NOT EXISTS dividend_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects_v4(id) ON DELETE CASCADE,
    partner_share_id UUID NOT NULL REFERENCES partner_shares(id) ON DELETE CASCADE,
    vault_period TEXT NOT NULL,
    tx_hash TEXT,
    amount NUMERIC,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(partner_share_id, vault_period)
);

CREATE TABLE IF NOT EXISTS capital_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_v4(id) ON DELETE SET NULL,
    payload JSONB NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    signature TEXT,
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_projects_v4_slug ON projects_v4(slug);
CREATE INDEX IF NOT EXISTS idx_project_contracts_project ON project_contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_partner_shares_project ON partner_shares(project_id);
CREATE INDEX IF NOT EXISTS idx_partner_shares_wallet ON partner_shares(wallet_address);
CREATE INDEX IF NOT EXISTS idx_gov_proposals_project ON governance_proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_gov_votes_proposal ON governance_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_dividend_claims_project ON dividend_claims(project_id);
CREATE INDEX IF NOT EXISTS idx_capital_events_project ON capital_events(project_id);

