<!-- a4c4d48a-bc94-4db7-b095-2a2161e95221 40339191-0551-41d8-9d7b-34cd0af3bb0c -->
# Phase 6 Refinement: Minimal-Invasive Co-Owner Dashboard & Token Economics

## Context: What We've Built

### Phase 1-5 Complete ✅

- **Auth:** Secure wallet authentication
- **Proposals:** Submit, review, accept
- **Smart Contracts:** Token escrow and release
- **Full Lifecycle:** Proposal → Agreement → Work → Release
- **Tokens:** $CSTAKE tokens can be earned and held

### Current Dashboard State

Looking at existing code:

- `src/app/cofounder-dashboard/page.tsx` exists
- Shows proposals list (from Phase 4)
- Basic tabs structure
- NO wallet balance display yet
- NO token price display yet
- NO USD value calculation yet

## Phase 6 Goal: Make Co-Ownership Tangible

**The "Reward Loop"** - Show pioneers their actual ownership:

1. Display $CSTAKE token balance in wallet
2. Fetch real-time token price from DEX
3. Calculate and show USD value
4. Show portfolio of completed work
5. Real-time updates

**This is the "aha moment"** - seeing liquid, tradeable value from contributions.

## Minimal-Invasive Strategy

**What we'll leverage:**

- ThirdWeb SDK already integrated (read token balance)
- Existing dashboard structure
- Existing API patterns
- Simple caching for price data

**What we'll build:**

- Token balance reading hook
- DEX price fetching service (Uniswap pool)
- Price API endpoint with caching
- WalletModule component
- Enhanced proposals list
- Simple portfolio view

**What we'll skip:**

- ❌ Complex price oracle (use simple DEX query)
- ❌ Historical price charts (post-MVP)
- ❌ Portfolio analytics (post-MVP)
- ❌ Token staking (post-MVP)
- ❌ Governance voting (post-MVP)

## Critical Decision: Price Data Source

**Options:**

1. **Uniswap Pool Query** (Recommended for MVP)

   - Direct on-chain query
   - No API dependencies
   - Free
   - Simple math (reserves)

2. CoinGecko API

   - Requires API key
   - Rate limits
   - External dependency

**Choice:** Uniswap pool query for MVP (upgrade later if needed).

## Architecture Overview

```
Frontend (Dashboard)
    ↓
useTokenBalance() hook → ThirdWeb SDK → Read $CSTAKE balance
    ↓
useTokenPrice() hook → API /api/token-price
    ↓
Price Service → Uniswap Pool Contract → Calculate price
    ↓
Cache (60 seconds) → Return price
    ↓
Frontend calculates: balance * price = USD value
```

## Refined Actionable Tickets

### PHASE-6-TICKET-001: Create Token Balance Reading Hook

**Priority:** P0 | **Time:** 45 min

**Goal:** Create React hook to read $CSTAKE token balance from user's wallet

**What to Do:**

1. Create `src/hooks/useTokenBalance.ts`
2. Use ThirdWeb's useReadContract for ERC20 balanceOf
3. Format balance with decimals
4. Auto-update on wallet change
5. Handle loading and error states

**Files to Create:**

- `src/hooks/useTokenBalance.ts`

**Definition of Done:**

- [ ] Hook reads balance from $CSTAKE token contract
- [ ] Returns formatted balance (e.g., "1,234.56")
- [ ] Returns raw balance for calculations
- [ ] Auto-updates when wallet changes
- [ ] Loading state while fetching
- [ ] Error state if fetch fails
- [ ] Works with testnet token address

**Code Pattern:**

