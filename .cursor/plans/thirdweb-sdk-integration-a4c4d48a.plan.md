<!-- a4c4d48a-bc94-4db7-b095-2a2161e95221 f407df75-7a3a-4b89-86ea-ed2011bf5aaf -->
# Phase 4 Refinement: Minimal-Invasive Admin Review & Double Handshake

## Context: What We've Built

### Phase 1-3 Complete ✅

- **Database:** proposals table (basic schema)
- **Auth:** Secure wallet authentication with sessions
- **Proposal Form:** Co-founders can submit proposals
- **API:** POST /api/proposals, GET /api/proposals/me

### Current Proposals Table Schema

```sql
proposals (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ,
  creator_wallet_address TEXT,
  title TEXT,
  description TEXT,
  deliverable TEXT,  -- Note: missing from Phase 1!
  requested_cstake_amount NUMERIC
)
```

## Phase 4 Goal: The "Double Handshake"

Implement the core CrowdStaking concept where **both parties must agree**:

1. **Foundation reviews proposal** → Can accept, reject, or counter-offer
2. **Pioneer responds** → Can accept or reject counter-offer
3. **Agreement reached** → Both parties said "yes"

**This is the "Wizard of Oz" phase** - foundation acts as manual mediator before AI automation.

## What We Need to Add

### Database Changes (Minimal)

Add 3 columns to proposals table:

- `status` - Track proposal state
- `foundation_offer_cstake_amount` - Counter-offer amount
- `foundation_notes` - Reason/explanation

### New Features

1. Admin panel to view all proposals
2. Admin actions (accept/reject/counter-offer)
3. Pioneer view to see and respond to admin actions
4. Status state machine to enforce valid transitions

## Minimal-Invasive Strategy

**What we'll build:**

- Simple status field (string enum, not complex state machine initially)
- Admin check via environment variable (hardcoded wallet)
- Basic admin UI (list + detail view)
- Three admin actions
- Pioneer response UI in existing dashboard
- No audit trail database (add later if needed)

**What we'll skip:**

- ❌ Complex state machine library
- ❌ Multiple admin roles/permissions
- ❌ Email notifications (add later)
- ❌ Audit log database (use console.log for now)
- ❌ Advanced negotiation (one counter-offer only for MVP)

## Status State Machine (Simplified)

```
pending_review (initial)
  ├→ rejected (by admin)
  ├→ counter_offer_pending (by admin)
  └→ approved (by admin)

counter_offer_pending
  ├→ rejected (by pioneer)
  └→ accepted (by pioneer)

approved
  └→ accepted (by pioneer)

accepted (final - ready for smart contract)
rejected (final)
```

**5 states total** - simple string enum, no complex library needed.

## Refined Actionable Tickets

### PHASE-4-TICKET-001: Add Status Fields to Proposals Table

**Priority:** P0 | **Time:** 30 min

**Goal:** Extend proposals table with status and negotiation fields

**What to Do:**

1. Use Supabase MCP to apply migration
2. Add 3 new columns: status, foundation_offer_cstake_amount, foundation_notes
3. Set default status to 'pending_review'
4. Update existing proposals to have status (if any)

**Migration SQL:**

```sql
ALTER TABLE proposals
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending_review',
  ADD COLUMN foundation_offer_cstake_amount NUMERIC,
  ADD COLUMN foundation_notes TEXT;

-- Add check constraint for valid statuses
ALTER TABLE proposals
  ADD CONSTRAINT valid_status 
  CHECK (status IN (
    'pending_review',
    'counter_offer_pending', 
    'approved',
    'accepted',
    'rejected'
  ));
```

**Definition of Done:**

- [ ] Migration applied successfully
- [ ] New columns exist in table
- [ ] Existing proposals have status 'pending_review'
- [ ] Check constraint prevents invalid statuses
- [ ] Can query proposals by status
- [ ] No breaking changes to existing code

---

### PHASE-4-TICKET-002: Update Proposal Types with Status

**Priority:** P0 | **Time:** 15 min

**Goal:** Add status fields to TypeScript types

**What to Do:**

1. Update `src/types/proposal.ts`
2. Add status field to Proposal interface
3. Add foundation fields
4. Export status type

**Files to Edit:**

- `src/types/proposal.ts`

**Definition of Done:**

- [ ] Status type defined as union of valid strings
- [ ] Proposal interface includes new fields
- [ ] TypeScript compilation succeeds
- [ ] Types exported for use in components

