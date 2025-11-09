<!-- a4c4d48a-bc94-4db7-b095-2a2161e95221 331ea004-7171-4d98-b962-29e72fcd91bf -->
# Phase 2 Refinement: Minimal-Invasive Authentication Upgrade

## Context: What Phase 1 Built

In Phase 1, we created **simplified auth** that trusts client-provided wallet addresses:

```typescript
// PHASE-1-TICKET-006 created this:
export function getAuthenticatedWallet(request: Request): string | null {
  const wallet = request.headers.get('x-wallet-address')
  return wallet // Trust client (NOT SECURE)
}
```

**This works for development but is NOT production-ready.** Anyone can impersonate any wallet.

## Phase 2 Goal

Upgrade to **secure wallet authentication** using cryptographic signatures:

1. User signs a message with their wallet (SIWE - Sign-In with Ethereum)
2. Backend verifies the signature cryptographically
3. Backend issues a session token
4. Subsequent requests use session token

**Minimal-invasive approach:** Leverage ThirdWeb SDK v5 auth capabilities instead of building from scratch.

## Analysis: ThirdWeb SDK v5 Auth

**Already Installed:** `thirdweb: ^5.111.8` ✅

**ThirdWeb v5 provides:**

- `verifySignature()` - verify wallet signatures
- `generatePayload()` - create messages to sign
- Built-in session management utilities
- No need for separate SIWE library

**Reference:** https://portal.thirdweb.com/typescript/v5/auth

## What We're Upgrading

### From Phase 1 (Simplified)

```typescript
// Client: Just sends wallet address
headers: { 'x-wallet-address': '0x123...' }

// Server: Trusts it blindly
const wallet = request.headers.get('x-wallet-address')
```

### To Phase 2 (Secure)

```typescript
// Client: Signs message with wallet
const signature = await wallet.signMessage(message)

// Server: Verifies signature cryptographically
const isValid = await verifySignature({ message, signature, address })
```

## Minimal-Invasive Strategy

**What We'll Do:**

1. Add ThirdWeb auth utilities (small lib)
2. Create login endpoint that verifies signatures
3. Use httpOnly cookies for sessions (simple, secure)
4. Update `getAuthenticatedWallet()` to check session cookie
5. Add ConnectButton to Navigation (1 line change)

**What We'll Skip:**

- ❌ Complex JWT token generation (use simple session ID)
- ❌ Refresh tokens (session expires, re-login)
- ❌ Database session storage (in-memory Map for MVP, upgrade later)
- ❌ Multi-device session management
- ❌ OAuth providers (just wallet for now)

## Refined Actionable Tickets

### PHASE-2-TICKET-001: ThirdWeb Auth Utilities Setup

**Priority:** P0 | **Time:** 45 min

**Goal:** Create auth utilities using ThirdWeb SDK for signature verification

**What to Do:**

1. Create `src/lib/auth/thirdweb-auth.ts`
2. Import ThirdWeb v5 auth functions
3. Create helper: `generateLoginPayload(address)`
4. Create helper: `verifyLoginSignature(payload, signature)`
5. Test with a sample wallet address

**Files to Create:**

- `src/lib/auth/thirdweb-auth.ts`

**Definition of Done:**

- [ ] Can generate a message for user to sign
- [ ] Can verify a signature against message and address
- [ ] Verification returns true for valid signatures
- [ ] Verification returns false for invalid signatures
- [ ] TypeScript types included
- [ ] Unit test passes with test data

**Code Pattern:**

```typescript
// src/lib/auth/thirdweb-auth.ts
import { verifySignature } from 'thirdweb/auth'
import { client } from '@/lib/thirdweb'

export interface LoginPayload {
  address: string
  message: string
  timestamp: number
  nonce: string
}

export function generateLoginPayload(address: string): LoginPayload {
  const timestamp = Date.now()
  const nonce = Math.random().toString(36).substring(7)
  const message = `Sign in to CrowdStaking\n\nAddress: ${address}\nNonce: ${nonce}\nTimestamp: ${timestamp}`
  
  return { address, message, timestamp, nonce }
}

export async function verifyLoginSignature(
  payload: LoginPayload,
  signature: string
): Promise<boolean> {
  try {
    const result = await verifySignature({
      client,
      message: payload.message,
      signature,
      address: payload.address,
    })
    return result
  } catch {
    return false
  }
}
```

