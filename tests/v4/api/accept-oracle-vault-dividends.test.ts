import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST as POSTAccept } from '@/app/api/v4/proposals/[proposalId]/accept/route'
import { POST as POSTOracle } from '@/app/api/v4/oracle/capital/route'
import { POST as POSTDistribution } from '@/app/api/v4/vaults/[projectId]/distribution/start/route'
import { POST as POSTDividend } from '@/app/api/v4/dividends/claim/route'

// Mock dependencies
vi.mock('@/lib/v4/governance', () => ({
  markProposalStatus: vi.fn(),
}))
vi.mock('@/lib/v4/jobs', () => ({
  dispatchJob: vi.fn(),
}))
vi.mock('@/lib/v4/oracle', () => ({
  recordCapitalEvent: vi.fn(),
  verifySignature: vi.fn(),
}))
vi.mock('@/lib/v4/vault', () => ({
  startDistributionOwner: vi.fn(),
  confirmCapitalDeposit: vi.fn(),
}))
vi.mock('@/lib/v4/dividends', () => ({
  recordDividendClaim: vi.fn(),
}))
vi.mock('@/lib/v4/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}))
vi.mock('@/lib/features', () => ({
  ENABLE_V4_PROTOCOL: true,
  ENABLE_LEGACY_PROTOCOL: false,
}))

describe('POST /api/v4/proposals/[proposalId]/accept', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should accept a proposal and dispatch registerPartnerShare job', async () => {
    const { markProposalStatus } = await import('@/lib/v4/governance')
    const { dispatchJob } = await import('@/lib/v4/jobs')
    
    const mockProposal = {
      id: 'proposal-id',
      project_id: 'project-id',
      created_by: '0x1234567890123456789012345678901234567890',
      type: 'WORK' as const,
      payload: {},
      status: 'approved' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    vi.mocked(markProposalStatus).mockResolvedValue(mockProposal)
    vi.mocked(dispatchJob).mockResolvedValue('job-id')

    const request = new Request('http://localhost/api/v4/proposals/proposal-id/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        walletAddress: '0x1234567890123456789012345678901234567890',
        shareBps: 3000,
      }),
    })

    const response = await POSTAccept(request, { params: { proposalId: 'proposal-id' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.proposal).toEqual(mockProposal)
    expect(dispatchJob).toHaveBeenCalledWith('registerPartnerShare', {
      proposalId: 'proposal-id',
      projectId: 'project-id',
      walletAddress: '0x1234567890123456789012345678901234567890',
      shareBps: 3000,
      status: 'pending_work',
    })
  })

  it('should dispatch startDistribution job for PAYOUT proposals', async () => {
    const { markProposalStatus } = await import('@/lib/v4/governance')
    const { dispatchJob } = await import('@/lib/v4/jobs')
    
    const mockProposal = {
      id: 'proposal-id',
      project_id: 'project-id',
      created_by: '0x1234567890123456789012345678901234567890',
      type: 'PAYOUT' as const,
      payload: { type: 'payout', period: 'Q1-2024' },
      status: 'approved' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    vi.mocked(markProposalStatus).mockResolvedValue(mockProposal)
    vi.mocked(dispatchJob).mockResolvedValue('job-id')

    const request = new Request('http://localhost/api/v4/proposals/proposal-id/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        walletAddress: '0x1234567890123456789012345678901234567890',
        shareBps: 1000, // Must be > 0 to pass validation
        payload: {
          type: 'payout',
          period: 'Q1-2024',
        },
      }),
    })

    const response = await POSTAccept(request, { params: { proposalId: 'proposal-id' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    // Check that markProposalStatus was called with the payload
    expect(markProposalStatus).toHaveBeenCalledWith('proposal-id', 'approved', {
      type: 'payout',
      period: 'Q1-2024',
    })
    expect(dispatchJob).toHaveBeenCalledWith('startDistribution', {
      projectId: 'project-id',
      period: 'Q1-2024',
    })
  })

  it('should return 400 for unsupported action', async () => {
    const request = new Request('http://localhost/api/v4/proposals/proposal-id/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reject',
        walletAddress: '0x1234567890123456789012345678901234567890',
        shareBps: 3000,
      }),
    })

    const response = await POSTAccept(request, { params: { proposalId: 'proposal-id' } })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Unsupported action')
  })
})

describe('POST /api/v4/oracle/capital', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should process capital oracle event successfully', async () => {
    const { recordCapitalEvent, verifySignature } = await import('@/lib/v4/oracle')
    const { dispatchJob } = await import('@/lib/v4/jobs')
    const { confirmCapitalDeposit } = await import('@/lib/v4/vault')
    
    const mockEvent = {
      id: 'event-id',
      project_id: 'project-id',
      deposit_id: 'deposit-id',
      amount: '1000000',
      created_at: new Date().toISOString(),
    }

    const rawBody = JSON.stringify({
      depositId: 'deposit-id',
      amount: '1000000',
      oracle_proof_hash: 'proof-hash',
    })

    vi.mocked(verifySignature).mockReturnValue(true)
    vi.mocked(recordCapitalEvent).mockResolvedValue(mockEvent)
    vi.mocked(confirmCapitalDeposit).mockResolvedValue({ txHash: '0xtest' })
    vi.mocked(dispatchJob).mockResolvedValue('job-id')

    const request = new Request('http://localhost/api/v4/oracle/capital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': 'test-signature',
      },
      body: rawBody,
    })

    const response = await POSTOracle(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    expect(verifySignature).toHaveBeenCalledWith(rawBody, 'test-signature')
    expect(recordCapitalEvent).toHaveBeenCalled()
    expect(dispatchJob).toHaveBeenCalledWith('activateCapitalShare', {
      capitalEventId: 'event-id',
      payload: JSON.parse(rawBody),
    })
  })

  it('should return 401 for invalid signature', async () => {
    const { verifySignature } = await import('@/lib/v4/oracle')
    
    vi.mocked(verifySignature).mockReturnValue(false)

    const request = new Request('http://localhost/api/v4/oracle/capital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': 'invalid-signature',
      },
      body: JSON.stringify({ depositId: 'test' }),
    })

    const response = await POSTOracle(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid signature')
  })

  it('should return 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/v4/oracle/capital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': 'test-signature',
      },
      body: 'invalid json',
    })

    const response = await POSTOracle(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid JSON')
  })
})

