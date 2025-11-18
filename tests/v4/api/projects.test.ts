import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/v4/projects/route'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import { deployProjectContracts } from '@/lib/v4/factory'

// Mock dependencies
vi.mock('@/lib/v4/factory')
vi.mock('@/lib/v4/projects', () => ({
  createV4Project: vi.fn(),
  saveProjectContracts: vi.fn(),
  deleteV4Project: vi.fn(),
  updateV4ProjectStatus: vi.fn(),
}))
vi.mock('@/lib/features', () => ({
  ENABLE_V4_PROTOCOL: true,
  ENABLE_LEGACY_PROTOCOL: false,
}))

describe('POST /api/v4/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a project successfully', async () => {
    const { createV4Project, saveProjectContracts, updateV4ProjectStatus } = await import('@/lib/v4/projects')
    
    const mockProject = {
      id: 'test-project-id',
      name: 'Test Project',
      slug: 'test-project',
      mission: 'Test mission',
      status: 'draft' as const,
      founder_wallet: '0x1234567890123456789012345678901234567890',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const mockContracts = {
      partnerRegister: '0x1111111111111111111111111111111111111111',
      governanceModule: '0x2222222222222222222222222222222222222222',
      profitVault: '0x3333333333333333333333333333333333333333',
      capitalVault: '0x4444444444444444444444444444444444444444',
    }

    vi.mocked(createV4Project).mockResolvedValue(mockProject)
    vi.mocked(deployProjectContracts).mockResolvedValue({
      contracts: mockContracts,
      chainId: 31337,
    })
    vi.mocked(saveProjectContracts).mockResolvedValue([])
    vi.mocked(updateV4ProjectStatus).mockResolvedValue({ ...mockProject, status: 'active' })

    const request = new Request('http://localhost/api/v4/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Project',
        slug: 'test-project',
        mission: 'Test mission',
        founderWallet: '0x1234567890123456789012345678901234567890',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.project).toBeDefined()
    expect(data.project.status).toBe('active')
    expect(data.contracts).toEqual(mockContracts)
    expect(createV4Project).toHaveBeenCalledWith({
      name: 'Test Project',
      slug: 'test-project',
      mission: 'Test mission',
      founderWallet: '0x1234567890123456789012345678901234567890',
    })
    expect(deployProjectContracts).toHaveBeenCalledWith('test-project', '0x1234567890123456789012345678901234567890')
  })

  it('should return 400 for missing required fields', async () => {
    const request = new Request('http://localhost/api/v4/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Project',
        // missing slug and founderWallet
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
  })

  it('should return 503 when V4 protocol is disabled', async () => {
    // Mock the feature flag to return false
    vi.doMock('@/lib/features', () => ({
      ENABLE_V4_PROTOCOL: false,
      ENABLE_LEGACY_PROTOCOL: false,
    }))
    
    // Clear module cache and re-import
    vi.resetModules()
    const { POST: POSTHandler } = await import('@/app/api/v4/projects/route')

    const request = new Request('http://localhost/api/v4/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Project',
        slug: 'test-project',
        founderWallet: '0x1234567890123456789012345678901234567890',
      }),
    })

    const response = await POSTHandler(request)
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.error).toBe('V4 protocol disabled')
    
    // Restore
    vi.resetModules()
  })

  it('should rollback project creation on deployment failure', async () => {
    const { createV4Project, deleteV4Project } = await import('@/lib/v4/projects')
    
    const mockProject = {
      id: 'test-project-id',
      name: 'Test Project',
      slug: 'test-project',
      mission: null,
      status: 'draft' as const,
      founder_wallet: '0x1234567890123456789012345678901234567890',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    vi.mocked(createV4Project).mockResolvedValue(mockProject)
    vi.mocked(deployProjectContracts).mockRejectedValue(new Error('Deployment failed'))
    vi.mocked(deleteV4Project).mockResolvedValue(undefined)

    const request = new Request('http://localhost/api/v4/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Project',
        slug: 'test-project',
        founderWallet: '0x1234567890123456789012345678901234567890',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Deployment failed')
    expect(deleteV4Project).toHaveBeenCalledWith('test-project-id')
  })
})