---

### PHASE-2-TICKET-002: Simple Session Management

**Priority:** P0 | **Time:** 1 hour

**Goal:** Create in-memory session storage and cookie helpers

**What to Do:**

1. Create `src/lib/auth/sessions.ts`
2. In-memory Map to store sessions: `sessionId -> walletAddress`
3. Helper to create session
4. Helper to verify session
5. Helper to delete session

**Files to Create:**

- `src/lib/auth/sessions.ts`

**Definition of Done:**

- [ ] Can create session and get session ID
- [ ] Can verify session ID and get wallet address
- [ ] Can delete/invalidate session
- [ ] Sessions auto-expire after 7 days
- [ ] Session ID is random and secure (crypto.randomUUID)
- [ ] Works in-memory (no database yet)

**Code Pattern:**

```typescript
// src/lib/auth/sessions.ts
interface Session {
  walletAddress: string
  createdAt: number
  expiresAt: number
}

// In-memory storage (upgrade to Redis/DB later)
const sessions = new Map<string, Session>()

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export function createSession(walletAddress: string): string {
  const sessionId = crypto.randomUUID()
  const now = Date.now()
  
  sessions.set(sessionId, {
    walletAddress,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
  })
  
  return sessionId
}

export function getSession(sessionId: string): string | null {
  const session = sessions.get(sessionId)
  if (!session) return null
  
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId)
    return null
  }
  
  return session.walletAddress
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId)
}
```

---

### PHASE-2-TICKET-003: Login API Endpoint

**Priority:** P0 | **Time:** 1 hour

**Goal:** Create `/api/auth/login` endpoint that verifies signature and creates session

**What to Do:**

1. Create `src/app/api/auth/login/route.ts`
2. Accept POST with { address, message, signature }
3. Verify signature using thirdweb-auth helper
4. Create session if valid
5. Set httpOnly cookie with session ID
6. Return success/error

**Files to Create:**

- `src/app/api/auth/login/route.ts`

**Definition of Done:**

- [ ] POST `/api/auth/login` endpoint works
- [ ] Accepts address, message, signature in body
- [ ] Verifies signature cryptographically
- [ ] Creates session on success
- [ ] Sets httpOnly cookie `session_id`
- [ ] Returns error if signature invalid
- [ ] Cookie has secure flags (httpOnly, sameSite, secure)
- [ ] Tested with Postman/curl

**Code Pattern:**

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import { verifyLoginSignature } from '@/lib/auth/thirdweb-auth'
import { createSession } from '@/lib/auth/sessions'
import { jsonResponse, errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const { address, message, signature, timestamp, nonce } = await request.json()
    
    // Verify signature
    const isValid = await verifyLoginSignature(
      { address, message, timestamp, nonce },
      signature
    )
    
    if (!isValid) {
      return errorResponse('Invalid signature', 401)
    }
    
    // Create session
    const sessionId = createSession(address)
    
    // Set cookie
    const response = jsonResponse({ 
      success: true, 
      address 
    })
    
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    return response
  } catch (error) {
    return errorResponse('Login failed', 500)
  }
}
```

---

### PHASE-2-TICKET-004: Logout API Endpoint

**Priority:** P1 | **Time:** 20 min

**Goal:** Create `/api/auth/logout` endpoint to invalidate sessions

**What to Do:**

1. Create `src/app/api/auth/logout/route.ts`
2. Read session_id from cookie
3. Delete session from storage
4. Clear cookie
5. Return success

**Files to Create:**

- `src/app/api/auth/logout/route.ts`

**Definition of Done:**

- [ ] POST `/api/auth/logout` endpoint works
- [ ] Reads session_id from cookie
- [ ] Deletes session from storage
- [ ] Clears cookie
- [ ] Returns success even if no session
- [ ] Works when called from browser

**Code Pattern:**

```typescript
// src/app/api/auth/logout/route.ts
import { NextRequest } from 'next/server'
import { deleteSession } from '@/lib/auth/sessions'
import { jsonResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value
  
  if (sessionId) {
    deleteSession(sessionId)
  }
  
  const response = jsonResponse({ success: true })
  response.cookies.delete('session_id')
  
  return response
}
```

---

### PHASE-2-TICKET-005: Update Auth Helper to Use Sessions

**Priority:** P0 | **Time:** 30 min

**Goal:** Upgrade `src/lib/auth.ts` from Phase 1 to use real sessions instead of trusting headers

**What to Do:**

1. Update `getAuthenticatedWallet()` function
2. Read session_id from cookies instead of header
3. Verify session and return wallet address
4. Keep same function signature (no breaking changes)

**Files to Edit:**

- `src/lib/auth.ts` (from Phase 1)

**Definition of Done:**

- [ ] `getAuthenticatedWallet(request)` now checks session cookie
- [ ] Returns wallet address if valid session
- [ ] Returns null if no session or expired
- [ ] `requireAuth()` still throws if no auth
- [ ] No breaking changes to existing API routes
- [ ] PHASE-1-TICKET-007 endpoint still works

**Code Pattern:**

```typescript
// src/lib/auth.ts (UPDATE from Phase 1)
import { getSession } from '@/lib/auth/sessions'

