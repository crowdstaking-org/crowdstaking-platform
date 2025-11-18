import { supabaseAdmin } from './supabaseAdmin'
import type {
  GovernanceProposal,
  GovernanceVote,
  ProposalType,
} from '@/types/v4'

interface ProposalInput {
  projectId: string
  createdBy: string
  type: ProposalType
  payload: Record<string, unknown>
  deadline?: string | null
}

export async function createProposal(input: ProposalInput) {
  const { data, error } = await supabaseAdmin
    .from<GovernanceProposal>('governance_proposals')
    .insert({
      project_id: input.projectId,
      created_by: input.createdBy,
      type: input.type,
      payload: input.payload,
      deadline: input.deadline ?? null,
      status: 'pending_review'
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

interface VoteInput {
  proposalId: string
  voter: string
  support: boolean
  votingPowerBps: number
}

export async function castProposalVote(input: VoteInput) {
  const { data: existing } = await supabaseAdmin
    .from<GovernanceVote>('governance_votes')
    .select('id')
    .eq('proposal_id', input.proposalId)
    .eq('voter_address', input.voter)
    .maybeSingle()

  if (existing) {
    throw new Error('You already voted')
  }

  const { data, error } = await supabaseAdmin
    .from<GovernanceVote>('governance_votes')
    .insert({
      proposal_id: input.proposalId,
      voter_address: input.voter,
      support: input.support,
      voting_power_bps: input.votingPowerBps
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function markProposalStatus(
  proposalId: string,
  status: string,
  result?: Record<string, unknown>
) {
  const { data, error } = await supabaseAdmin
    .from<GovernanceProposal>('governance_proposals')
    .update({
      status,
      result: result ?? null
    })
    .eq('id', proposalId)
    .select('*')
    .single()

  if (error) throw error
  return data
}