**Code Pattern:**

```typescript
// src/types/proposal.ts (UPDATE)

export type ProposalStatus = 
  | 'pending_review'
  | 'counter_offer_pending'
  | 'approved'
  | 'accepted'
  | 'rejected'

export interface Proposal extends ProposalFormData {
  id: string
  creator_wallet_address: string
  created_at: string
  status: ProposalStatus
  foundation_offer_cstake_amount?: number
  foundation_notes?: string
}
```

---

### PHASE-4-TICKET-003: Admin Check Utility

**Priority:** P0 | **Time:** 20 min

**Goal:** Create simple admin authorization check

**What to Do:**

1. Add ADMIN_WALLET_ADDRESS to .env
2. Create `src/lib/auth/admin.ts`
3. Add isAdmin() function
4. Add requireAdmin() middleware-style function

**Files to Create:**

- `src/lib/auth/admin.ts`

**Files to Edit:**

- `.env.local` (add admin wallet)
- `.env.example` (document admin wallet)

**Definition of Done:**

- [ ] Admin wallet address in environment
- [ ] isAdmin(wallet) function works
- [ ] requireAdmin(request) throws if not admin
- [ ] Works with existing auth system
- [ ] Case-insensitive address comparison
- [ ] Multiple admin addresses supported (comma-separated)

**Code Pattern:**

```typescript
// src/lib/auth/admin.ts
import { requireAuth } from './auth'

export function isAdmin(walletAddress: string): boolean {
  const adminAddresses = process.env.ADMIN_WALLET_ADDRESS
    ?.split(',')
    .map(addr => addr.trim().toLowerCase()) || []
  
  return adminAddresses.includes(walletAddress.toLowerCase())
}

export function requireAdmin(request: Request): string {
  const wallet = requireAuth(request)
  
  if (!isAdmin(wallet)) {
    throw new Error('Forbidden - Admin access required')
  }
  
  return wallet
}
```

---

### PHASE-4-TICKET-004: API GET /api/proposals/admin

**Priority:** P0 | **Time:** 30 min

**Goal:** Create admin endpoint to fetch all proposals

**What to Do:**

1. Create `src/app/api/proposals/admin/route.ts`
2. Implement GET handler with admin auth
3. Return all proposals sorted by created_at
4. Optional: Filter by status via query param

**Files to Create:**

- `src/app/api/proposals/admin/route.ts`

**Definition of Done:**

- [ ] GET `/api/proposals/admin` endpoint works
- [ ] Requires admin authentication
- [ ] Returns all proposals (not just own)
- [ ] Sorted by created_at DESC (newest first)
- [ ] Includes all fields (status, foundation_notes, etc.)
- [ ] Optional ?status=pending_review filter works
- [ ] Returns 403 for non-admins

**Code Pattern:**

```typescript
// src/app/api/proposals/admin/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAdmin } from '@/lib/auth/admin'

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request)
    
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    
    let query = supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return jsonResponse({ success: true, proposals: data })
  } catch (error) {
    if (error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403)
    }
    return errorResponse(error.message, 500)
  }
}
```

---

### PHASE-4-TICKET-005: API PUT /api/proposals/admin/[id]

**Priority:** P0 | **Time:** 1 hour

**Goal:** Create admin endpoint to update proposal status and fields

**What to Do:**

1. Create `src/app/api/proposals/admin/[id]/route.ts`
2. Implement PUT handler for admin actions
3. Accept action type (accept/reject/counter_offer)
4. Validate status transitions
5. Update proposal in database

**Files to Create:**

- `src/app/api/proposals/admin/[id]/route.ts`

**Definition of Done:**

- [ ] PUT `/api/proposals/admin/:id` endpoint works
- [ ] Requires admin authentication
- [ ] Accepts action type in body
- [ ] Validates current status allows action
- [ ] Updates status correctly for each action
- [ ] Saves foundation_offer and notes for counter-offer
- [ ] Returns updated proposal
- [ ] Returns 400 if invalid transition

**Code Pattern:**