```typescript
// src/hooks/useTokenBalance.ts
'use client'
import { useReadContract } from 'thirdweb/react'
import { getContract } from 'thirdweb'
import { client } from '@/lib/thirdweb'
import { baseSepolia } from 'thirdweb/chains'
import { formatUnits } from 'ethers'

const CSTAKE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS!

export function useTokenBalance(walletAddress?: string) {
  const contract = getContract({
    client,
    chain: baseSepolia,
    address: CSTAKE_TOKEN_ADDRESS,
  })
  
  const { data, isLoading, error } = useReadContract({
    contract,
    method: 'function balanceOf(address) returns (uint256)',
    params: walletAddress ? [walletAddress] : undefined,
  })
  
  const balance = data ? formatUnits(data, 18) : '0'
  const balanceFormatted = Number(balance).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return {
    balance,
    balanceFormatted,
    balanceRaw: data,
    isLoading,
    error,
  }
}
```

---

### PHASE-6-TICKET-002: Create Uniswap Price Fetching Service

**Priority:** P0 | **Time:** 2 hours

**Goal:** Build backend service to fetch $CSTAKE price from Uniswap pool

**What to Do:**

1. Create `src/lib/price/uniswapService.ts`
2. Query Uniswap V2/V3 pool for reserves
3. Calculate price ratio
4. Handle token decimals
5. Return price in USD (if paired with USDC)

**Files to Create:**

- `src/lib/price/uniswapService.ts`
- `src/lib/price/cache.ts` (in-memory cache)

**Definition of Done:**

- [ ] Can query Uniswap pool contract
- [ ] Calculates price from reserves
- [ ] Handles 18-decimal tokens
- [ ] Returns price as number (e.g., 1.23)
- [ ] Error handling for missing pool
- [ ] Falls back to 0 if pool doesn't exist yet
- [ ] Works on testnet

**Code Pattern:**

```typescript
// src/lib/price/uniswapService.ts
import { ethers } from 'ethers'

const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL!
const UNISWAP_POOL_ADDRESS = process.env.CSTAKE_UNISWAP_POOL_ADDRESS

// Uniswap V2 Pool ABI (minimal)
const POOL_ABI = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
]

export class UniswapPriceService {
  private provider: ethers.JsonRpcProvider
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL)
  }
  
  async getPrice(): Promise<number> {
    try {
      if (!UNISWAP_POOL_ADDRESS) {
        console.warn('No Uniswap pool configured, returning 0')
        return 0
      }
      
      const poolContract = new ethers.Contract(
        UNISWAP_POOL_ADDRESS,
        POOL_ABI,
        this.provider
      )
      
      // Get reserves
      const reserves = await poolContract.getReserves()
      const reserve0 = reserves.reserve0
      const reserve1 = reserves.reserve1
      
      // Get token addresses to determine order
      const token0 = await poolContract.token0()
      const token1 = await poolContract.token1()
      
      // Assume token0 is $CSTAKE, token1 is USDC
      // If reversed, adjust calculation
      const cstakeTokenAddress = process.env.CSTAKE_TOKEN_ADDRESS_TESTNET!
      
      let price: number
      if (token0.toLowerCase() === cstakeTokenAddress.toLowerCase()) {
        // $CSTAKE is token0, USDC is token1
        // Price = reserve1 / reserve0
        price = Number(reserve1) / Number(reserve0)
      } else {
        // $CSTAKE is token1, USDC is token0
        // Price = reserve0 / reserve1
        price = Number(reserve0) / Number(reserve1)
      }
      
      // Adjust for decimals (both 18 decimals, so ratio is correct)
      // If USDC is 6 decimals, divide by 1e12
      
      return price
    } catch (error) {
      console.error('Failed to fetch price from Uniswap:', error)
      return 0
    }
  }
}

export const uniswapPriceService = new UniswapPriceService()
```
```typescript
// src/lib/price/cache.ts
interface CachedPrice {
  price: number
  timestamp: number
}

let cache: CachedPrice | null = null
const CACHE_DURATION = 60000 // 60 seconds

export function getCachedPrice(): number | null {
  if (!cache) return null
  
  const now = Date.now()
  if (now - cache.timestamp > CACHE_DURATION) {
    cache = null
    return null
  }
  
  return cache.price
}

export function setCachedPrice(price: number): void {
  cache = {
    price,
    timestamp: Date.now(),
  }
}
```

