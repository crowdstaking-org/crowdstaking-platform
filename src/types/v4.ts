export type V4ProjectStatus = 'draft' | 'active' | 'archived';

export interface V4Project {
  id: string;
  created_at: string;
  created_by: string | null;
  slug: string;
  name: string;
  mission: string | null;
  status: V4ProjectStatus;
  legacy_project_id: string | null;
}

export type V4ContractType =
  | 'partner_register'
  | 'governance_module'
  | 'profit_vault'
  | 'capital_vault'
  | 'project_factory'
  | 'crowdstaking_treasury';

export interface V4ProjectContract {
  id: string;
  project_id: string;
  contract_type: V4ContractType;
  address: string;
  chain_id: number;
  deployed_at: string;
}

export type PartnerShareStatus =
  | 'pending'
  | 'pending_work'
  | 'pending_capital'
  | 'active'
  | 'revoked';

export interface PartnerShare {
  id: string;
  project_id: string;
  proposal_id: string | null;
  wallet_address: string;
  share_bps: number;
  status: PartnerShareStatus;
  activated_at: string | null;
  revoked_at: string | null;
  sbt_token_id: string | null;
}

export type ProposalType =
  | 'WORK'
  | 'BOUNTY'
  | 'CAPITAL'
  | 'PAYOUT'
  | 'REVOKE';

export interface GovernanceProposal {
  id: string;
  project_id: string;
  created_at: string;
  created_by: string;
  type: ProposalType;
  payload: Record<string, unknown>;
  status: string;
  deadline: string | null;
  result: Record<string, unknown> | null;
}

export interface GovernanceVote {
  id: string;
  proposal_id: string;
  voter_address: string;
  support: boolean;
  voting_power_bps: number;
  created_at: string;
}

export interface DividendClaim {
  id: string;
  project_id: string;
  partner_share_id: string;
  vault_period: string;
  tx_hash: string | null;
  amount: string | null;
  claimed_at: string;
}

export interface CapitalEvent {
  id: string;
  project_id: string | null;
  payload: Record<string, unknown>;
  verified: boolean;
  signature: string | null;
  received_at: string;
}