export function getAuthenticatedWallet(request: Request): string | null {
  // Phase 2: Read from secure session cookie
  const sessionId = request.cookies.get('session_id')?.value
  if (!sessionId) return null
  
  return getSession(sessionId)
}

export function requireAuth(request: Request): string {
  const wallet = getAuthenticatedWallet(request)
  if (!wallet) {
    throw new Error('Unauthorized - Please login')
  }
  return wallet
}
```

---

### PHASE-2-TICKET-006: Frontend Auth Hook

**Priority:** P0 | **Time:** 1 hour

**Goal:** Create React hook for wallet login with signature

**What to Do:**

1. Create `src/hooks/useAuth.ts`
2. Use ThirdWeb's `useActiveAccount()` to get connected wallet
3. Create `login()` function that:

   - Generates payload
   - Signs message with wallet
   - Calls `/api/auth/login`

4. Create `logout()` function
5. Store auth state in React state

**Files to Create:**

- `src/hooks/useAuth.ts`

**Definition of Done:**

- [ ] `useAuth()` hook returns { wallet, isAuthenticated, login, logout }
- [ ] `login()` signs message and calls API
- [ ] `logout()` calls logout API and clears state
- [ ] Hook works with ThirdWeb ConnectButton
- [ ] Loading states included
- [ ] Error handling included

**Code Pattern:**

```typescript
// src/hooks/useAuth.ts
'use client'
import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { signMessage } from 'thirdweb/wallets'
import { generateLoginPayload } from '@/lib/auth/thirdweb-auth'