---

### PHASE-6-TICKET-003: API Endpoint - GET /api/token-price

**Priority:** P0 | **Time:** 30 min

**Goal:** Create public API endpoint to serve cached token price

**What to Do:**

1. Create `src/app/api/token-price/route.ts`
2. Check cache first
3. Fetch from Uniswap if cache miss
4. Return price with timestamp
5. Set cache for next request

**Files to Create:**

- `src/app/api/token-price/route.ts`

**Definition of Done:**

- [ ] GET `/api/token-price` endpoint works
- [ ] No authentication required (public)
- [ ] Returns cached price if available
- [ ] Fetches new price if cache expired
- [ ] Response includes price, currency, timestamp
- [ ] Error handling returns 0 price
- [ ] Response time < 500ms (due to cache)

**Code Pattern:**

```typescript
// src/app/api/token-price/route.ts
import { NextResponse } from 'next/server'
import { uniswapPriceService } from '@/lib/price/uniswapService'
import { getCachedPrice, setCachedPrice } from '@/lib/price/cache'

export async function GET() {
  try {
    // Check cache first
    let price = getCachedPrice()
    
    if (price === null) {
      // Cache miss, fetch from Uniswap
      price = await uniswapPriceService.getPrice()
      setCachedPrice(price)
    }
    
    return NextResponse.json({
      success: true,
      price,
      currency: 'USD',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Token price fetch failed:', error)
    return NextResponse.json({
      success: false,
      price: 0,
      currency: 'USD',
      error: 'Failed to fetch price',
    }, { status: 500 })
  }
}

// Optional: Add revalidate for Next.js caching
export const revalidate = 60 // Revalidate every 60 seconds
```

---

### PHASE-6-TICKET-004: Create Token Price Hook

**Priority:** P0 | **Time:** 30 min

**Goal:** Create React hook to fetch and cache token price on frontend

**What to Do:**

1. Create `src/hooks/useTokenPrice.ts`
2. Fetch from /api/token-price
3. Use React Query for caching and auto-refresh
4. Handle loading and error states

**Files to Create:**

- `src/hooks/useTokenPrice.ts`

**Definition of Done:**

- [ ] Hook fetches price from API
- [ ] Returns price as number
- [ ] Caches for 60 seconds
- [ ] Auto-refetches on window focus
- [ ] Loading state
- [ ] Error state
- [ ] Can manually refetch

**Code Pattern:**

```typescript
// src/hooks/useTokenPrice.ts
'use client'
import { useQuery } from '@tanstack/react-query'

interface TokenPriceResponse {
  success: boolean
  price: number
  currency: string
  timestamp: string
}

export function useTokenPrice() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tokenPrice'],
    queryFn: async () => {
      const response = await fetch('/api/token-price')
      const data: TokenPriceResponse = await response.json()
      return data
    },
    staleTime: 60000, // Consider data fresh for 60 seconds
    refetchInterval: 60000, // Auto-refetch every 60 seconds
    refetchOnWindowFocus: true,
  })
  
  return {
    price: data?.price ?? 0,
    currency: data?.currency ?? 'USD',
    isLoading,
    error,
    refetch,
  }
}
```

---

### PHASE-6-TICKET-005: Install React Query

**Priority:** P0 | **Time:** 15 min

**Goal:** Install and configure React Query for data fetching

**What to Do:**

1. Install @tanstack/react-query
2. Add QueryClientProvider to app providers
3. Configure default options
4. Add devtools (optional)

**Commands:**

```bash
npm install @tanstack/react-query
npm install --save-dev @tanstack/react-query-devtools
```

**Files to Edit:**

- `src/app/providers.tsx`
- `package.json`

**Definition of Done:**

- [ ] React Query installed
- [ ] QueryClientProvider wraps app
- [ ] Default options configured
- [ ] Devtools available in dev mode
- [ ] No TypeScript errors