```typescript
// src/app/api/proposals/admin/[id]/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAdmin } from '@/lib/auth/admin'
import type { ProposalStatus } from '@/types/proposal'

type AdminAction = 'accept' | 'reject' | 'counter_offer'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request)
    
    const { action, foundation_offer_cstake_amount, foundation_notes } = 
      await request.json()
    
    // Get current proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (fetchError || !proposal) {
      return errorResponse('Proposal not found', 404)
    }
    
    // Validate action on current status
    if (proposal.status !== 'pending_review') {
      return errorResponse('Proposal already processed', 400)
    }
    
    // Determine new status and fields
    let updates: any = {}
    
    switch (action as AdminAction) {
      case 'accept':
        updates = { status: 'approved' }
        break
      
      case 'reject':
        updates = { 
          status: 'rejected',
          foundation_notes 
        }
        break
      
      case 'counter_offer':
        if (!foundation_offer_cstake_amount) {
          return errorResponse('Counter offer amount required', 400)
        }
        updates = {
          status: 'counter_offer_pending',
          foundation_offer_cstake_amount,
          foundation_notes,
        }
        break
      
      default:
        return errorResponse('Invalid action', 400)
    }
    
    // Update proposal
    const { data: updated, error: updateError } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    
    return jsonResponse({ success: true, proposal: updated })
  } catch (error) {
    if (error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403)
    }
    return errorResponse(error.message, 500)
  }
}
```

---

### PHASE-4-TICKET-006: Admin Panel Page Structure

**Priority:** P0 | **Time:** 45 min

**Goal:** Create basic admin panel with proposals list

**What to Do:**

1. Create `src/app/admin/proposals/page.tsx`
2. Check if user is admin (client-side)
3. Fetch proposals from admin API
4. Display list with key info
5. Add basic styling

**Files to Create:**

- `src/app/admin/proposals/page.tsx`
- `src/app/admin/layout.tsx` (optional admin layout)

**Definition of Done:**

- [ ] Page accessible at `/admin/proposals`
- [ ] Shows 403/redirect if not admin
- [ ] Fetches and displays all proposals
- [ ] Shows title, creator, status, amount
- [ ] Clickable to view detail
- [ ] Loading state while fetching
- [ ] Empty state if no proposals
- [ ] Mobile responsive

**Code Pattern:**

```typescript
// src/app/admin/proposals/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { isAdmin } from '@/lib/auth/admin'
import { Layout } from '@/components/Layout'
import type { Proposal } from '@/types/proposal'
import Link from 'next/link'

export default function AdminProposalsPage() {
  const { wallet } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  
  // Check admin access
  if (!wallet || !isAdmin(wallet)) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600">Admin access required</p>
          </div>
        </div>
      </Layout>
    )
  }
  
  useEffect(() => {
    fetchProposals()
  }, [])
  
  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals/admin')
      const { proposals } = await response.json()
      setProposals(proposals)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Admin: Review Proposals</h1>
        
        {loading ? (
          <p>Loading proposals...</p>
        ) : proposals.length === 0 ? (
          <p className="text-gray-600">No proposals yet.</p>
        ) : (
          <div className="space-y-4">
            {proposals.map(proposal => (
              <Link
                key={proposal.id}
                href={`/admin/proposals/${proposal.id}`}
                className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{proposal.title}</h3>
                    <p className="text-sm text-gray-600">
                      From: {proposal.creator_wallet_address.slice(0, 10)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={proposal.status} />
                    <p className="text-sm mt-1">
                      {proposal.requested_cstake_amount} $CSTAKE
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending_review: 'bg-yellow-100 text-yellow-800',
    counter_offer_pending: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
```

---

### PHASE-4-TICKET-007: Admin Proposal Detail View

**Priority:** P0 | **Time:** 1 hour

**Goal:** Create detailed view of single proposal with action buttons

**What to Do:**

1. Create `src/app/admin/proposals/[id]/page.tsx`
2. Fetch proposal by ID
3. Display all proposal details
4. Show action buttons based on status
5. Handle admin actions

**Files to Create:**

- `src/app/admin/proposals/[id]/page.tsx`

**Definition of Done:**

- [ ] Page accessible at `/admin/proposals/:id`
- [ ] Displays full proposal content
- [ ] Markdown rendered for description/deliverable
- [ ] Shows creator info and status
- [ ] Action buttons visible for pending_review
- [ ] No actions shown for final states (accepted/rejected)
- [ ] Back button to proposals list

**Code Pattern:**

