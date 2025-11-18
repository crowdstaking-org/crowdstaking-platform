import { vi } from 'vitest'

// Mock environment variables (can be overridden in tests)
if (!process.env.ENABLE_V4_PROTOCOL) {
  process.env.ENABLE_V4_PROTOCOL = 'true'
}
process.env.V4_FACTORY_ADDRESS = '0x1234567890123456789012345678901234567890'
process.env.V4_TREASURY_ADDRESS = '0x0987654321098765432109876543210987654321'
process.env.V4_FEE_BPS = '200'
process.env.V4_PAYOUT_TOKEN = '0x1111111111111111111111111111111111111111'
process.env.V4_CAPITAL_TOKEN = '0x2222222222222222222222222222222222222222'
process.env.V4_RPC_URL = 'http://localhost:8545'
process.env.V4_PRIVATE_KEY = '0x' + '1'.repeat(64)
process.env.V4_ORACLE_SECRET = 'test-oracle-secret'

// Mock Supabase Admin Client
vi.mock('@/lib/v4/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
          single: vi.fn(),
        })),
        single: vi.fn(),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}))

// Mock ethers.js
vi.mock('ethers', async () => {
  const actual = await vi.importActual('ethers')
  return {
    ...actual,
    ethers: {
      ...(actual as any).ethers,
      Wallet: vi.fn(() => ({
        sendTransaction: vi.fn(),
      })),
      JsonRpcProvider: vi.fn(() => ({
        getNetwork: vi.fn(() => Promise.resolve({ chainId: 31337n })),
      })),
      Contract: vi.fn(() => ({
        createProject: vi.fn(() => ({
          wait: vi.fn(() => Promise.resolve({ hash: '0xtest' })),
        })),
      })),
      encodeBytes32String: vi.fn((str) => '0x' + str.padEnd(64, '0')),
      getBytes: vi.fn((hex) => new Uint8Array()),
    },
  }
})

// Mock feature flags
vi.mock('@/lib/features', () => ({
  ENABLE_V4_PROTOCOL: true,
  ENABLE_LEGACY_PROTOCOL: false,
}))