**Code Pattern:**

```typescript
// src/app/providers.tsx (UPDATE)
'use client'
import { ThirdwebProvider } from 'thirdweb/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // 60 seconds
        refetchOnWindowFocus: true,
      },
    },
  }))
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThirdwebProvider>
    </QueryClientProvider>
  )
}
```

---

### PHASE-6-TICKET-006: Create WalletModule Component

**Priority:** P0 | **Time:** 1 hour

**Goal:** Build component showing balance, price, and USD value

**What to Do:**

1. Create `src/components/dashboard/WalletModule.tsx`
2. Use useTokenBalance hook
3. Use useTokenPrice hook
4. Calculate USD value (balance * price)
5. Display all three values beautifully
6. Add loading states

**Files to Create:**

- `src/components/dashboard/WalletModule.tsx`

**Definition of Done:**

- [ ] Component displays $CSTAKE balance
- [ ] Component displays current price
- [ ] Component displays USD value
- [ ] Formatted numbers with commas and decimals
- [ ] Loading skeletons while fetching
- [ ] Error states if fetch fails
- [ ] Styled with design system
- [ ] Mobile responsive

**Code Pattern:**

```typescript
// src/components/dashboard/WalletModule.tsx
'use client'
import { useActiveAccount } from 'thirdweb/react'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useTokenPrice } from '@/hooks/useTokenPrice'

export function WalletModule() {
  const account = useActiveAccount()
  const { balanceFormatted, balance, isLoading: balanceLoading } = useTokenBalance(account?.address)
  const { price, isLoading: priceLoading } = useTokenPrice()
  
  const usdValue = Number(balance) * price
  const usdValueFormatted = usdValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  if (!account) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <p className="text-gray-600">Connect wallet to view balance</p>
      </div>
    )
  }
  
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <h3 className="text-sm font-semibold opacity-90 mb-4">Your Wallet</h3>
      
      <div className="space-y-4">
        {/* Balance */}
        <div>
          <p className="text-sm opacity-75 mb-1">$CSTAKE Balance</p>
          {balanceLoading ? (
            <div className="h-8 bg-white/20 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold">{balanceFormatted}</p>
          )}
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-75 mb-1">Current Price</p>
            {priceLoading ? (
              <div className="h-6 w-20 bg-white/20 rounded animate-pulse" />
            ) : (
              <p className="text-lg font-semibold">
                ${price.toFixed(4)}
              </p>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-75 mb-1">Total Value</p>
            {balanceLoading || priceLoading ? (
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse ml-auto" />
            ) : (
              <p className="text-lg font-semibold">{usdValueFormatted}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs opacity-75">
          Price updates every 60 seconds from Uniswap
        </p>
      </div>
    </div>
  )
}
```

---

### PHASE-6-TICKET-007: Enhanced Proposals List Component

**Priority:** P1 | **Time:** 45 min

**Goal:** Enhance proposals list to show earned amounts and status

**What to Do:**

1. Update `src/components/dashboard/ProposalsModule.tsx` (or create)
2. Show all user proposals with status
3. Highlight completed proposals with earned amount
4. Show pending, in-progress, rejected states
5. Add filters (optional)

**Files to Create/Edit:**

- `src/components/dashboard/ProposalsModule.tsx`

**Definition of Done:**

- [ ] Component displays all user proposals
- [ ] Shows title, status, amount
- [ ] Completed proposals highlighted in green
- [ ] Shows earned amount for completed
- [ ] Shows requested amount for pending
- [ ] Color-coded status badges
- [ ] Click to view details
- [ ] Empty state if no proposals

**Code Pattern:**