```typescript
// src/app/admin/proposals/[id]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { Proposal } from '@/types/proposal'
import { Layout } from '@/components/Layout'

export default function AdminProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchProposal()
  }, [params.id])
  
  const fetchProposal = async () => {
    try {
      const response = await fetch('/api/proposals/admin')
      const { proposals } = await response.json()
      const found = proposals.find((p: Proposal) => p.id === params.id)
      setProposal(found)
    } catch (error) {
      console.error('Failed to fetch proposal:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAction = async (action: string, data?: any) => {
    try {
      const response = await fetch(`/api/proposals/admin/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      })
      
      if (!response.ok) throw new Error('Action failed')
      
      // Refresh proposal
      await fetchProposal()
    } catch (error) {
      console.error('Action failed:', error)
      alert('Action failed. Please try again.')
    }
  }
  
  if (loading) return <Layout><p>Loading...</p></Layout>
  if (!proposal) return <Layout><p>Proposal not found</p></Layout>
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          ← Back to Proposals
        </button>
        
        <div className="bg-white border rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
            <p className="text-sm text-gray-600">
              From: {proposal.creator_wallet_address}
            </p>
            <p className="text-lg font-semibold mt-2">
              Requested: {proposal.requested_cstake_amount} $CSTAKE
            </p>
            <StatusBadge status={proposal.status} />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <div className="prose max-w-none">
                <ReactMarkdown>{proposal.description}</ReactMarkdown>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Deliverable</h3>
              <div className="prose max-w-none">
                <ReactMarkdown>{proposal.deliverable}</ReactMarkdown>
              </div>
            </div>
          </div>
          
          {/* Action buttons - next ticket */}
          {proposal.status === 'pending_review' && (
            <div className="mt-8 flex gap-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg">
                Accept
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                Counter-Offer
              </button>
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg">
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
```

---

### PHASE-4-TICKET-008: Admin Action Modals (Accept/Reject/Counter-Offer)

**Priority:** P0 | **Time:** 1.5 hours

**Goal:** Create modals for each admin action with confirmation

**What to Do:**

1. Create modal components for each action
2. Accept modal - simple confirmation
3. Reject modal - requires notes
4. Counter-offer modal - requires amount + notes
5. Wire up to API calls

**Files to Create:**

- `src/components/admin/AcceptModal.tsx`
- `src/components/admin/RejectModal.tsx`
- `src/components/admin/CounterOfferModal.tsx`

**Definition of Done:**

- [ ] Accept modal shows confirmation
- [ ] Reject modal has notes textarea (required)
- [ ] Counter-offer modal has amount input + notes
- [ ] All modals styled consistently
- [ ] Form validation in modals
- [ ] Submit buttons trigger API calls
- [ ] Modals close after success
- [ ] Error handling in modals

**Code Pattern:**

```typescript
// src/components/admin/CounterOfferModal.tsx
'use client'
import { useState } from 'react'

interface CounterOfferModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (amount: number, notes: string) => Promise<void>
  currentAmount: number
}

export function CounterOfferModal({
  isOpen,
  onClose,
  onSubmit,
  currentAmount,
}: CounterOfferModalProps) {
  const [amount, setAmount] = useState(currentAmount * 0.8) // Suggest 80%
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  if (!isOpen) return null
  
  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    try {
      setSubmitting(true)
      await onSubmit(amount, notes)
      onClose()
    } catch (error) {
      console.error('Counter-offer failed:', error)
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Counter-Offer</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Requested: {currentAmount} $CSTAKE
            </p>
            <label className="block text-sm font-semibold mb-2">
              Your Offer (in $CSTAKE) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., 1200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              Explanation (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Explain why you're offering a different amount..."
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Counter-Offer'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Similar patterns for AcceptModal and RejectModal
```

---

### PHASE-4-TICKET-009: Pioneer Response API Endpoint

**Priority:** P0 | **Time:** 45 min

**Goal:** Create endpoint for pioneers to accept/reject counter-offers or approvals

**What to Do:**

1. Create `src/app/api/proposals/respond/[id]/route.ts`
2. Implement PUT handler
3. Verify user is proposal creator
4. Accept two actions: accept/reject
5. Update status accordingly

**Files to Create:**

- `src/app/api/proposals/respond/[id]/route.ts`

**Definition of Done:**

- [ ] PUT `/api/proposals/respond/:id` endpoint works
- [ ] Requires authentication
- [ ] Only proposal creator can respond
- [ ] Accepts action: accept or reject
- [ ] Works for counter_offer_pending status
- [ ] Works for approved status
- [ ] Updates status to 'accepted' or 'rejected'
- [ ] Returns 403 if not creator

**Code Pattern:**

```typescript
// src/app/api/proposals/respond/[id]/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wallet = requireAuth(request)
    const { action } = await request.json()
    
    // Get proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (fetchError || !proposal) {
      return errorResponse('Proposal not found', 404)
    }
    
    // Verify this is the creator
    if (proposal.creator_wallet_address.toLowerCase() !== wallet.toLowerCase()) {
      return errorResponse('Forbidden - Not your proposal', 403)
    }
    
    // Validate status allows response
    if (!['counter_offer_pending', 'approved'].includes(proposal.status)) {
      return errorResponse('Proposal cannot be responded to', 400)
    }
    
    // Update based on action
    const newStatus = action === 'accept' ? 'accepted' : 'rejected'
    
    const { data: updated, error: updateError } = await supabase
      .from('proposals')
      .update({ status: newStatus })
      .eq('id', params.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    
    return jsonResponse({ success: true, proposal: updated })
  } catch (error) {
    return errorResponse(error.message, 500)
  }
}
```

---

### PHASE-4-TICKET-010: Pioneer Response UI in Dashboard

**Priority:** P0 | **Time:** 1 hour

**Goal:** Add UI in co-founder dashboard to see and respond to admin actions

**What to Do:**

1. Update `src/app/cofounder-dashboard/page.tsx`
2. Fetch user's proposals
3. Highlight proposals needing action
4. Show counter-offer details
5. Add accept/reject buttons
6. Handle response submission

**Files to Edit:**

- `src/app/cofounder-dashboard/page.tsx`

**Definition of Done:**

- [ ] Dashboard shows user's proposals
- [ ] Proposals with counter_offer_pending highlighted
- [ ] Shows foundation's offer amount and notes
- [ ] Accept and reject buttons visible
- [ ] Confirmation before accepting/rejecting
- [ ] Status updates after response
- [ ] Error handling
- [ ] Mobile responsive

**Code Pattern:**

```typescript
// Add to cofounder-dashboard/page.tsx
import { useEffect, useState } from 'react'
import type { Proposal } from '@/types/proposal'

const [proposals, setProposals] = useState<Proposal[]>([])

useEffect(() => {
  fetchMyProposals()
}, [])

const fetchMyProposals = async () => {
  const response = await fetch('/api/proposals/me')
  const { proposals } = await response.json()
  setProposals(proposals)
}

const handleResponse = async (proposalId: string, action: 'accept' | 'reject') => {
  if (!confirm(`Are you sure you want to ${action} this offer?`)) return
  
  try {
    const response = await fetch(`/api/proposals/respond/${proposalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    
    if (!response.ok) throw new Error('Failed to respond')
    
    // Refresh proposals
    await fetchMyProposals()
    alert(`Successfully ${action}ed!`)
  } catch (error) {
    alert('Failed to respond. Please try again.')
  }
}

// In JSX
{proposals.map(proposal => (
  <div key={proposal.id} className="border rounded-lg p-4">
    <h3 className="font-bold">{proposal.title}</h3>
    <StatusBadge status={proposal.status} />
    
    {proposal.status === 'counter_offer_pending' && (
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
        <p className="font-semibold mb-2">Counter-Offer Received</p>
        <p>
          Foundation offers: {proposal.foundation_offer_cstake_amount} $CSTAKE
          <span className="text-gray-600 ml-2">
            (You requested: {proposal.requested_cstake_amount})
          </span>
        </p>
        {proposal.foundation_notes && (
          <p className="text-sm text-gray-600 mt-2">
            "{proposal.foundation_notes}"
          </p>
        )}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleResponse(proposal.id, 'accept')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Accept Offer
          </button>
          <button
            onClick={() => handleResponse(proposal.id, 'reject')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Reject
          </button>
        </div>
      </div>
    )}
    
    {proposal.status === 'approved' && (
      <div className="mt-4 bg-green-50 border border-green-200 rounded p-4">
        <p className="font-semibold mb-2">✅ Proposal Approved!</p>
        <p>Foundation approved your request for {proposal.requested_cstake_amount} $CSTAKE</p>
        <button
          onClick={() => handleResponse(proposal.id, 'accept')}
          className="mt-3 bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Accept & Start Work
        </button>
      </div>
    )}
  </div>
))}
```

---

### PHASE-4-TICKET-011: E2E Integration Test - Double Handshake

**Priority:** P0 | **Time:** 45 min

**Goal:** Test complete double handshake flow from both sides

**What to Do:**

1. Test as co-founder: Submit proposal
2. Test as admin: Review and counter-offer
3. Test as co-founder: Accept counter-offer
4. Verify final status is 'accepted'
5. Test reject flows
6. Test edge cases

**Definition of Done:**

- [ ] Can submit proposal as co-founder
- [ ] Can view proposal in admin panel
- [ ] Can accept proposal as admin
- [ ] Can reject proposal as admin
- [ ] Can send counter-offer as admin
- [ ] Co-founder sees counter-offer
- [ ] Co-founder can accept counter-offer
- [ ] Co-founder can reject counter-offer
- [ ] Final status updates correctly
- [ ] Both UIs update in real-time
- [ ] All error cases handled

**Test Checklist:**

```
Happy Path - Accept:
✓ Submit proposal as co-founder
✓ Login as admin
✓ View proposal in admin panel
✓ Click "Accept"
✓ Confirm acceptance
✓ Logout admin
✓ Login as co-founder
✓ See "Approved" status
✓ Click "Accept & Start Work"
✓ Status becomes "accepted"

Happy Path - Counter-Offer:
✓ Submit proposal (10,000 $CSTAKE)
✓ Login as admin
✓ Click "Counter-Offer"
✓ Enter 8,000 $CSTAKE + explanation
✓ Submit counter-offer
✓ Logout admin
✓ Login as co-founder
✓ See counter-offer with amounts
✓ Click "Accept Offer"
✓ Status becomes "accepted"

Reject Paths:
✓ Admin rejects with reason
✓ Status becomes "rejected"
✓ Co-founder rejects counter-offer
✓ Status becomes "rejected"

Edge Cases:
✓ Try to respond to already-accepted proposal
✓ Try to admin-action already-processed proposal
✓ Non-admin tries to access admin panel
✓ Non-creator tries to respond to proposal
```

---

## Implementation Order

**Do these tickets in exact order:**

1. **PHASE-4-TICKET-001** - Add status fields to DB (30 min)
2. **PHASE-4-TICKET-002** - Update TypeScript types (15 min)
3. **PHASE-4-TICKET-003** - Admin check utility (20 min)
4. **PHASE-4-TICKET-004** - API GET /admin (30 min)
5. **PHASE-4-TICKET-005** - API PUT /admin/:id (1 hour)
6. **PHASE-4-TICKET-006** - Admin panel page (45 min)
7. **PHASE-4-TICKET-007** - Admin detail view (1 hour)
8. **PHASE-4-TICKET-008** - Admin action modals (1.5 hours)
9. **PHASE-4-TICKET-009** - Pioneer respond API (45 min)
10. **PHASE-4-TICKET-010** - Pioneer response UI (1 hour)
11. **PHASE-4-TICKET-011** - E2E integration test (45 min)

**Total Estimated Time: 8.5 hours**

## Database Schema After Phase 4

```sql
proposals (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ,
  creator_wallet_address TEXT,
  title TEXT,
  description TEXT,
  deliverable TEXT,
  requested_cstake_amount NUMERIC,
  
  -- NEW in Phase 4:
  status TEXT DEFAULT 'pending_review',
  foundation_offer_cstake_amount NUMERIC,
  foundation_notes TEXT
)
```

## Status Flow Visualization

```
Pioneer submits → pending_review
                       ↓
                  Admin reviews
                  ↙    ↓    ↘
            reject  accept  counter_offer
              ↓       ↓          ↓
          rejected  approved  counter_offer_pending
                      ↓          ↙        ↘
                   Pioneer    accept    reject
                   accepts      ↓          ↓
                      ↓      accepted  rejected
                  accepted
```

## What We're Skipping

- ❌ Multiple rounds of negotiation (one counter-offer only)
- ❌ Email notifications
- ❌ Push notifications
- ❌ Audit log database table
- ❌ Admin activity dashboard
- ❌ Proposal comments/discussion
- ❌ File attachments
- ❌ Proposal amendments

These can be added post-MVP.

## Success Criteria

After Phase 4 is complete:

✅ Admins can review proposals

✅ Admins can accept/reject/counter-offer

✅ Pioneers see and respond to admin actions

✅ Double Handshake concept implemented

✅ Both parties must agree before proceeding

✅ Status transitions enforced

✅ Ready for Phase 5 (Smart Contracts)

## Next Steps After Phase 4

Once Double Handshake works:

- Phase 5: Smart contract for token escrow
- Phase 6: Work completion and verification
- Phase 7: Token release
- Phase 8: Co-founder dashboard enhancements

The proposal lifecycle is now functional from submission to acceptance!