-- V4 Core Schema (Projects, Contracts, Partner Shares, Governance, Dividends)

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
    share_bps INTEGER NOT NULL,
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
    voting_power_bps INTEGER NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_partner_shares_project ON partner_shares(project_id);
CREATE INDEX IF NOT EXISTS idx_governance_proposals_project ON governance_proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_governance_votes_proposal ON governance_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_dividend_claims_project ON dividend_claims(project_id);