```typescript
// src/components/dashboard/ProposalsModule.tsx
'use client'
import { useEffect, useState } from 'react'
import type { Proposal } from '@/types/proposal'
import Link from 'next/link'

export function ProposalsModule() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchProposals()
  }, [])
  
  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals/me')
      const { proposals } = await response.json()
      setProposals(proposals)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const completedProposals = proposals.filter(p => p.status === 'completed')
  const totalEarned = completedProposals.reduce((sum, p) => 
    sum + (p.foundation_offer_cstake_amount || p.requested_cstake_amount), 
    0
  )
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">My Contributions</h3>
        {completedProposals.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Earned</p>
            <p className="text-lg font-bold text-green-600">
              {totalEarned.toLocaleString()} $CSTAKE
            </p>
          </div>
        )}
      </div>
      
      {loading ? (
        <p>Loading proposals...</p>
      ) : proposals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No proposals yet</p>
          <Link
            href="/dashboard/propose"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Submit Your First Proposal
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map(proposal => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const statusColors = {
    pending_review: 'bg-yellow-100 text-yellow-800',
    counter_offer_pending: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    accepted: 'bg-green-100 text-green-800',
    work_in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  
  const amount = proposal.status === 'completed' 
    ? (proposal.foundation_offer_cstake_amount || proposal.requested_cstake_amount)
    : proposal.requested_cstake_amount
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold">{proposal.title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {amount.toLocaleString()} $CSTAKE
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[proposal.status]}`}>
          {proposal.status.replace('_', ' ')}
        </span>
      </div>
      
      {proposal.status === 'completed' && proposal.contract_release_tx && (
        <a
          href={`https://sepolia.basescan.org/tx/${proposal.contract_release_tx}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
        >
          View transaction →
        </a>
      )}
    </div>
  )
}
```

---

### PHASE-6-TICKET-008: Integrate Components into Dashboard

**Priority:** P0 | **Time:** 30 min

**Goal:** Add WalletModule and ProposalsModule to cofounder dashboard

**What to Do:**

1. Update `src/app/cofounder-dashboard/page.tsx`
2. Add WalletModule at top
3. Add ProposalsModule below
4. Adjust layout for better presentation
5. Ensure responsive

**Files to Edit:**

- `src/app/cofounder-dashboard/page.tsx`

**Definition of Done:**

- [ ] WalletModule visible at top of dashboard
- [ ] ProposalsModule visible below wallet
- [ ] Both components load data correctly
- [ ] Layout is clean and organized
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Auth protection still active

**Code Pattern:**

```typescript
// src/app/cofounder-dashboard/page.tsx (UPDATE)
import { WalletModule } from '@/components/dashboard/WalletModule'
import { ProposalsModule } from '@/components/dashboard/ProposalsModule'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/Layout'

export default function CofounderDashboardPage() {
  return (
    <Layout>
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h1 className="text-4xl font-bold mb-8">Co-Founder Dashboard</h1>
          
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Wallet Module - Takes 1 column */}
            <div className="lg:col-span-1">
              <WalletModule />
            </div>
            
            {/* Proposals Module - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ProposalsModule />
            </div>
          </div>
          
          {/* Additional sections can go here */}
        </div>
      </ProtectedRoute>
    </Layout>
  )
}
```

---

### PHASE-6-TICKET-009: Add Environment Variables Documentation

**Priority:** P2 | **Time:** 15 min

**Goal:** Document all new environment variables needed for Phase 6

**What to Do:**

1. Update `.env.example`
2. Document each variable
3. Add to README if needed

**Files to Edit:**

- `.env.example`
- `README.md` (optional)

**Definition of Done:**

- [ ] All Phase 6 variables in .env.example
- [ ] Clear descriptions for each
- [ ] Example values provided
- [ ] Links to where to get values

**Environment Variables:**

```bash
# Token Configuration
NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS=0x... # $CSTAKE token contract address
CSTAKE_UNISWAP_POOL_ADDRESS=0x... # Uniswap V2 pool address (optional)

# Already from Phase 5
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

---

### PHASE-6-TICKET-010: Create Simple Portfolio View

**Priority:** P2 | **Time:** 1 hour

**Goal:** Add basic portfolio statistics and completed work showcase

**What to Do:**

1. Create `src/components/dashboard/PortfolioStats.tsx`
2. Show stats: Total earned, completed projects, success rate
3. Show list of completed work with links
4. Simple charts (optional - use recharts if already installed)

**Files to Create:**

- `src/components/dashboard/PortfolioStats.tsx`

**Definition of Done:**

- [ ] Component shows key statistics
- [ ] Total $CSTAKE earned
- [ ] Number of completed proposals
- [ ] Success rate (accepted/total)
- [ ] List of completed work
- [ ] Links to transaction receipts
- [ ] Styled consistently
- [ ] Mobile responsive

**Code Pattern:**

```typescript
// src/components/dashboard/PortfolioStats.tsx
'use client'
import { useEffect, useState } from 'react'
import type { Proposal } from '@/types/proposal'

export function PortfolioStats() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  
  useEffect(() => {
    fetchProposals()
  }, [])
  
  const fetchProposals = async () => {
    const response = await fetch('/api/proposals/me')
    const { proposals } = await response.json()
    setProposals(proposals)
  }
  
  const completed = proposals.filter(p => p.status === 'completed')
  const rejected = proposals.filter(p => p.status === 'rejected')
  const total = proposals.length
  
  const successRate = total > 0 ? (completed.length / total * 100).toFixed(1) : 0
  
  const totalEarned = completed.reduce((sum, p) => 
    sum + (p.foundation_offer_cstake_amount || p.requested_cstake_amount), 
    0
  )
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-6">Portfolio Overview</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Earned" value={`${totalEarned.toLocaleString()} $CSTAKE`} />
        <StatCard label="Completed" value={completed.length.toString()} />
        <StatCard label="Success Rate" value={`${successRate}%`} />
        <StatCard label="Total Proposals" value={total.toString()} />
      </div>
      
      {completed.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Completed Work</h4>
          <div className="space-y-2">
            {completed.map(proposal => (
              <div key={proposal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{proposal.title}</span>
                <span className="text-green-600 font-semibold">
                  +{(proposal.foundation_offer_cstake_amount || proposal.requested_cstake_amount).toLocaleString()} $CSTAKE
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</p>
    </div>
  )
}
```

---

### PHASE-6-TICKET-011: Add Real-Time Balance Updates

**Priority:** P2 | **Time:** 30 min

**Goal:** Ensure balance updates immediately after token release

**What to Do:**

1. Add refetch triggers in proposal response handlers
2. Use React Query invalidation
3. Show toast notification when tokens received
4. Celebrate completed work with animation

**Files to Edit:**

- `src/app/cofounder-dashboard/page.tsx`
- `src/hooks/useTokenBalance.ts`

**Definition of Done:**

- [ ] Balance refetches after work completion
- [ ] Toast notification on token receipt
- [ ] Smooth number animation (optional)
- [ ] No page refresh needed
- [ ] Works reliably

**Code Pattern:**

```typescript
// In dashboard, after admin releases tokens
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

const handleRefresh = () => {
  // Invalidate balance and proposals queries
  queryClient.invalidateQueries({ queryKey: ['tokenBalance'] })
  queryClient.invalidateQueries({ queryKey: ['proposals'] })
}

// Call handleRefresh when detecting status change to 'completed'
// Or setup polling for proposals with work_in_progress status
```

---

### PHASE-6-TICKET-012: E2E Test - Complete User Journey

**Priority:** P0 | **Time:** 45 min

**Goal:** Test complete co-founder experience from onboarding to earning

**What to Do:**

1. Test full user journey as co-founder
2. Verify all dashboard features work
3. Check balance updates correctly
4. Verify price fetching works
5. Test on mobile

**Definition of Done:**

- [ ] Can view empty dashboard (0 balance)
- [ ] Can submit proposal
- [ ] Can accept admin offer
- [ ] Work status shows correctly
- [ ] Can confirm work complete
- [ ] Balance increases after admin releases
- [ ] USD value calculates correctly
- [ ] Portfolio stats update
- [ ] All numbers format correctly
- [ ] Mobile responsive

**Test Checklist:**

```
Initial State:
✓ Dashboard shows 0 $CSTAKE balance
✓ Price displays correctly
✓ USD value is $0.00

Submit & Accept Proposal:
✓ Submit proposal for 1000 $CSTAKE
✓ Admin accepts
✓ Pioneer accepts (triggers contract)
✓ Status shows "work_in_progress"

Complete Work:
✓ Click "Mark Work Complete"
✓ Confirmation saved
✓ Admin sees confirmation
✓ Admin releases tokens
✓ Balance updates to 1000 $CSTAKE
✓ USD value updates (1000 * price)
✓ Portfolio shows 1 completed project
✓ Total earned shows 1000 $CSTAKE

Multiple Proposals:
✓ Submit second proposal
✓ Complete cycle again
✓ Balance shows cumulative total
✓ Portfolio stats accurate

Edge Cases:
✓ Price fetch fails - shows 0 gracefully
✓ Balance fetch fails - shows error state
✓ Wallet disconnects - shows connect prompt
✓ Network errors handled gracefully
```

---

## Implementation Order

**Do these tickets in exact order:**

1. **PHASE-6-TICKET-005** - Install React Query (15 min) ← **Do this first!**
2. **PHASE-6-TICKET-001** - Token balance hook (45 min)
3. **PHASE-6-TICKET-002** - Uniswap price service (2 hours)
4. **PHASE-6-TICKET-003** - Price API endpoint (30 min)
5. **PHASE-6-TICKET-004** - Token price hook (30 min)
6. **PHASE-6-TICKET-006** - WalletModule component (1 hour)
7. **PHASE-6-TICKET-007** - Enhanced proposals list (45 min)
8. **PHASE-6-TICKET-008** - Integrate into dashboard (30 min)
9. **PHASE-6-TICKET-009** - Environment vars docs (15 min)
10. **PHASE-6-TICKET-010** - Portfolio view (1 hour)
11. **PHASE-6-TICKET-011** - Real-time updates (30 min)
12. **PHASE-6-TICKET-012** - E2E test (45 min)

**Total Estimated Time: 8.5 hours**

## New Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.62.14",
    "ethers": "^6.13.4" // Already added in Phase 5
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.62.14"
  }
}
```

## What We're Skipping

- ❌ Historical price charts (CoinGecko/TradingView)
- ❌ Portfolio analytics & insights
- ❌ Token staking/delegation
- ❌ Governance voting interface
- ❌ NFT achievement badges
- ❌ Social sharing features
- ❌ Advanced filtering/sorting
- ❌ Export portfolio as PDF

These are post-MVP enhancements.

## Success Criteria

After Phase 6 is complete:

✅ Co-founders see their $CSTAKE balance

✅ Real-time token price displayed

✅ USD value calculated and shown

✅ Portfolio of completed work visible

✅ Dashboard is beautiful and motivating

✅ All numbers update in real-time

✅ Mobile responsive

✅ Ready for polish and launch prep

## The "Aha Moment"

This phase creates the **dopamine hit** for co-founders:

```
Submit Proposal
    ↓
Do the Work
    ↓
Get Tokens Released
    ↓
SEE BALANCE INCREASE 🎉
    ↓
SEE USD VALUE 💰
    ↓
"I own part of this!"
```

This is what makes CrowdStaking addictive and viral.

## Next Steps After Phase 6

Phase 6 completes the core MVP! Next:

- Phase 7: Polish, testing, bug fixes
- Phase 8: Security audit
- Phase 9: Testnet beta with real users
- Phase 10: Mainnet deployment
- Post-Launch: Marketing, community, iteration

The full CrowdStaking platform is now functional from end to end! 🚀