export function useAuth() {
  const account = useActiveAccount()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const login = async () => {
    if (!account) return
    
    try {
      setIsLoading(true)
      
      // Generate payload
      const payload = generateLoginPayload(account.address)
      
      // Sign message
      const signature = await signMessage({
        account,
        message: payload.message,
      })
      
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, signature }),
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsAuthenticated(false)
  }
  
  return {
    wallet: account?.address,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
```

---

### PHASE-2-TICKET-007: Add ConnectButton to Navigation

**Priority:** P1 | **Time:** 30 min

**Goal:** Replace "Login" button with ThirdWeb ConnectButton

**What to Do:**

1. Update `src/components/Navigation.tsx`
2. Import `ConnectButton` from thirdweb/react
3. Replace existing "Login" button
4. Add auth state display (wallet address when connected)
5. Style to match design system

**Files to Edit:**

- `src/components/Navigation.tsx`

**Definition of Done:**

- [ ] ConnectButton appears in navigation
- [ ] Wallet connection works in browser
- [ ] Shows wallet address when connected
- [ ] Shows "Connect Wallet" when not connected
- [ ] Styled consistently with design
- [ ] Works on mobile
- [ ] Auto-triggers login after connection

**Code Pattern:**

```typescript
// src/components/Navigation.tsx (UPDATE)
import { ConnectButton } from 'thirdweb/react'
import { client } from '@/lib/thirdweb'
import { useAuth } from '@/hooks/useAuth'

export function Navigation() {
  const { isAuthenticated, login } = useAuth()
  
  return (
    <nav>
      {/* Other nav items */}
      
      <ConnectButton 
        client={client}
        onConnect={() => {
          // Auto-login after connecting wallet
          if (!isAuthenticated) {
            login()
          }
        }}
      />
    </nav>
  )
}
```

---

### PHASE-2-TICKET-008: Protected Route Wrapper Component

**Priority:** P1 | **Time:** 45 min

**Goal:** Create reusable component to protect pages requiring auth

**What to Do:**

1. Create `src/components/ProtectedRoute.tsx`
2. Check if user is authenticated
3. Show ConnectButton if not connected
4. Show "Sign Message" prompt if connected but not authenticated
5. Show children if fully authenticated

**Files to Create:**

- `src/components/ProtectedRoute.tsx`

**Definition of Done:**

- [ ] Component checks auth state
- [ ] Blocks access if not authenticated
- [ ] Shows clear message about what's needed
- [ ] Includes ConnectButton for wallet connection
- [ ] Includes login button for signature
- [ ] Renders children when authenticated
- [ ] Can be wrapped around any page

**Code Pattern:**

```typescript
// src/components/ProtectedRoute.tsx
'use client'
import { useAuth } from '@/hooks/useAuth'
import { ConnectButton } from 'thirdweb/react'
import { client } from '@/lib/thirdweb'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { wallet, isAuthenticated, login, isLoading } = useAuth()
  
  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
        <p className="text-gray-600">You need to connect a wallet to access this page</p>
        <ConnectButton client={client} />
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-bold">Sign In</h2>
        <p className="text-gray-600">Please sign a message to verify your wallet</p>
        <button 
          onClick={login} 
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          {isLoading ? 'Signing...' : 'Sign Message'}
        </button>
      </div>
    )
  }
  
  return <>{children}</>
}
```

---

### PHASE-2-TICKET-009: Update Proposal Submit Page with Auth

**Priority:** P0 | **Time:** 20 min

**Goal:** Wrap proposal submission page in ProtectedRoute

**What to Do:**

1. Update proposal form page (from Phase 1 if exists, or create placeholder)
2. Wrap content with `<ProtectedRoute>`
3. Test auth flow: Connect -> Sign -> Submit Proposal
4. Verify API receives authenticated wallet address

**Files to Edit:**

- `src/app/dashboard/propose/page.tsx` (create if doesn't exist)

**Definition of Done:**

- [ ] Page wrapped in ProtectedRoute
- [ ] Cannot access without wallet connection
- [ ] Cannot submit without signing message
- [ ] Wallet address sent to API automatically
- [ ] API route (PHASE-1-TICKET-007) works with new auth
- [ ] Full flow tested in browser

**Code Pattern:**

```typescript
// src/app/dashboard/propose/page.tsx
'use client'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function ProposePage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Submit Proposal</h1>
        {/* Form content here */}
      </div>
    </ProtectedRoute>
  )
}
```

---

### PHASE-2-TICKET-010: End-to-End Auth Flow Test

**Priority:** P0 | **Time:** 30 min

**Goal:** Test complete authentication flow in browser

**What to Do:**

1. Open app in browser
2. Click Connect Wallet
3. Connect MetaMask/wallet
4. Sign message
5. Navigate to protected page
6. Submit proposal
7. Logout
8. Verify cannot access protected page
9. Login again

**Definition of Done:**

- [ ] Can connect wallet via ConnectButton
- [ ] Signing message works (MetaMask popup)
- [ ] Session cookie set after login
- [ ] Can access protected pages
- [ ] Proposal submission includes correct wallet address
- [ ] Logout clears session
- [ ] Cannot access protected pages after logout
- [ ] Can login again successfully
- [ ] All flows work on mobile (responsive)

**Test Checklist:**

```
✓ Connect wallet with MetaMask
✓ Sign login message
✓ Session cookie appears in DevTools
✓ Navigate to /dashboard/propose
✓ Page loads (not redirected)
✓ Submit proposal
✓ Check API receives correct wallet address
✓ Check proposal in Supabase has correct creator_wallet_address
✓ Click Logout
✓ Session cookie deleted
✓ Try accessing /dashboard/propose
✓ Redirected to connect wallet
```

---

## Implementation Order

**Do these tickets in exact order:**

1. **PHASE-2-TICKET-001** - ThirdWeb auth utilities (45 min)
2. **PHASE-2-TICKET-002** - Session management (1 hour)
3. **PHASE-2-TICKET-003** - Login API endpoint (1 hour)
4. **PHASE-2-TICKET-004** - Logout API endpoint (20 min)
5. **PHASE-2-TICKET-005** - Update auth helper (30 min)
6. **PHASE-2-TICKET-006** - Frontend auth hook (1 hour)
7. **PHASE-2-TICKET-007** - ConnectButton in nav (30 min)
8. **PHASE-2-TICKET-008** - ProtectedRoute component (45 min)
9. **PHASE-2-TICKET-009** - Update propose page (20 min)
10. **PHASE-2-TICKET-010** - E2E test (30 min)

**Total Estimated Time: 6.5 hours**

## What Changed from Phase 1

### Phase 1 Auth (Simplified)

```typescript
// Client: Just sends wallet in header
headers: { 'x-wallet-address': '0x...' }

