# CrowdStaking MVP - Implementation Tickets

**Project:** CrowdStaking Platform  
**Version:** 1.0.0  
**Last Updated:** November 9, 2025  
**Total Tickets:** 75  
**Total Epics:** 6

---

## Status Legend

- 🟢 **Done** - Completed and tested
- 🟡 **In Progress** - Currently being worked on
- ⚪ **Todo** - Not started yet
- 🔴 **Blocked** - Waiting on dependency or external factor
- ⏸️ **On Hold** - Deprioritized

---

## Priority System

- **P0 (Critical)** - Blocking MVP launch, must be done first
- **P1 (High)** - Core MVP functionality, needed for launch
- **P2 (Medium)** - Important but not blocking
- **P3 (Low)** - Nice to have, can be post-MVP

---

## Time Estimates Guide

- **XS** - 1-2 hours
- **S** - 2-4 hours
- **M** - 4-8 hours (half day to full day)
- **L** - 1-2 days
- **XL** - 2-4 days

---

## Table of Contents

- [EPIC-000: Infrastructure & Foundation](#epic-000-infrastructure--foundation)
- [EPIC-001: MVP-001 - Missions Board](#epic-001-mvp-001---missions-board)
- [EPIC-002: MVP-002 - Proposal Engine](#epic-002-mvp-002---proposal-engine)
- [EPIC-003: MVP-003 - Manual Mediator & Double Handshake](#epic-003-mvp-003---manual-mediator--double-handshake)
- [EPIC-004: MVP-004 - Smart Contract](#epic-004-mvp-004---smart-contract)
- [EPIC-005: MVP-005 - Co-Owner Dashboard](#epic-005-mvp-005---co-owner-dashboard)
- [Implementation Order](#implementation-order)
- [Testing Strategy](#testing-strategy)
- [Deployment Checklist](#deployment-checklist)

---

# EPIC-000: Infrastructure & Foundation

**Goal:** Set up all foundational infrastructure needed for the MVP  
**Status:** ⚪ Todo  
**Tickets:** 15  
**Estimated Time:** 4-6 days

---

## TICKET-001: Environment Setup & Configuration

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** XS (1-2h)  
**Dependencies:** None

### Description
Set up all environment variables, create .env.example template, and configure environment loading for development, staging, and production.

### Definition of Done
- [ ] `.env.example` file created with all required variables
- [ ] `.env.local` properly gitignored
- [ ] Environment variables documented in README
- [ ] Next.js environment variable loading verified
- [ ] Separate configs for client/server variables

### Technical Notes
```bash
# Required Environment Variables
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_BASE_CHAIN_ID=8453
ADMIN_WALLET_ADDRESS=
RPC_URL=
CSTAKE_POOL_ADDRESS=
```

### Related Files
- `.env.example` (create)
- `.env.local` (create, gitignored)
- `src/lib/env.ts` (create for validation)
- `.gitignore` (update)

---

## TICKET-002: Supabase Project Setup & Configuration

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-001

### Description
Create Supabase project, configure authentication, set up database, and integrate with Next.js application.

### Definition of Done
- [ ] Supabase project created on supabase.com
- [ ] Database initialized in Frankfurt region (EU)
- [ ] Supabase client configured in Next.js
- [ ] Connection tested from local development
- [ ] RLS (Row Level Security) policies prepared

### Technical Notes
- Use Supabase MCP tools for project creation
- Choose Frankfurt region for GDPR compliance
- Enable PostgREST for automatic API generation
- Set up JWT secret for authentication

### Related Files
- `src/lib/supabase/client.ts` (create)
- `src/lib/supabase/server.ts` (create)
- Environment variables

---

## TICKET-003: Database Schema Design Document

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-002

### Description
Document complete database schema with all tables, relationships, indexes, and RLS policies before implementation.

### Definition of Done
- [ ] Schema diagram created (proposals, users, agreements, etc.)
- [ ] All table relationships documented
- [ ] Index strategy defined
- [ ] RLS policies documented
- [ ] Migration order planned

### Technical Notes
Key tables:
- `users` (wallet_address, created_at, role)
- `proposals` (see MVP_FEATURES.md line 117-134)
- `agreements` (for smart contract tracking)
- `missions` (project missions)
- `audit_log` (status changes)

### Related Files
- `dev-docs/DATABASE_SCHEMA.md` (create)
- `supabase/migrations/` (prepare structure)

---

## TICKET-004: Create proposals Table Migration

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-003

### Description
Implement the proposals table migration with all columns, constraints, indexes, and RLS policies as specified in MVP_FEATURES.md.

### Definition of Done
- [ ] Migration file created in `supabase/migrations/`
- [ ] All columns from MVP_FEATURES.md implemented
- [ ] Status enum constraint added
- [ ] Indexes on creator_wallet_address and status
- [ ] RLS policies: users can read own proposals
- [ ] Migration tested on local Supabase

### Technical Notes
```sql
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  creator_wallet_address TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverable TEXT NOT NULL,
  requested_cstake_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  foundation_offer_cstake_amount NUMERIC,
  foundation_notes TEXT,
  CONSTRAINT valid_status CHECK (status IN (
    'pending_review',
    'counter_offer_pending',
    'foundation_approved',
    'pioneer_approved',
    'work_in_progress',
    'completed',
    'rejected'
  ))
);

CREATE INDEX idx_proposals_creator ON proposals(creator_wallet_address);
CREATE INDEX idx_proposals_status ON proposals(status);
```

### Related Files
- `supabase/migrations/001_create_proposals.sql` (create)

---

## TICKET-005: Create users Table Migration

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-003

### Description
Create users table to track wallet addresses, roles (founder/cofounder/admin), and user metadata.

### Definition of Done
- [ ] Migration file created
- [ ] wallet_address as primary key (TEXT)
- [ ] role column with enum constraint
- [ ] created_at, updated_at timestamps
- [ ] RLS policies configured
- [ ] Migration applied successfully

### Technical Notes
```sql
CREATE TABLE users (
  wallet_address TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'cofounder',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('founder', 'cofounder', 'admin'))
);
```

### Related Files
- `supabase/migrations/002_create_users.sql` (create)

---

## TICKET-006: Setup SIWE (Sign-In with Ethereum) Authentication

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** L (1-2d)  
**Dependencies:** TICKET-002, TICKET-005

### Description
Implement Sign-In with Ethereum (SIWE) authentication flow using ThirdWeb SDK for secure wallet-based authentication.

### Definition of Done
- [ ] SIWE library integrated (thirdweb or siwe package)
- [ ] Login flow: wallet signature generation
- [ ] Backend verification of signatures
- [ ] JWT token generation and storage
- [ ] Session management in Next.js
- [ ] Logout functionality
- [ ] Auth middleware for protected routes

### Technical Notes
- Use ThirdWeb Auth for simplified implementation
- Store JWT in httpOnly cookies for security
- Session expires after 7 days
- Reference: https://portal.thirdweb.com/connect/auth

### Related Files
- `src/lib/auth/siwe.ts` (create)
- `src/lib/auth/middleware.ts` (create)
- `src/app/api/auth/login/route.ts` (create)
- `src/app/api/auth/logout/route.ts` (create)
- `src/app/api/auth/verify/route.ts` (create)

---

## TICKET-007: ThirdWeb SDK Wallet Connection Integration

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-001, TICKET-006

### Description
Integrate ThirdWeb ConnectButton component and wallet connection hooks throughout the application.

### Definition of Done
- [ ] ConnectButton component added to Navigation
- [ ] useActiveAccount hook integrated
- [ ] useActiveWallet hook integrated
- [ ] Wallet disconnection handled
- [ ] Network switching to Base chain
- [ ] Connection state persisted across refreshes

### Technical Notes
```typescript
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";

// Replace "Login" button in Navigation.tsx
<ConnectButton client={client} />
```

### Related Files
- `src/components/Navigation.tsx` (update)
- `src/lib/thirdweb.ts` (already exists, verify)
- `src/app/providers.tsx` (verify ThirdwebProvider)

---

## TICKET-008: API Route Structure Setup

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** None

### Description
Create organized API route structure following Next.js App Router conventions with proper TypeScript types.

### Definition of Done
- [ ] `/src/app/api/` folder structure created
- [ ] API response type definitions created
- [ ] Standard success/error response format
- [ ] Route handler template created
- [ ] Documentation for API structure

### Technical Notes
```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── verify/route.ts
├── proposals/
│   ├── route.ts (GET all, POST new)
│   ├── me/route.ts (GET user's proposals)
│   ├── admin/route.ts (GET admin view)
│   ├── [id]/route.ts (GET, PUT, DELETE)
│   └── respond/[id]/route.ts
├── contracts/
│   ├── create-agreement/route.ts
│   ├── confirm-work/[id]/route.ts
│   └── release-agreement/[id]/route.ts
└── cstake-price/route.ts
```

### Related Files
- `src/app/api/` (create folder structure)
- `src/types/api.ts` (create)

---

## TICKET-009: Authentication Middleware Implementation

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-006

### Description
Create reusable authentication middleware to protect API routes and verify JWT tokens.

### Definition of Done
- [ ] Middleware function extracts JWT from cookies
- [ ] Token verification implemented
- [ ] User wallet address extracted from token
- [ ] 401 Unauthorized responses for invalid tokens
- [ ] Middleware easily applied to route handlers
- [ ] TypeScript types for authenticated requests

### Technical Notes
```typescript
// src/lib/auth/middleware.ts
export async function withAuth(
  req: Request,
  handler: (req: Request, user: { walletAddress: string }) => Promise<Response>
): Promise<Response> {
  const token = req.cookies.get('auth_token');
  // Verify token, extract user, call handler
}
```

### Related Files
- `src/lib/auth/middleware.ts` (create)
- `src/types/auth.ts` (create)

---

## TICKET-010: Admin Role & Authorization System

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-005, TICKET-009

### Description
Implement admin authorization checking to protect admin-only API routes and UI components.

### Definition of Done
- [ ] Admin wallet addresses stored in environment variables
- [ ] isAdmin() utility function created
- [ ] withAdminAuth() middleware created
- [ ] Admin-only API routes protected
- [ ] Admin UI components conditionally rendered
- [ ] 403 Forbidden responses for non-admins

### Technical Notes
```typescript
// Environment variable
ADMIN_WALLET_ADDRESS=0xYourWalletAddress

// Check function
export function isAdmin(walletAddress: string): boolean {
  const adminAddresses = process.env.ADMIN_WALLET_ADDRESS?.split(',');
  return adminAddresses?.includes(walletAddress.toLowerCase()) ?? false;
}
```

### Related Files
- `src/lib/auth/admin.ts` (create)
- `src/lib/auth/middleware.ts` (update)
- `.env.example` (update)

---

## TICKET-011: Error Handling Utilities

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-008

### Description
Create standardized error handling utilities for consistent error responses across all API routes.

### Definition of Done
- [ ] Custom error classes created (ValidationError, AuthError, etc.)
- [ ] Error response formatter implemented
- [ ] HTTP status code mapping
- [ ] Error logging utility
- [ ] Client-side error display component
- [ ] Error boundaries for React components

### Technical Notes
```typescript
// src/lib/errors.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

export function formatErrorResponse(error: unknown): Response {
  // Format error with status code, message, code
}
```

### Related Files
- `src/lib/errors.ts` (create)
- `src/components/ErrorBoundary.tsx` (create)
- `src/components/ErrorDisplay.tsx` (create)

---

## TICKET-012: API Response Standardization

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** XS (1-2h)  
**Dependencies:** TICKET-008, TICKET-011

### Description
Define and implement standard API response format for all endpoints (success and error).

### Definition of Done
- [ ] Response type interfaces defined
- [ ] Success response helper function
- [ ] Error response helper function
- [ ] Response types exported from central location
- [ ] All endpoints use standard format

### Technical Notes
```typescript
// Standard response format
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}
```

### Related Files
- `src/types/api.ts` (update)
- `src/lib/api/response.ts` (create)

---

## TICKET-013: Rate Limiting Setup

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-008

### Description
Implement rate limiting middleware to protect API endpoints from abuse.

### Definition of Done
- [ ] Rate limiting library integrated (upstash/ratelimit or similar)
- [ ] Rate limits configured per endpoint type
- [ ] IP-based and wallet-based limiting
- [ ] 429 Too Many Requests responses
- [ ] Rate limit headers included in responses
- [ ] Redis or Upstash for distributed rate limiting

### Technical Notes
```typescript
// Example limits
- Authentication: 5 requests per minute
- Proposal submission: 10 per hour per wallet
- Read endpoints: 100 per minute per IP
```

### Related Files
- `src/lib/ratelimit.ts` (create)
- `src/lib/middleware/ratelimit.ts` (create)
- Environment variables for Upstash

---

## TICKET-014: CORS Configuration

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** XS (1-2h)  
**Dependencies:** TICKET-008

### Description
Configure CORS headers for API routes to allow cross-origin requests from approved domains.

### Definition of Done
- [ ] CORS middleware implemented
- [ ] Allowed origins configured from environment
- [ ] Preflight requests handled
- [ ] Credentials support enabled
- [ ] CORS headers on all API responses

### Technical Notes
```typescript
// Allowed origins
NEXT_PUBLIC_APP_URL=https://crowdstaking.org
ALLOWED_ORIGINS=https://crowdstaking.org,http://localhost:3000
```

### Related Files
- `src/lib/middleware/cors.ts` (create)
- `next.config.ts` (update)
- `.env.example` (update)

---

## TICKET-015: Logging & Monitoring Setup

**Epic:** EPIC-000  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-008

### Description
Set up structured logging and basic monitoring for the application.

### Definition of Done
- [ ] Logging library integrated (pino or winston)
- [ ] Log levels configured (dev vs production)
- [ ] Request/response logging middleware
- [ ] Error logging with stack traces
- [ ] Performance metrics logging
- [ ] Log output to console and file

### Technical Notes
- Use pino for performance
- Include request ID for tracing
- Log all API requests with status codes
- Separate error logs for debugging

### Related Files
- `src/lib/logger.ts` (create)
- `src/lib/middleware/logging.ts` (create)

---

# EPIC-001: MVP-001 - Missions Board

**Goal:** Complete the homepage as the "lighthouse" with clear CTA to proposal submission  
**Status:** ⚪ Todo  
**Tickets:** 8  
**Estimated Time:** 1-2 days

---

## TICKET-016: Update Homepage CTA Button Routing

**Epic:** EPIC-001  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** XS (1-2h)  
**Dependencies:** TICKET-024

### Description
Update the "Make a Proposal" CTA button on homepage to route to `/dashboard/propose` instead of placeholder.

### Definition of Done
- [ ] CTA button href updated to `/dashboard/propose`
- [ ] Button click tracked with analytics
- [ ] Mobile CTA also updated
- [ ] Hover states and animations preserved
- [ ] Link preloading for fast navigation

### Technical Notes
Affected buttons in:
- NewHeroSection component
- FinalCTASection component
- Any other CTA sections

### Related Files
- `src/components/NewHeroSection.tsx` (update)
- `src/components/FinalCTASection.tsx` (update)

---

## TICKET-017: Connect "Make a Proposal" to Auth Flow

**Epic:** EPIC-001  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-006, TICKET-016

### Description
Implement auth check before allowing access to proposal submission page - redirect to wallet connection if not authenticated.

### Definition of Done
- [ ] Auth check on `/dashboard/propose` page load
- [ ] Redirect to wallet connection modal if not authenticated
- [ ] Return to `/dashboard/propose` after successful auth
- [ ] User session persisted across redirects
- [ ] Error handling for failed auth

### Technical Notes
```typescript
// In /dashboard/propose page
const account = useActiveAccount();
if (!account) {
  // Show connect wallet modal or redirect
}
```

### Related Files
- `src/app/dashboard/propose/page.tsx` (create)
- `src/components/ConnectWalletPrompt.tsx` (create)

---

## TICKET-018: Add Wallet Connection Prompt Component

**Epic:** EPIC-001  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-007

### Description
Create reusable wallet connection prompt component for unauthenticated users trying to access protected pages.

### Definition of Done
- [ ] ConnectWalletPrompt component created
- [ ] Shows clear message about needing wallet
- [ ] Includes ThirdWeb ConnectButton
- [ ] Optional redirect after connection
- [ ] Can be used on any protected page
- [ ] Mobile responsive

### Technical Notes
Design should be clean and welcoming, not blocking. Explain why wallet connection is needed.

### Related Files
- `src/components/ConnectWalletPrompt.tsx` (create)
- `src/components/ProtectedRoute.tsx` (create wrapper)

---

## TICKET-019: Investment Memo/Whitepaper Link Integration

**Epic:** EPIC-001  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** XS (1-2h)  
**Dependencies:** None

### Description
Add prominent link to Investment Memo/Whitepaper on homepage as specified in MVP_FEATURES.md AC1.

### Definition of Done
- [ ] Whitepaper link added to hero section
- [ ] Link styled as secondary CTA or text link
- [ ] Routes to `/whitepaper` page
- [ ] Link tracked with analytics
- [ ] Works on mobile

### Technical Notes
Reference MVP_FEATURES.md line 44: "A link to the Investment Memo / Whitepaper"

### Related Files
- `src/components/NewHeroSection.tsx` (update)

---

## TICKET-020: Areas of Need Section Content Update

**Epic:** EPIC-001  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** S (2-4h)  
**Dependencies:** None

### Description
Update homepage "Areas of Need" section to showcase mission goals (not tasks) as per MVP_FEATURES.md AC1.

### Definition of Done
- [ ] Section content updated with mission goals
- [ ] Examples: "Decentralization of Mediation", "Scaling Projects"
- [ ] Not a task list - strategic goals only
- [ ] Visually distinct from missions/tasks
- [ ] Mobile responsive layout

### Technical Notes
Reference MVP_FEATURES.md line 46: "Areas of Need section (mission goals) that is NOT a task list"

### Related Files
- `src/components/MissionsSection.tsx` (update or create)
- `src/app/page.tsx` (add section if missing)

---

## TICKET-021: Homepage Hero Section Optimization

**Epic:** EPIC-001  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** M (4-8h)  
**Dependencies:** None

### Description
Optimize hero section copy and design to clearly communicate the CrowdStaking vision as the "lighthouse" of the platform.

### Definition of Done
- [ ] Headline aligned with Vision document
- [ ] Sub-headline explains value proposition
- [ ] Visual hierarchy emphasizes CTA
- [ ] Animation smooth and non-distracting
- [ ] A/B test variations prepared (optional)
- [ ] Loading performance optimized

### Technical Notes
Reference Vision document and MVP_FEATURES.md line 43: "We're building the machine that builds ideas. Decentrally."

### Related Files
- `src/components/NewHeroSection.tsx` (update)
- `src/components/backgrounds/HeroBackground.tsx` (optimize)

---

## TICKET-022: Mobile Responsiveness Testing

**Epic:** EPIC-001  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-016 to TICKET-021

### Description
Comprehensive mobile responsiveness testing and fixes for homepage on all breakpoints.

### Definition of Done
- [ ] Tested on mobile (375px, 414px widths)
- [ ] Tested on tablet (768px, 1024px widths)
- [ ] All CTAs accessible and clickable
- [ ] Text readable without zooming
- [ ] Images properly sized and optimized
- [ ] No horizontal scroll on any device
- [ ] Touch targets meet accessibility standards

### Technical Notes
Test browsers: Safari iOS, Chrome Android, Firefox Mobile

### Related Files
- All homepage components
- `src/app/globals.css` (responsive utilities)

---

## TICKET-023: Analytics Tracking Integration

**Epic:** EPIC-001  
**Status:** ⚪ Todo  
**Priority:** P3 (Low)  
**Estimated Time:** S (2-4h)  
**Dependencies:** None

### Description
Integrate analytics tracking for key user actions on homepage (CTA clicks, section views, etc.).

### Definition of Done
- [ ] Analytics provider integrated (Vercel Analytics, GA4, or Plausible)
- [ ] Page views tracked
- [ ] CTA button clicks tracked
- [ ] Whitepaper link clicks tracked
- [ ] Section scroll depth tracked
- [ ] Privacy-compliant (GDPR)

### Technical Notes
Consider using Vercel Analytics (built-in) or privacy-focused Plausible.

### Related Files
- `src/app/layout.tsx` (add analytics provider)
- `src/lib/analytics.ts` (create)

---

# EPIC-002: MVP-002 - Proposal Engine

**Goal:** Enable co-founders to submit proposals to founders  
**Status:** ⚪ Todo  
**Tickets:** 12  
**Estimated Time:** 3-4 days

---

## TICKET-024: Create /dashboard/propose Route & Page

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-006, TICKET-017

### Description
Create the proposal submission page route and basic page structure with auth protection.

### Definition of Done
- [ ] Page file created at `src/app/dashboard/propose/page.tsx`
- [ ] Auth protection middleware applied
- [ ] Page layout with header and description
- [ ] Back navigation to dashboard
- [ ] Loading state while checking auth
- [ ] Error boundary implemented

### Technical Notes
Reference MVP_FEATURES.md line 95-96: User should see a form at `/dashboard/propose`

### Related Files
- `src/app/dashboard/propose/page.tsx` (create)

---

## TICKET-025: Proposal Form UI Component

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-024

### Description
Build the proposal submission form UI with all required fields as specified in MVP_FEATURES.md.

### Definition of Done
- [ ] Title input (text, max 100 characters)
- [ ] Description textarea (Markdown capable)
- [ ] Deliverable textarea (Markdown capable)
- [ ] Requested $CSTAKE amount input (number, > 0)
- [ ] Form styling consistent with design system
- [ ] Clear field labels and help text
- [ ] Submit button with loading state
- [ ] Character counters for limited fields

### Technical Notes
Reference MVP_FEATURES.md line 97-101 for exact field specifications.

### Related Files
- `src/app/dashboard/propose/page.tsx` (update)
- `src/components/forms/ProposalForm.tsx` (create)

---

## TICKET-026: Markdown Editor Integration

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-025

### Description
Integrate markdown editor library for description and deliverable fields with proper styling.

### Definition of Done
- [ ] Markdown editor library integrated (react-markdown-editor-lite or similar)
- [ ] Editor integrated in description field
- [ ] Editor integrated in deliverable field
- [ ] Toolbar with basic formatting options
- [ ] Syntax highlighting for code blocks
- [ ] Image upload support (optional for MVP)
- [ ] Mobile-friendly editor

### Technical Notes
Consider using:
- `react-markdown-editor-lite` for editing
- `react-markdown` for rendering
- `remark-gfm` for GitHub Flavored Markdown

### Related Files
- `src/components/forms/MarkdownEditor.tsx` (create)
- `package.json` (add dependencies)

---

## TICKET-027: Markdown Preview Component

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-026

### Description
Create live markdown preview component that shows formatted output as user types.

### Definition of Done
- [ ] Preview pane shows rendered markdown
- [ ] Updates in real-time as user types
- [ ] Styled consistently with site design
- [ ] Code blocks properly highlighted
- [ ] Lists, links, and formatting render correctly
- [ ] Toggle between edit and preview modes

### Technical Notes
```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {markdownContent}
</ReactMarkdown>
```

### Related Files
- `src/components/forms/MarkdownPreview.tsx` (create)
- `src/app/dashboard/propose/page.tsx` (integrate)

---

## TICKET-028: Client-Side Form Validation (Zod Schema)

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-025

### Description
Implement client-side form validation using Zod schema and React Hook Form for better UX.

### Definition of Done
- [ ] Zod schema defined for proposal form
- [ ] React Hook Form integrated
- [ ] Real-time validation feedback
- [ ] Error messages displayed inline
- [ ] Submit button disabled if form invalid
- [ ] Validation matches server-side rules

### Technical Notes
```typescript
import { z } from 'zod';

const proposalSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10),
  deliverable: z.string().min(10),
  requested_cstake_amount: z.number().positive(),
});
```

### Related Files
- `src/lib/validation/proposal.ts` (create schema)
- `src/app/dashboard/propose/page.tsx` (integrate)
- `package.json` (add zod, react-hook-form)

---

## TICKET-029: API POST /api/proposals Endpoint

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-004, TICKET-009, TICKET-028

### Description
Implement backend API endpoint to receive and save new proposals to the database.

### Definition of Done
- [ ] Route handler at `src/app/api/proposals/route.ts`
- [ ] POST method handles proposal submission
- [ ] Authentication middleware applied
- [ ] Request body validated server-side
- [ ] Wallet address extracted from auth token
- [ ] Proposal saved to Supabase
- [ ] Success response with proposal ID
- [ ] Error handling for all edge cases

### Technical Notes
Reference MVP_FEATURES.md line 136-142 for endpoint specification.

### Related Files
- `src/app/api/proposals/route.ts` (create)
- `src/lib/validation/proposal.ts` (use schema)

---

## TICKET-030: Server-Side Validation & Sanitization

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-029

### Description
Implement comprehensive server-side validation and sanitization of proposal input to prevent XSS and injection attacks.

### Definition of Done
- [ ] All fields validated against Zod schema
- [ ] Markdown sanitized to prevent XSS
- [ ] SQL injection prevention (Supabase handles this)
- [ ] Requested amount validated as positive number
- [ ] Title and fields trimmed
- [ ] Maximum lengths enforced
- [ ] Validation errors returned with details

### Technical Notes
Use DOMPurify or similar for markdown sanitization if allowing HTML in markdown.

### Related Files
- `src/lib/validation/sanitize.ts` (create)
- `src/app/api/proposals/route.ts` (update)

---

## TICKET-031: Wallet Signature Verification

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-006, TICKET-029

### Description
Verify that the proposal creator actually owns the wallet address they claim (prevent impersonation).

### Definition of Done
- [ ] Signature verification on proposal submission
- [ ] JWT token validated and wallet extracted
- [ ] Wallet address stored in database matches token
- [ ] Signature replay attack prevention
- [ ] Clear error messages for invalid signatures
- [ ] Signature expiration handling

### Technical Notes
Reference MVP_FEATURES.md line 149-150: "creator_wallet_address must NOT come from form but from authenticated session"

### Related Files
- `src/app/api/proposals/route.ts` (update)
- `src/lib/auth/verify.ts` (reuse from TICKET-006)

---

## TICKET-032: Save Proposal to Database

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-029, TICKET-030, TICKET-031

### Description
Implement database insertion logic for validated proposals with proper error handling.

### Definition of Done
- [ ] Supabase client configured for insertion
- [ ] All proposal fields inserted correctly
- [ ] UUID generated automatically
- [ ] Timestamps set automatically
- [ ] Default status 'pending_review' applied
- [ ] Database errors caught and logged
- [ ] Transaction rollback on failure

### Technical Notes
```typescript
const { data, error } = await supabase
  .from('proposals')
  .insert({
    creator_wallet_address: user.walletAddress,
    title: validatedData.title,
    description: validatedData.description,
    deliverable: validatedData.deliverable,
    requested_cstake_amount: validatedData.requested_cstake_amount,
    status: 'pending_review',
  })
  .select()
  .single();
```

### Related Files
- `src/app/api/proposals/route.ts` (update)

---

## TICKET-033: API GET /api/proposals/me Endpoint

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-004, TICKET-009

### Description
Implement endpoint to fetch all proposals created by the authenticated user.

### Definition of Done
- [ ] GET route handler implemented
- [ ] Authentication middleware applied
- [ ] Query filters by creator_wallet_address
- [ ] Proposals ordered by created_at DESC
- [ ] Pagination support (optional for MVP)
- [ ] Proper error handling
- [ ] Response includes all proposal fields

### Technical Notes
Reference MVP_FEATURES.md line 480-483 for endpoint specification.

### Related Files
- `src/app/api/proposals/me/route.ts` (create)

---

## TICKET-034: Success Redirect & Notification

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-029, TICKET-032

### Description
Implement success handling after proposal submission with redirect to dashboard and success notification.

### Definition of Done
- [ ] Success toast/notification displayed
- [ ] User redirected to `/dashboard` or `/cofounder-dashboard`
- [ ] New proposal visible in proposals list
- [ ] Success message includes next steps
- [ ] Animation smooth and non-jarring
- [ ] Works on mobile

### Technical Notes
Reference MVP_FEATURES.md line 106-107: "I am redirected to my Dashboard where I see my new proposal in the list"

### Related Files
- `src/app/dashboard/propose/page.tsx` (update)
- `src/components/Notification.tsx` (create or use toast library)

---

## TICKET-035: Error Handling & User Feedback

**Epic:** EPIC-002  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-029, TICKET-011

### Description
Implement comprehensive error handling and user feedback for all failure scenarios in proposal submission.

### Definition of Done
- [ ] Network errors handled gracefully
- [ ] Validation errors displayed inline
- [ ] Server errors shown with retry option
- [ ] Rate limit errors explained clearly
- [ ] Loading states during submission
- [ ] Form data preserved on error
- [ ] Error tracking/logging implemented

### Technical Notes
Error scenarios to handle:
- Network timeout
- Server 500 error
- Validation failure
- Rate limit hit
- Authentication expired
- Database error

### Related Files
- `src/app/dashboard/propose/page.tsx` (update)
- `src/lib/errors.ts` (use from TICKET-011)

---

# EPIC-003: MVP-003 - Manual Mediator & Double Handshake

**Goal:** Enable foundation to review proposals and negotiate with pioneers (Double Handshake)  
**Status:** ⚪ Todo  
**Tickets:** 14  
**Estimated Time:** 4-5 days

---

## TICKET-036: Status State Machine Implementation

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-004

### Description
Implement status state machine logic to enforce valid status transitions for proposals.

### Definition of Done
- [ ] State machine defined with all valid transitions
- [ ] Transition validation function implemented
- [ ] Invalid transitions blocked with errors
- [ ] Status history logging (audit trail)
- [ ] TypeScript types for all statuses
- [ ] Unit tests for all transitions
- [ ] Documentation of state machine diagram

### Technical Notes
Reference MVP_FEATURES.md line 206-225 for complete state machine specification.

Valid transitions:
```
pending_review -> [rejected, counter_offer_pending, foundation_approved]
counter_offer_pending -> [rejected, pioneer_approved]
foundation_approved -> [pioneer_approved]
pioneer_approved -> [work_in_progress]
work_in_progress -> [completed]
```

### Related Files
- `src/lib/proposals/stateMachine.ts` (create)
- `src/types/proposal.ts` (create)

---

## TICKET-037: Create /admin/proposals Route

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-010

### Description
Create admin panel route for reviewing proposals with admin-only protection.

### Definition of Done
- [ ] Page at `src/app/admin/proposals/page.tsx` created
- [ ] Admin middleware protection applied
- [ ] 403 Forbidden for non-admin users
- [ ] Layout consistent with dashboard
- [ ] Navigation back to main app
- [ ] Mobile responsive

### Technical Notes
Admin wallet address check required before rendering.

### Related Files
- `src/app/admin/proposals/page.tsx` (create)
- `src/app/admin/layout.tsx` (create admin layout)

---

## TICKET-038: Admin Authentication Check

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-010, TICKET-037

### Description
Implement admin authentication checks for both API routes and UI pages.

### Definition of Done
- [ ] useIsAdmin() hook created for client components
- [ ] Server-side admin check utility
- [ ] Redirect non-admins to homepage
- [ ] Clear error message for unauthorized access
- [ ] Admin role cached in session
- [ ] Works for multiple admin wallets

### Technical Notes
```typescript
export function useIsAdmin() {
  const account = useActiveAccount();
  return isAdmin(account?.address ?? '');
}
```

### Related Files
- `src/hooks/useIsAdmin.ts` (create)
- `src/lib/auth/admin.ts` (update)

---

## TICKET-039: API GET /api/proposals/admin Endpoint

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-004, TICKET-010

### Description
Implement admin API endpoint to fetch all proposals for review.

### Definition of Done
- [ ] Route handler at `src/app/api/proposals/admin/route.ts`
- [ ] Admin middleware protection
- [ ] Returns all proposals (all statuses)
- [ ] Includes creator wallet addresses
- [ ] Sorted by created_at DESC
- [ ] Optional filtering by status
- [ ] Pagination support

### Technical Notes
Reference MVP_FEATURES.md line 228-230 for endpoint specification.

### Related Files
- `src/app/api/proposals/admin/route.ts` (create)

---

## TICKET-040: Admin Panel UI (Proposals List)

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-037, TICKET-039

### Description
Build admin panel UI showing all proposals with status indicators and action buttons.

### Definition of Done
- [ ] Proposals list with cards/table layout
- [ ] Status badges color-coded
- [ ] Creator wallet address displayed
- [ ] Requested amount shown
- [ ] Created date displayed
- [ ] Filter by status dropdown
- [ ] Click proposal to open detail view
- [ ] Loading and empty states

### Technical Notes
Show at a glance:
- Proposal title
- Creator (truncated address)
- Status (colored badge)
- Requested amount
- Date created

### Related Files
- `src/app/admin/proposals/page.tsx` (update)
- `src/components/admin/ProposalsList.tsx` (create)

---

## TICKET-041: Proposal Detail View (Admin)

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-040

### Description
Create detailed proposal view for admins with full proposal content and action buttons.

### Definition of Done
- [ ] Detail page at `/admin/proposals/[id]`
- [ ] Full proposal content displayed
- [ ] Markdown rendered properly
- [ ] Creator wallet info shown
- [ ] Status history timeline
- [ ] Action buttons contextual to status
- [ ] Back to proposals list navigation

### Technical Notes
Actions depend on current status:
- pending_review: Reject, Counter-Offer, Accept
- Other statuses: View only or specific actions

### Related Files
- `src/app/admin/proposals/[id]/page.tsx` (create)

---

## TICKET-042: API PUT /api/proposals/admin/:id Endpoint

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-036, TICKET-039

### Description
Implement admin API endpoint to update proposals (reject, counter-offer, accept).

### Definition of Done
- [ ] PUT route handler implemented
- [ ] Admin middleware protection
- [ ] Action validation (reject/counter_offer/accept)
- [ ] State machine transition validation
- [ ] Update proposal in database
- [ ] Log status change to audit trail
- [ ] Return updated proposal
- [ ] Proper error handling

### Technical Notes
Reference MVP_FEATURES.md line 232-236 for endpoint specification.

Body schema:
```typescript
{
  action: 'reject' | 'counter_offer' | 'accept';
  foundation_offer_cstake_amount?: number;
  foundation_notes?: string;
}
```

### Related Files
- `src/app/api/proposals/admin/[id]/route.ts` (create)

---

## TICKET-043: Reject Action Implementation

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-042

### Description
Implement reject action for admins with required justification notes.

### Definition of Done
- [ ] Reject modal/form with notes field
- [ ] Notes field required (min length)
- [ ] API call to update status to 'rejected'
- [ ] foundation_notes saved to database
- [ ] Success notification
- [ ] Proposal list updated
- [ ] Pioneer notified (optional for MVP)

### Technical Notes
Reference MVP_FEATURES.md line 179: "Adds a justification (foundation_notes). Sets status to rejected."

### Related Files
- `src/app/admin/proposals/[id]/page.tsx` (update)
- `src/components/admin/RejectProposalModal.tsx` (create)

---

## TICKET-044: Counter-Offer Action Implementation

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-042

### Description
Implement counter-offer action allowing admins to propose different token amount with explanation.

### Definition of Done
- [ ] Counter-offer modal with amount and notes fields
- [ ] Amount field validated (must be positive)
- [ ] Notes field for explanation
- [ ] API call to update status to 'counter_offer_pending'
- [ ] foundation_offer_cstake_amount saved
- [ ] foundation_notes saved
- [ ] Success notification
- [ ] Pioneer can see counter-offer in their dashboard

### Technical Notes
Reference MVP_FEATURES.md line 180: "Enters a new amount (foundation_offer_cstake_amount) and a note (foundation_notes). Sets status to counter_offer_pending."

### Related Files
- `src/app/admin/proposals/[id]/page.tsx` (update)
- `src/components/admin/CounterOfferModal.tsx` (create)

---

## TICKET-045: Accept Action Implementation

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-042

### Description
Implement accept action for admins to approve proposal at requested amount.

### Definition of Done
- [ ] Accept confirmation modal
- [ ] Shows requested amount for confirmation
- [ ] API call to update status to 'foundation_approved'
- [ ] Success notification
- [ ] Pioneer sees approval in dashboard
- [ ] Awaiting pioneer acceptance to proceed

### Technical Notes
Reference MVP_FEATURES.md line 181: "Accepts requested_cstake_amount. Sets status to foundation_approved."

### Related Files
- `src/app/admin/proposals/[id]/page.tsx` (update)
- `src/components/admin/AcceptProposalModal.tsx` (create)

---

## TICKET-046: API PUT /api/proposals/respond/:id Endpoint

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-036, TICKET-033

### Description
Implement pioneer API endpoint to respond to foundation actions (accept/reject counter-offer or approval).

### Definition of Done
- [ ] PUT route handler implemented
- [ ] Authentication middleware (must be proposal creator)
- [ ] Action validation (accept/reject)
- [ ] State validation (status must be counter_offer_pending or foundation_approved)
- [ ] Update status to pioneer_approved or rejected
- [ ] Trigger smart contract call if accepting (TICKET-063)
- [ ] Return updated proposal
- [ ] Error handling

### Technical Notes
Reference MVP_FEATURES.md line 238-245 for endpoint specification.

### Related Files
- `src/app/api/proposals/respond/[id]/route.ts` (create)

---

## TICKET-047: Pioneer Response UI (Counter-Offer)

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-046

### Description
Implement UI for pioneers to respond to counter-offers in their dashboard.

### Definition of Done
- [ ] Counter-offer displayed prominently in dashboard
- [ ] Shows foundation's offer amount and notes
- [ ] Accept and Reject buttons
- [ ] Confirmation modal before accepting
- [ ] API call to respond endpoint
- [ ] Success/error handling
- [ ] Proposal status updated in UI

### Technical Notes
Reference MVP_FEATURES.md line 183-189 for AC2 specification.

### Related Files
- `src/app/cofounder-dashboard/page.tsx` (update)
- `src/components/cofounder/CounterOfferResponse.tsx` (create)

---

## TICKET-048: Pioneer Accept/Reject Logic

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-046, TICKET-047

### Description
Implement client-side logic for pioneers accepting or rejecting foundation's offer/approval.

### Definition of Done
- [ ] Accept button triggers API call
- [ ] Reject button triggers API call
- [ ] Loading states during API calls
- [ ] Success notification on accept
- [ ] Explanation of next steps after accept
- [ ] Error handling with retry option
- [ ] Proposal status updated immediately

### Technical Notes
On accept:
- Status becomes 'pioneer_approved'
- Smart contract creation triggered (MVP-004)
- User informed about escrow setup

### Related Files
- `src/app/cofounder-dashboard/page.tsx` (update)
- `src/components/cofounder/CounterOfferResponse.tsx` (update)

---

## TICKET-049: Status Transition Logging & Audit Trail

**Epic:** EPIC-003  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-036

### Description
Implement comprehensive logging of all proposal status transitions for audit and debugging.

### Definition of Done
- [ ] audit_log table created in database
- [ ] All status changes logged with timestamp
- [ ] Actor (wallet address) recorded
- [ ] Previous and new status recorded
- [ ] Optional notes/reason field
- [ ] Query function to get proposal history
- [ ] Display timeline in admin UI
- [ ] Display timeline in pioneer UI

### Technical Notes
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  proposal_id UUID REFERENCES proposals(id),
  actor_wallet_address TEXT NOT NULL,
  action TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  notes TEXT
);
```

### Related Files
- `supabase/migrations/003_create_audit_log.sql` (create)
- `src/lib/proposals/auditLog.ts` (create)

---

# EPIC-004: MVP-004 - Smart Contract

**Goal:** Deploy vesting smart contract for escrow and token release  
**Status:** ⚪ Todo  
**Tickets:** 16  
**Estimated Time:** 5-7 days

---

## TICKET-050: Hardhat/Foundry Setup for Smart Contracts

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** None

### Description
Set up Solidity development environment with Hardhat or Foundry for smart contract development.

### Definition of Done
- [ ] Hardhat (or Foundry) installed and configured
- [ ] TypeScript support enabled
- [ ] Compile scripts working
- [ ] Test scripts configured
- [ ] Deploy scripts template created
- [ ] Folder structure organized
- [ ] .env configuration for private keys

### Technical Notes
Recommended structure:
```
contracts/
├── src/
│   ├── VestingContract.sol
│   └── interfaces/
├── test/
│   └── VestingContract.test.ts
├── scripts/
│   └── deploy.ts
└── hardhat.config.ts
```

### Related Files
- `contracts/` (create folder)
- `hardhat.config.ts` (create)
- `package.json` (add hardhat dependencies)

---

## TICKET-051: VestingContract.sol Implementation

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** L (1-2d)  
**Dependencies:** TICKET-050

### Description
Implement complete VestingContract.sol as specified in MVP_FEATURES.md with all functions.

### Definition of Done
- [ ] Contract code matches specification in MVP_FEATURES.md line 302-395
- [ ] All functions implemented (createAgreement, confirmWorkDone, releaseAgreement)
- [ ] Events defined and emitted
- [ ] Modifiers for access control
- [ ] Comments and NatSpec documentation
- [ ] Compiles without errors or warnings
- [ ] Constructor properly initializes state

### Technical Notes
Reference complete contract code in MVP_FEATURES.md line 302-395.

Key functions:
- createAgreement(uint256 _proposal_id, address _contributor, uint256 _amount)
- confirmWorkDone(uint256 _proposal_id)
- releaseAgreement(uint256 _proposal_id)
- getAgreement(uint256 _proposal_id)
- setFoundationWallet(address _newFoundation)

### Related Files
- `contracts/src/VestingContract.sol` (create)
- `contracts/src/interfaces/IVestingContract.sol` (create)

---

## TICKET-052: OpenZeppelin Dependencies Setup

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** XS (1-2h)  
**Dependencies:** TICKET-050

### Description
Install and configure OpenZeppelin contracts library for secure, audited contract components.

### Definition of Done
- [ ] @openzeppelin/contracts installed
- [ ] IERC20 import working
- [ ] Ownable import working
- [ ] Contract compiles with OZ dependencies
- [ ] License compatibility verified
- [ ] Version locked in package.json

### Technical Notes
```solidity
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
```

### Related Files
- `package.json` (add @openzeppelin/contracts)
- `contracts/src/VestingContract.sol` (use imports)

---

## TICKET-053: createAgreement Function Development

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-051, TICKET-052

### Description
Implement and test the createAgreement function with proper access control and token locking.

### Definition of Done
- [ ] Function implementation complete
- [ ] onlyFoundation modifier enforced
- [ ] Token transfer from foundation to contract
- [ ] Agreement struct created and stored
- [ ] AgreementCreated event emitted
- [ ] Require checks for validation
- [ ] Unit tests passing

### Technical Notes
Reference MVP_FEATURES.md line 343-354.

Validations:
- Agreement doesn't already exist for proposal_id
- Contributor address is valid (not zero)
- Amount is greater than zero
- Token transfer succeeds

### Related Files
- `contracts/src/VestingContract.sol` (update)
- `contracts/test/VestingContract.test.ts` (add tests)

---

## TICKET-054: confirmWorkDone Function Development

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-051

### Description
Implement and test the confirmWorkDone function for pioneers to signal work completion.

### Definition of Done
- [ ] Function implementation complete
- [ ] Only contributor can call
- [ ] Agreement exists validation
- [ ] Already confirmed check
- [ ] pioneer_confirmed flag set to true
- [ ] PioneerConfirmed event emitted
- [ ] Unit tests passing

### Technical Notes
Reference MVP_FEATURES.md line 356-365.

### Related Files
- `contracts/src/VestingContract.sol` (update)
- `contracts/test/VestingContract.test.ts` (add tests)

---

## TICKET-055: releaseAgreement Function Development

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-051, TICKET-053, TICKET-054

### Description
Implement and test the releaseAgreement function for token release after double confirmation.

### Definition of Done
- [ ] Function implementation complete
- [ ] onlyFoundation modifier enforced
- [ ] pioneer_confirmed validation
- [ ] Already released check
- [ ] Token transfer to contributor
- [ ] AgreementReleased event emitted
- [ ] Agreement deleted (gas optimization)
- [ ] Unit tests passing

### Technical Notes
Reference MVP_FEATURES.md line 367-383.

This is the most critical function - must be secure and well-tested.

### Related Files
- `contracts/src/VestingContract.sol` (update)
- `contracts/test/VestingContract.test.ts` (add tests)

---

## TICKET-056: Smart Contract Unit Tests

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** L (1-2d)  
**Dependencies:** TICKET-053, TICKET-054, TICKET-055

### Description
Write comprehensive unit tests for all contract functions covering happy paths and edge cases.

### Definition of Done
- [ ] Test coverage > 90%
- [ ] All functions tested
- [ ] Edge cases covered
- [ ] Access control tested
- [ ] Events emission tested
- [ ] Require statements tested
- [ ] Revert scenarios tested
- [ ] All tests passing

### Technical Notes
Test scenarios:
- Happy path: create -> confirm -> release
- Access control violations
- Invalid inputs
- Re-entrancy (not applicable but good to verify)
- Double confirmation attempts
- Non-existent agreement access

### Related Files
- `contracts/test/VestingContract.test.ts` (expand)

---

## TICKET-057: Smart Contract Integration Tests

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-056

### Description
Write integration tests simulating full proposal lifecycle with contract interactions.

### Definition of Done
- [ ] End-to-end test scenarios
- [ ] Multiple agreements tested
- [ ] Token flow verified
- [ ] Multi-user scenarios
- [ ] Foundation wallet changes tested
- [ ] Tests run on local Hardhat network
- [ ] All integration tests passing

### Technical Notes
Scenarios:
- Single proposal lifecycle
- Multiple concurrent proposals
- Foundation wallet rotation
- Failed work (pioneer doesn't confirm)

### Related Files
- `contracts/test/integration/VestingContract.integration.test.ts` (create)

---

## TICKET-058: Gas Optimization Analysis

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-056

### Description
Analyze and optimize smart contract gas costs for all functions.

### Definition of Done
- [ ] Gas report generated for all functions
- [ ] Optimization opportunities identified
- [ ] High-cost operations optimized
- [ ] Storage patterns optimized
- [ ] Before/after gas comparison
- [ ] Documentation of optimizations
- [ ] No security trade-offs made

### Technical Notes
Optimization techniques:
- Use calldata instead of memory where possible
- Pack storage variables
- Use uint256 (default size) when possible
- Delete storage to get gas refund
- Avoid unnecessary SLOADs

### Related Files
- `contracts/src/VestingContract.sol` (optimize)
- `docs/GAS_OPTIMIZATION.md` (create report)

---

## TICKET-059: Security Audit Preparation

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-056, TICKET-057

### Description
Prepare smart contract for security audit with documentation and self-review.

### Definition of Done
- [ ] All code documented with NatSpec
- [ ] Security considerations documented
- [ ] Known limitations documented
- [ ] Slither static analysis run (no critical issues)
- [ ] Mythril analysis run (no critical issues)
- [ ] Manual security review checklist completed
- [ ] Audit preparation document created

### Technical Notes
Security checklist:
- Re-entrancy protection (not needed here but verify)
- Access control properly implemented
- Integer overflow/underflow (Solidity 0.8+ protects)
- Front-running considerations
- Denial of service vectors
- Gas limit considerations

### Related Files
- `contracts/src/VestingContract.sol` (add docs)
- `docs/SECURITY_REVIEW.md` (create)

---

## TICKET-060: Deploy to Testnet (Base Sepolia)

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-051, TICKET-056, TICKET-059

### Description
Deploy VestingContract to Base Sepolia testnet for integration testing with backend.

### Definition of Done
- [ ] Deployment script completed
- [ ] Contract deployed to Base Sepolia
- [ ] Contract verified on Basescan
- [ ] Contract address saved to environment
- [ ] Constructor parameters documented
- [ ] Deployment transaction recorded
- [ ] Foundation wallet configured

### Technical Notes
```typescript
// Deploy script
const VestingContract = await ethers.getContractFactory("VestingContract");
const vesting = await VestingContract.deploy(
  cstakeTokenAddress,
  foundationWalletAddress
);
await vesting.deployed();
```

### Related Files
- `contracts/scripts/deploy.ts` (create)
- `.env.example` (add contract addresses)
- `docs/DEPLOYMENT.md` (document)

---

## TICKET-061: UUID to uint256 Conversion Utility

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-004

### Description
Create utility function to convert proposal UUID from database to uint256 for smart contract.

### Definition of Done
- [ ] Conversion function implemented
- [ ] Deterministic and reversible
- [ ] No collisions for different UUIDs
- [ ] TypeScript and Solidity versions match
- [ ] Unit tests for conversion
- [ ] Documentation of conversion method

### Technical Notes
Reference MVP_FEATURES.md line 402: "Convert UUID proposal ID to uint256 (e.g., using keccak256 hash of UUID string)"

```typescript
import { keccak256, toUtf8Bytes } from 'ethers';

export function uuidToUint256(uuid: string): bigint {
  const hash = keccak256(toUtf8Bytes(uuid));
  return BigInt(hash);
}
```

### Related Files
- `src/lib/contracts/utils.ts` (create)
- `contracts/test/utils.test.ts` (create tests)

---

## TICKET-062: Backend Contract Interaction Service

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** L (1-2d)  
**Dependencies:** TICKET-060, TICKET-061

### Description
Create backend service to interact with VestingContract using foundation wallet.

### Definition of Done
- [ ] Contract interaction service created
- [ ] Foundation wallet configured securely
- [ ] RPC provider configured
- [ ] Functions to call each contract method
- [ ] Transaction signing implemented
- [ ] Gas estimation implemented
- [ ] Error handling for failed transactions
- [ ] Transaction receipt logging

### Technical Notes
```typescript
// src/lib/contracts/vestingService.ts
export class VestingService {
  async createAgreement(proposalId, contributor, amount)
  async releaseAgreement(proposalId)
  async getAgreement(proposalId)
}
```

Store foundation wallet private key securely in environment (never commit).

### Related Files
- `src/lib/contracts/vestingService.ts` (create)
- `src/lib/contracts/config.ts` (create)

---

## TICKET-063: API POST /api/contracts/create-agreement

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-046, TICKET-062

### Description
Create API endpoint to trigger smart contract agreement creation after pioneer accepts proposal.

### Definition of Done
- [ ] Route handler implemented
- [ ] Triggered automatically when status becomes 'pioneer_approved'
- [ ] Converts UUID to uint256
- [ ] Calculates agreed amount (offer or requested)
- [ ] Calls vestingService.createAgreement()
- [ ] Updates proposal status to 'work_in_progress'
- [ ] Stores contract transaction hash
- [ ] Error handling for contract failures

### Technical Notes
Reference MVP_FEATURES.md line 399-406 for specification.

This should be called internally from TICKET-046 (respond endpoint) when pioneer accepts.

### Related Files
- `src/app/api/contracts/create-agreement/route.ts` (create)
- `src/app/api/proposals/respond/[id]/route.ts` (update to call this)

---

## TICKET-064: API POST /api/contracts/confirm-work/:id

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-062, TICKET-063

### Description
Create API endpoint for pioneers to confirm their work is complete via smart contract.

### Definition of Done
- [ ] Route handler implemented
- [ ] Authentication (must be proposal creator)
- [ ] Validates proposal status is 'work_in_progress'
- [ ] Calls vestingService.confirmWorkDone()
- [ ] Updates proposal metadata (confirmation timestamp)
- [ ] Returns success with next steps message
- [ ] Error handling

### Technical Notes
Reference MVP_FEATURES.md line 414-417 for specification.

### Related Files
- `src/app/api/contracts/confirm-work/[id]/route.ts` (create)

---

## TICKET-065: API POST /api/contracts/release-agreement/:id

**Epic:** EPIC-004  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-062, TICKET-064

### Description
Create API endpoint for admins to release tokens after reviewing completed work.

### Definition of Done
- [ ] Route handler implemented
- [ ] Admin authentication required
- [ ] Validates pioneer has confirmed
- [ ] Calls vestingService.releaseAgreement()
- [ ] Updates proposal status to 'completed'
- [ ] Records completion timestamp
- [ ] Success notification
- [ ] Error handling

### Technical Notes
Reference MVP_FEATURES.md line 419-422 for specification.

### Related Files
- `src/app/api/contracts/release-agreement/[id]/route.ts` (create)

---

# EPIC-005: MVP-005 - Co-Owner Dashboard

**Goal:** Show pioneers their $CSTAKE balance with USD value and proposal status  
**Status:** ⚪ Todo  
**Tickets:** 10  
**Estimated Time:** 3-4 days

---

## TICKET-066: Wallet Balance Reading (ThirdWeb/Wagmi)

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-007

### Description
Implement wallet balance reading using ThirdWeb SDK to display user's $CSTAKE token balance.

### Definition of Done
- [ ] useTokenBalance hook implemented
- [ ] $CSTAKE token address configured
- [ ] Balance fetched automatically on wallet connection
- [ ] Balance updates on transaction
- [ ] Formatted display (with decimals)
- [ ] Loading and error states
- [ ] Works on Base chain

### Technical Notes
```typescript
import { useReadContract } from "thirdweb/react";

const { data: balance } = useReadContract({
  contract: cstakeContract,
  method: "balanceOf",
  params: [address],
});
```

### Related Files
- `src/hooks/useTokenBalance.ts` (create)
- `src/lib/contracts/cstake.ts` (create config)

---

## TICKET-067: Price Fetching Service (DEX Pool Query)

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** L (1-2d)  
**Dependencies:** None

### Description
Implement backend service to fetch $CSTAKE token price from Uniswap pool with caching.

### Definition of Done
- [ ] DEX pool contract interaction implemented
- [ ] Price calculation from reserves
- [ ] Works with Uniswap V2 or V3
- [ ] Error handling for missing pool
- [ ] Fallback to zero if pool doesn't exist
- [ ] Price service class created
- [ ] Unit tests for price calculation

### Technical Notes
Reference MVP_FEATURES.md line 521-551 for implementation example.

Key considerations:
- Query reserves from Uniswap pool
- Calculate price ratio
- Handle token decimal places
- Convert to USD if paired with stablecoin

### Related Files
- `src/lib/price/priceService.ts` (create)
- `src/lib/contracts/uniswap.ts` (create)

---

## TICKET-068: API GET /api/cstake-price Endpoint

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P0 (Critical)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-067, TICKET-069

### Description
Create public API endpoint to serve current $CSTAKE token price with caching.

### Definition of Done
- [ ] Route handler implemented
- [ ] Calls price service
- [ ] Returns cached price if available
- [ ] Cache duration: 60 seconds
- [ ] Response includes timestamp
- [ ] Response includes currency (USD)
- [ ] Error handling for price fetch failures

### Technical Notes
Reference MVP_FEATURES.md line 486-489 for specification.

Response format:
```json
{
  "price": 1.23,
  "currency": "USD",
  "timestamp": "2025-11-09T12:34:56Z"
}
```

### Related Files
- `src/app/api/cstake-price/route.ts` (create)

---

## TICKET-069: Price Caching Implementation

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-067

### Description
Implement server-side caching for token price to avoid excessive RPC calls and rate limiting.

### Definition of Done
- [ ] In-memory cache implemented
- [ ] Cache TTL: 60 seconds
- [ ] Cache invalidation on TTL expire
- [ ] Thread-safe cache access
- [ ] Cache miss triggers new fetch
- [ ] Cache hit returns immediately
- [ ] Optional: Redis cache for distributed setup

### Technical Notes
Reference MVP_FEATURES.md line 523-526 for caching requirements.

Simple in-memory cache for MVP:
```typescript
let cachedPrice: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 60 seconds
```

### Related Files
- `src/lib/price/cache.ts` (create)
- `src/lib/price/priceService.ts` (update)

---

## TICKET-070: WalletModule Component

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-066, TICKET-068

### Description
Create WalletModule component to display user's $CSTAKE balance, price, and USD value.

### Definition of Done
- [ ] Component displays balance from wallet
- [ ] Component displays current price
- [ ] Component calculates and displays USD value
- [ ] Loading states while fetching data
- [ ] Error states for fetch failures
- [ ] Updates in real-time
- [ ] Styled consistently with design system
- [ ] Mobile responsive

### Technical Notes
Reference MVP_FEATURES.md line 503-509 for component structure.

Shows:
- $CSTAKE balance (formatted)
- Current price ($X.XX)
- Total USD value (balance * price)

### Related Files
- `src/components/dashboard/WalletModule.tsx` (create)
- `src/app/cofounder-dashboard/page.tsx` (integrate)

---

## TICKET-071: ProposalsModule Component Enhancement

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-033

### Description
Enhance ProposalsModule to display user's proposals with status and actions.

### Definition of Done
- [ ] Component fetches proposals from API
- [ ] Displays all user proposals
- [ ] Shows status with color coding
- [ ] Shows agreed/requested amount
- [ ] Action required badge for pending actions
- [ ] Click to view detail
- [ ] Loading and empty states
- [ ] Updates on proposal changes

### Technical Notes
Reference MVP_FEATURES.md line 510-512 for component structure.

### Related Files
- `src/components/dashboard/ProposalsModule.tsx` (create/update)
- `src/components/cofounder/MyContributionsTab.tsx` (reuse)

---

## TICKET-072: My Proposals Data Fetching

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** S (2-4h)  
**Dependencies:** TICKET-033, TICKET-071

### Description
Implement data fetching logic for user's proposals with React Query for caching and updates.

### Definition of Done
- [ ] React Query hook created
- [ ] Fetches from /api/proposals/me
- [ ] Automatic refetching on interval
- [ ] Manual refetch on user action
- [ ] Optimistic updates on mutations
- [ ] Cache invalidation strategy
- [ ] Error and loading states

### Technical Notes
```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['proposals', 'me'],
  queryFn: () => fetch('/api/proposals/me').then(r => r.json()),
  refetchInterval: 30000, // 30 seconds
});
```

### Related Files
- `src/hooks/useMyProposals.ts` (create)
- `src/app/cofounder-dashboard/page.tsx` (use hook)

---

## TICKET-073: Context-Sensitive Actions (Confirm Work)

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P1 (High)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-064, TICKET-071

### Description
Implement context-sensitive action buttons in dashboard based on proposal status.

### Definition of Done
- [ ] "Work Completed" button shown for work_in_progress proposals
- [ ] Button calls confirm-work API endpoint
- [ ] Confirmation modal before submitting
- [ ] Explains what happens next (admin review)
- [ ] Success notification
- [ ] Proposal status updated in UI
- [ ] Error handling

### Technical Notes
Reference MVP_FEATURES.md line 513-514 for AC3 specification.

### Related Files
- `src/components/dashboard/ActionsModule.tsx` (create)
- `src/app/cofounder-dashboard/page.tsx` (integrate)

---

## TICKET-074: Real-Time Updates with React Query/SWR

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-072

### Description
Implement automatic data refetching and real-time updates for dashboard using React Query.

### Definition of Done
- [ ] React Query configured globally
- [ ] All data queries use React Query
- [ ] Automatic refetching on window focus
- [ ] Automatic refetching on reconnect
- [ ] Optimistic updates on mutations
- [ ] Cache invalidation on mutations
- [ ] Stale-while-revalidate pattern
- [ ] Loading states minimized

### Technical Notes
```typescript
// src/app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: true,
    },
  },
});
```

### Related Files
- `src/app/providers.tsx` (update)
- `package.json` (add @tanstack/react-query)

---

## TICKET-075: Dashboard Integration Testing

**Epic:** EPIC-005  
**Status:** ⚪ Todo  
**Priority:** P2 (Medium)  
**Estimated Time:** M (4-8h)  
**Dependencies:** TICKET-070, TICKET-071, TICKET-073

### Description
End-to-end testing of complete dashboard functionality with all integrated components.

### Definition of Done
- [ ] E2E tests for wallet connection
- [ ] E2E tests for balance display
- [ ] E2E tests for proposal listing
- [ ] E2E tests for work confirmation
- [ ] Tests run in CI/CD
- [ ] All tests passing
- [ ] Test coverage report generated
- [ ] Mobile responsive tests

### Technical Notes
Use Playwright for E2E tests:
```typescript
test('displays wallet balance and proposals', async ({ page }) => {
  // Connect wallet
  // Verify balance shown
  // Verify proposals listed
});
```

### Related Files
- `tests/e2e/dashboard.spec.ts` (create)
- `playwright.config.ts` (update)

---

# Implementation Order

**Based on dependencies, implement tickets in this order:**

## Phase 1: Foundation (Week 1)
**Goal:** Infrastructure ready for development

1. TICKET-001: Environment Setup
2. TICKET-002: Supabase Project Setup
3. TICKET-003: Database Schema Design
4. TICKET-004: Create proposals Table
5. TICKET-005: Create users Table
6. TICKET-008: API Route Structure
7. TICKET-011: Error Handling Utilities
8. TICKET-012: API Response Standardization

## Phase 2: Authentication (Week 1-2)
**Goal:** Users can authenticate with wallets

9. TICKET-006: SIWE Authentication
10. TICKET-007: ThirdWeb Wallet Connection
11. TICKET-009: Authentication Middleware
12. TICKET-010: Admin Authorization
13. TICKET-017: Connect "Make a Proposal" to Auth
14. TICKET-018: Wallet Connection Prompt

## Phase 3: Proposal Submission (Week 2)
**Goal:** Co-founders can submit proposals

15. TICKET-024: Create /dashboard/propose Route
16. TICKET-025: Proposal Form UI
17. TICKET-026: Markdown Editor Integration
18. TICKET-027: Markdown Preview
19. TICKET-028: Client-Side Validation
20. TICKET-029: API POST /api/proposals
21. TICKET-030: Server-Side Validation
22. TICKET-031: Wallet Signature Verification
23. TICKET-032: Save Proposal to Database
24. TICKET-033: API GET /api/proposals/me
25. TICKET-034: Success Redirect
26. TICKET-035: Error Handling

## Phase 4: Admin Review (Week 2-3)
**Goal:** Admins can review and respond to proposals

27. TICKET-036: Status State Machine
28. TICKET-037: Create /admin/proposals Route
29. TICKET-038: Admin Authentication Check
30. TICKET-039: API GET /api/proposals/admin
31. TICKET-040: Admin Panel UI
32. TICKET-041: Proposal Detail View
33. TICKET-042: API PUT /api/proposals/admin/:id
34. TICKET-043: Reject Action
35. TICKET-044: Counter-Offer Action
36. TICKET-045: Accept Action
37. TICKET-049: Audit Trail Logging

## Phase 5: Pioneer Response (Week 3)
**Goal:** Pioneers can respond to admin actions

38. TICKET-046: API PUT /api/proposals/respond/:id
39. TICKET-047: Pioneer Response UI
40. TICKET-048: Pioneer Accept/Reject Logic

## Phase 6: Smart Contracts (Week 3-4)
**Goal:** Escrow and token release automated

41. TICKET-050: Hardhat Setup
42. TICKET-052: OpenZeppelin Dependencies
43. TICKET-051: VestingContract.sol Implementation
44. TICKET-053: createAgreement Function
45. TICKET-054: confirmWorkDone Function
46. TICKET-055: releaseAgreement Function
47. TICKET-056: Unit Tests
48. TICKET-057: Integration Tests
49. TICKET-059: Security Audit Prep
50. TICKET-060: Deploy to Testnet
51. TICKET-061: UUID Conversion Utility
52. TICKET-062: Backend Contract Service
53. TICKET-063: API Create Agreement
54. TICKET-064: API Confirm Work
55. TICKET-065: API Release Agreement

## Phase 7: Dashboard Enhancement (Week 4-5)
**Goal:** Rich dashboard with balance and proposals

56. TICKET-066: Wallet Balance Reading
57. TICKET-067: Price Fetching Service
58. TICKET-068: API GET /api/cstake-price
59. TICKET-069: Price Caching
60. TICKET-070: WalletModule Component
61. TICKET-071: ProposalsModule Enhancement
62. TICKET-072: My Proposals Data Fetching
63. TICKET-073: Context-Sensitive Actions
64. TICKET-074: Real-Time Updates

## Phase 8: Polish & Launch Prep (Week 5)
**Goal:** Production ready

65. TICKET-016: Homepage CTA Routing
66. TICKET-019: Whitepaper Link
67. TICKET-020: Areas of Need Section
68. TICKET-021: Hero Section Optimization
69. TICKET-022: Mobile Responsiveness
70. TICKET-013: Rate Limiting
71. TICKET-014: CORS Configuration
72. TICKET-015: Logging & Monitoring
73. TICKET-023: Analytics Integration
74. TICKET-058: Gas Optimization (optional)
75. TICKET-075: Dashboard Integration Testing

---

# Testing Strategy

## Unit Testing
- **Backend:** All API endpoints with mocked dependencies
- **Frontend:** Components with React Testing Library
- **Smart Contracts:** Comprehensive Hardhat tests
- **Utilities:** All helper functions and utilities

## Integration Testing
- **API Integration:** Test complete request/response cycles
- **Database Integration:** Test actual Supabase operations
- **Contract Integration:** Test contract calls from backend

## End-to-End Testing
- **User Flows:** Playwright tests for complete user journeys
  - Founder: Create mission -> Review proposal -> Accept -> Release tokens
  - Co-founder: Submit proposal -> Accept counter-offer -> Complete work
- **Cross-Browser:** Chrome, Safari, Firefox
- **Mobile:** Responsive tests on mobile viewports

## Security Testing
- **Smart Contract:** Slither, Mythril static analysis
- **API:** OWASP Top 10 vulnerability checks
- **Authentication:** Token validation, session management

---

# Deployment Checklist

## Pre-Deployment
- [ ] All P0 and P1 tickets completed
- [ ] All tests passing (unit, integration, E2E)
- [ ] Smart contract deployed to mainnet (Base)
- [ ] Smart contract verified on Basescan
- [ ] Environment variables configured in production
- [ ] Database migrations applied to production
- [ ] Foundation wallet funded with $CSTAKE tokens
- [ ] RLS policies enabled on all tables

## Deployment
- [ ] Deploy to DigitalOcean App Platform (automatic via GitHub)
- [ ] Verify deployment successful
- [ ] Run smoke tests on production
- [ ] Test wallet connection on production
- [ ] Test proposal submission end-to-end
- [ ] Verify smart contract interactions work

## Post-Deployment
- [ ] Monitor error logs for issues
- [ ] Monitor smart contract events
- [ ] Set up alerting for critical errors
- [ ] Document known limitations
- [ ] Create user guides
- [ ] Announce launch to community

---

# Post-MVP Backlog

**Features to implement after MVP launch (from USERFLOW.md gaps):**

## High Priority Post-MVP
1. **Work Tracking System** - Track progress on accepted proposals
2. **Notification System** - Email/push notifications for proposal status changes
3. **Search & Filters** - Search missions by skill, status, token amount
4. **Mobile App** - Native mobile experience
5. **Multi-Signature Admin** - Require multiple admins to approve proposals

## Medium Priority Post-MVP
6. **Portfolio Tab** - Co-founder portfolio of completed work
7. **Governance Tab** - Token-weighted voting on proposals
8. **Project Analytics** - Charts and metrics for founders
9. **User Profiles** - Public profiles for co-founders
10. **Reputation System** - Track successful completions

## Low Priority Post-MVP
11. **IPFS Integration** - Store proposal attachments on IPFS
12. **Multi-Chain Support** - Deploy to multiple EVM chains
13. **Dispute Resolution** - Formal process for disagreements
14. **Automated Mediator** - AI-powered proposal evaluation
15. **Token Staking** - Stake tokens for governance power

---

**End of Tickets Document**

*This is a living document. Update as tickets are completed or requirements change.*

