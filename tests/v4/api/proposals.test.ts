import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST as POSTProposal } from '@/app/api/v4/projects/[projectId]/proposals/route'
import { POST as POSTVote } from '@/app/api/v4/proposals/[proposalId]/vote/route'

// Mock dependencies
vi.mock('@/lib/v4/governance', () => ({
  createProposal: vi.fn(),
  castProposalVote: vi.fn(),
}))
vi.mock('@/lib/features', () => ({
  ENABLE_V4_PROTOCOL: true,
  ENABLE_LEGACY_PROTOCOL: false,
}))

describe('POST /api/v4/projects/[projectId]/proposals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a proposal successfully', async () => {
    const { createProposal } = await import('@/lib/v4/governance')
    
    const mockProposal = {
      id: 'proposal-id',
      project_id: 'project-id',
      created_by: '0x1234567890123456789012345678901234567890',
      type: 'WORK' as const,
      payload: { description: 'Test work' },
      status: 'pending_review' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    vi.mocked(createProposal).mockResolvedValue(mockProposal)

    const request = new Request('http://localhost/api/v4/projects/project-id/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        createdBy: '0x1234567890123456789012345678901234567890',
        type: 'WORK',
        payload: { description: 'Test work' },
      }),
    })

    const response = await POSTProposal(request, { params: { projectId: 'project-id' } })
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.proposal).toEqual(mockProposal)
    expect(createProposal).toHaveBeenCalledWith({
      projectId: 'project-id',
      createdBy: '0x1234567890123456789012345678901234567890',
      type: 'WORK',
      payload: { description: 'Test work' },
      deadline: null,
    })
  })

  it('should return 400 for missing required fields', async () => {
    const request = new Request('http://localhost/api/v4/projects/project-id/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        createdBy: '0x1234567890123456789012345678901234567890',
        // missing type and payload
      }),
    })

    const response = await POSTProposal(request, { params: { projectId: 'project-id' } })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
  })

  it('should handle deadline parameter', async () => {
    const { createProposal } = await import('@/lib/v4/governance')
    
    const mockProposal = {
      id: 'proposal-id',
      project_id: 'project-id',
      created_by: '0x1234567890123456789012345678901234567890',
      type: 'PAYOUT' as const,
      payload: { period: 'Q1-2024' },
      status: 'pending_review' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    vi.mocked(createProposal).mockResolvedValue(mockProposal)

    const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const request = new Request('http://localhost/api/v4/projects/project-id/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        createdBy: '0x1234567890123456789012345678901234567890',
        type: 'PAYOUT',
        payload: { period: 'Q1-2024' },
        deadline,
      }),
    })

    const response = await POSTProposal(request, { params: { projectId: 'project-id' } })
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(createProposal).toHaveBeenCalledWith({
      projectId: 'project-id',
      createdBy: '0x1234567890123456789012345678901234567890',
      type: 'PAYOUT',
      payload: { period: 'Q1-2024' },
      deadline,
    })
  })
})

describe('POST /api/v4/proposals/[proposalId]/vote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should cast a vote successfully', async () => {
    const { castProposalVote } = await import('@/lib/v4/governance')
    
    const mockVote = {
      id: 'vote-id',
      proposal_id: 'proposal-id',
      voter_address: '0x1234567890123456789012345678901234567890',
      support: true,
      voting_power_bps: 5000,
      created_at: new Date().toISOString(),
    }

    vi.mocked(castProposalVote).mockResolvedValue(mockVote)

    const request = new Request('http://localhost/api/v4/proposals/proposal-id/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voter: '0x1234567890123456789012345678901234567890',
        support: true,
        votingPowerBps: 5000,
      }),
    })

    const response = await POSTVote(request, { params: { proposalId: 'proposal-id' } })
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.vote).toEqual(mockVote)
    expect(castProposalVote).toHaveBeenCalledWith({
      proposalId: 'proposal-id',
      voter: '0x1234567890123456789012345678901234567890',
      support: true,
      votingPowerBps: 5000,
    })
  })

  it('should return 400 for invalid vote payload', async () => {
    const request = new Request('http://localhost/api/v4/proposals/proposal-id/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voter: '0x1234567890123456789012345678901234567890',
        // missing support
      }),
    })

    const response = await POSTVote(request, { params: { proposalId: 'proposal-id' } })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid vote payload')
  })

  it('should default votingPowerBps to 0 if not provided', async () => {
    const { castProposalVote } = await import('@/lib/v4/governance')
    
    const mockVote = {
      id: 'vote-id',
      proposal_id: 'proposal-id',
      voter_address: '0x1234567890123456789012345678901234567890',
      support: false,
      voting_power_bps: 0,
      created_at: new Date().toISOString(),
    }

    vi.mocked(castProposalVote).mockResolvedValue(mockVote)

    const request = new Request('http://localhost/api/v4/proposals/proposal-id/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voter: '0x1234567890123456789012345678901234567890',
        support: false,
      }),
    })

    const response = await POSTVote(request, { params: { proposalId: 'proposal-id' } })
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(castProposalVote).toHaveBeenCalledWith({
      proposalId: 'proposal-id',
      voter: '0x1234567890123456789012345678901234567890',
      support: false,
      votingPowerBps: 0,
    })
  })
})