describe('POST /api/v4/vaults/[projectId]/distribution/start', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start distribution successfully', async () => {
    const { startDistributionOwner } = await import('@/lib/v4/vault')
    
    vi.mocked(startDistributionOwner).mockResolvedValue({ txHash: '0xtest' })

    const request = new Request('http://localhost/api/v4/vaults/project-id/distribution/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        period: 'Q1-2024',
      }),
    })

    const response = await POSTDistribution(request, { params: Promise.resolve({ projectId: 'project-id' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.txHash).toBe('0xtest')
    expect(startDistributionOwner).toHaveBeenCalledWith('project-id', 'Q1-2024')
  })

  it('should return 400 for missing period', async () => {
    const request = new Request('http://localhost/api/v4/vaults/project-id/distribution/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await POSTDistribution(request, { params: Promise.resolve({ projectId: 'project-id' }) })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing period')
  })
})

describe('POST /api/v4/dividends/claim', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should record dividend claim successfully', async () => {
    const { recordDividendClaim } = await import('@/lib/v4/dividends')
    const { supabaseAdmin } = await import('@/lib/v4/supabaseAdmin')
    
    const mockShare = {
      id: 'share-id',
      project_id: 'project-id',
      wallet_address: '0x1234567890123456789012345678901234567890',
      share_bps: 3000,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const mockClaim = {
      id: 'claim-id',
      project_id: 'project-id',
      partner_share_id: 'share-id',
      vault_period: 'Q1-2024',
      amount: '1000000',
      tx_hash: '0xtest',
      created_at: new Date().toISOString(),
    }

    // Mock Supabase query chain - chained .eq() calls
    const mockSingle = vi.fn(() => Promise.resolve({ data: mockShare, error: null }))
    const mockEq2 = vi.fn(() => ({ single: mockSingle }))
    const mockEq1 = vi.fn(() => ({ eq: mockEq2 }))
    const mockSelect = vi.fn(() => ({ eq: mockEq1 }))
    
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: mockSelect,
    } as any)

    vi.mocked(recordDividendClaim).mockResolvedValue(mockClaim)

    const request = new Request('http://localhost/api/v4/dividends/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'project-id',
        partnerShareId: 'share-id',
        vaultPeriod: 'Q1-2024',
        amount: '1000000',
        txHash: '0xtest',
      }),
    })

    const response = await POSTDividend(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.claim).toEqual(mockClaim)
    expect(recordDividendClaim).toHaveBeenCalledWith({
      projectId: 'project-id',
      partnerShareId: 'share-id',
      vaultPeriod: 'Q1-2024',
      amount: '1000000',
      txHash: '0xtest',
    })
  })

  it('should return 400 for missing required fields', async () => {
    const request = new Request('http://localhost/api/v4/dividends/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'project-id',
        // missing partnerShareId and vaultPeriod
      }),
    })

    const response = await POSTDividend(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('projectId, partnerShareId and vaultPeriod are required')
  })

  it('should return 404 for non-existent partner share', async () => {
    const { supabaseAdmin } = await import('@/lib/v4/supabaseAdmin')
    
    const mockSingle = vi.fn(() => Promise.resolve({ data: null, error: { message: 'Not found' } }))
    const mockEq2 = vi.fn(() => ({ single: mockSingle }))
    const mockEq1 = vi.fn(() => ({ eq: mockEq2 }))
    const mockSelect = vi.fn(() => ({ eq: mockEq1 }))
    
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: mockSelect,
    } as any)

    const request = new Request('http://localhost/api/v4/dividends/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'project-id',
        partnerShareId: 'non-existent',
        vaultPeriod: 'Q1-2024',
      }),
    })

    const response = await POSTDividend(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Partner share not found')
  })

  it('should return 400 for inactive share', async () => {
    const { supabaseAdmin } = await import('@/lib/v4/supabaseAdmin')
    
    const mockShare = {
      id: 'share-id',
      project_id: 'project-id',
      wallet_address: '0x1234567890123456789012345678901234567890',
      share_bps: 3000,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const mockSingle = vi.fn(() => Promise.resolve({ data: mockShare, error: null }))
    const mockEq2 = vi.fn(() => ({ single: mockSingle }))
    const mockEq1 = vi.fn(() => ({ eq: mockEq2 }))
    const mockSelect = vi.fn(() => ({ eq: mockEq1 }))
    
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: mockSelect,
    } as any)

    const request = new Request('http://localhost/api/v4/dividends/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'project-id',
        partnerShareId: 'share-id',
        vaultPeriod: 'Q1-2024',
      }),
    })

    const response = await POSTDividend(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Share is not active')
  })
})