// Server: Trusts it
const wallet = request.headers.get('x-wallet-address')
```

### Phase 2 Auth (Secure)

```typescript
// Client: Signs message, sends signature
const signature = await signMessage(message)
POST /api/auth/login { address, message, signature }

// Server: Verifies cryptographically, creates session
const isValid = await verifySignature(...)
if (isValid) setSessionCookie(sessionId)

// Subsequent requests: Send session cookie
cookies: { session_id: 'abc-123' }

// Server: Verify session
const wallet = getSession(sessionId)
```

## Security Improvements

✅ **Cryptographic Verification:** Signatures verified on-chain

✅ **Session Management:** httpOnly cookies prevent XSS

✅ **Cannot Impersonate:** Must control private key to sign

✅ **Session Expiration:** Auto-logout after 7 days

✅ **Secure Cookies:** HttpOnly, SameSite, Secure flags

## What We're Still Skipping (For Now)

These can be added later when needed:

- ❌ Database session storage (using in-memory Map)
- ❌ Refresh tokens (just re-login)
- ❌ Multi-device session management
- ❌ Session activity tracking
- ❌ IP-based session validation
- ❌ CSRF protection (same-origin + httpOnly cookies sufficient for MVP)

## Success Criteria

After Phase 2 is complete:

✅ Secure cryptographic authentication

✅ Users can login with wallet signature

✅ Sessions managed with httpOnly cookies

✅ Protected pages require authentication

✅ Cannot impersonate other users

✅ Proposal submissions include verified wallet address

✅ Ready for Phase 3 (Admin features)

## Next Steps After Phase 2

Once authenticated:

- Build proposal submission form UI (EPIC-002)
- Add status field to proposals
- Build admin review panel (EPIC-003)
- Start smart contract development (EPIC-004)

Authentication is now production-ready and won't block any features.

### To-dos

- [ ] CS-001: Install ThirdWeb packages
- [ ] CS-002: Setup .env files
- [ ] CS-003: Create ThirdWeb config file
- [ ] CS-004: Wrap app in ThirdWebProvider
- [ ] CS-005: Add ConnectWallet button to Navigation
- [ ] CS-006: Create useWalletAuth hook (client-only)
- [ ] CS-007: Create Supabase project
- [ ] CS-008: Setup Supabase client
- [ ] CS-009: Create users table schema
- [ ] CS-010: Create proposals table schema
- [ ] CS-011: POST /api/proposals endpoint
- [ ] CS-012: GET /api/proposals/me endpoint
- [ ] CS-013: GET /api/proposals/:id endpoint
- [ ] CS-014: PUT /api/proposals/:id/respond endpoint
- [ ] CS-015: Create ProposalForm component
- [ ] CS-016: Create submit-proposal page
- [ ] CS-017: Add Submit Proposal CTAs (closes Gap #1)
- [ ] CS-018: Connect proposal-review page to API (closes Gap #4)
- [ ] CS-019: Connect MyContributionsTab to API
- [ ] CS-020: Create MCP client wrapper
- [ ] CS-021: Create /api/wallet/tokens endpoint
- [ ] CS-022: Create TokenBalance component
- [ ] CS-023: Add balance to cofounder dashboard
- [ ] CS-024: Integrate real data in Proposals tab (closes Gap #8)
- [ ] CS-025: Add back link to liquidity success (closes Gap #9)