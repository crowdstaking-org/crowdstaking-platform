# CrowdStaking MVP - Feature Specifications

**Development Reference Document**

This document contains all feature specifications for the CrowdStaking MVP. Each feature follows a structured format to ensure clear implementation guidelines.

---

## Format Template

Each feature follows this structure:

- **Feature-ID**: Unique identifier
- **Feature-Name**: Clear, descriptive name
- **Context & Goal (The "Why")**: Strategic context and purpose
- **User Story (The "What")**: "As [Persona] I want [Action] so that [Benefit]"
- **Acceptance Criteria (ACs) (The "Target")**: GIVEN/WHEN/THEN scenarios
- **Technical Specifications (The "How")**: Stack, data models, APIs, contracts
- **AI Notes**: Special implementation considerations

---

## MVP-001: Das "Missions-Board" (Der Leuchtturm)

### Feature-ID
MVP-001

### Feature-Name
Das "Missions-Board" (Der Leuchtturm)

### Context & Goal (The "Why")
This is the "lighthouse" of the platform. It's the first page a pioneer sees. It must clearly communicate the "Mission" (building CrowdStaking) and prominently place the single Call-to-Action (CTA) "Make a Proposal".

### User Story (The "What")
"As a potential pioneer, I want to immediately understand the CrowdStaking vision on the homepage and see which areas need help, so that I am motivated to submit a proposal."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Homepage Display**
- **GIVEN** I open the main URL (homepage)
- **WHEN** the page loads
- **THEN** I see:
  1. A clear headline (e.g., "We're building the machine that builds ideas. Decentrally." [cf. Vision 2, 75])
  2. A link to the "Investment Memo / Whitepaper" (your v3.0 file)
  3. An "Areas of Need" section (mission goals) that is NOT a task list (e.g., "Goal 1: Decentralization of Mediation", "Goal 2: Scaling Projects")
  4. A single, very prominent CTA button with text "Make a Proposal"

**AC2: CTA Navigation**
- **GIVEN** I click the "Make a Proposal" button
- **WHEN** I am not connected with a wallet
- **THEN** I am redirected to the "Co-Owner Dashboard" (Feature MVP-005) where I'm prompted to connect my wallet

### Technical Specifications (The "How")

**Stack:**
- Frontend: Next.js / React

**Data Model (Schema):**
- None. This page is static or hardcoded.
- "Areas of Need" can be stored as a simple JSON array in the code.

**API Endpoints:**
- None

**Routes:**
- `/` - Homepage
- CTA button links to `/dashboard/propose`

### AI Notes
- This is a marketing and motivation page. Text is more important than complex logic.
- Use clear, professional, and minimalist design.
- The CTA button (`/dashboard/propose`) must be the visually most dominant element.
- Consider hero section with compelling copy aligned with Vision document.
- Ensure mobile responsiveness.

---

## MVP-002: Die "Vorschlags-Engine" (Der Input-Kanal)

### Feature-ID
MVP-002

### Feature-Name
Die "Vorschlags-Engine" (Der Input-Kanal)

### Context & Goal (The "Why")
This is the "permissionless" input channel [cf. Vision §2-3]. Hier reichen Pioniere eigeninitiierte Partner-Vorschläge ein – entweder rein operativ (Proof-of-Work) oder als Kapital-Partner (Proof-of-Capital + Governance). Jeder Vorschlag muss eindeutig festhalten, welchen Partneranteil (SBT) der Contributor beantragt und ob Open-Banking-Nachweise (Oracle) erforderlich sind.

### User Story (The "What")
"As a connected pioneer, I want to submit my proposal (idea, deliverable, and requested partner share %) to the foundation."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Proposal Form Display**
- **GIVEN** I am on the dashboard and have connected my wallet
- **WHEN** I click "Make a Proposal" (e.g., `/dashboard/propose`)
- **THEN** I see a form with the following fields:
  1. Title (text, max 100 chars)
  2. Mission Impact Description (Markdown textarea, "How does this advance the posted mission?")
  3. Deliverable Definition (Markdown textarea, "What tangible outcome will exist?")
  4. Requested Partner Share (%) – numeric slider/field (0.1–10%) with helper copy "Shares are soulbound; no resale"
  5. Contribution Type (radio):
     - `work` (default)
     - `capital`
  6. (Conditional for `capital`) Capital Amount (USDC) + Intended Use (textarea)
  7. Proof Inputs:
     - Links to past work OR banking statement reference if offline revenue is involved
     - Checkbox `requires_offchain_oracle` (triggers compliance flow)

**AC2: Proposal Submission**
- **GIVEN** the contributor completes required fields
- **WHEN** they click "Submit Proposal"
- **THEN** the backend stores:
  - wallet address verified via SIWE
  - requested_partner_share_percent
  - contribution_type
  - capital_amount_usdc (nullable)
  - requires_offchain_oracle boolean
  - status `pending_review`
- **AND** they see the proposal inside MVP-005 with clear badge (`Work Proposal` or `Capital Proposal`)

**AC3: Validation & Messaging**
- Partner share must be between 0.1% and 10%
- Capital proposals must include a capital amount >= 1000 USDC and intended use
- If `requires_offchain_oracle` is checked, the UI shows a banner explaining the Open-Banking oracle & honesty-bond requirement (links to docs)

### Technical Specifications (The "How")

**Stack:**
- Frontend: React
- Backend: Supabase, Firebase, or Node.js/Postgres

**Data Model (Schema):**

Create / extend the `proposals` table:

```sql
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  creator_wallet_address TEXT NOT NULL,
  title TEXT NOT NULL,
  mission_impact TEXT NOT NULL,
  deliverable TEXT NOT NULL,
  requested_partner_share_percent NUMERIC NOT NULL CHECK (requested_partner_share_percent > 0 AND requested_partner_share_percent <= 10),
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('work','capital')),
  capital_amount_usdc NUMERIC,
  capital_intended_use TEXT,
  requires_offchain_oracle BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending_review',
  foundation_offer_share_percent NUMERIC,
  foundation_offer_capital_usdc NUMERIC,
  foundation_notes TEXT
);
```

**API Endpoints:**

- `POST /api/proposals`
  - Accepts form data
  - Performs SIWE signature verification
  - Validates partner share % rules + capital constraints
  - Flags `requires_offchain_oracle` proposals for compliance review
  - Saves proposal to `proposals` table
  - Returns created record with derived fields (e.g., `proposal_reference_code`)

**Routes:**
- `/dashboard/propose` - Proposal submission form

### AI Notes
- Implement server-side validation for all fields.
- The `creator_wallet_address` must NOT come from the form but must be extracted from the authenticated session/signature on the server.
- Use proper wallet authentication (e.g., Sign-In with Ethereum, SIWE).
- Implement markdown preview for description and deliverable fields.
- Add client-side validation for UX but always validate server-side.

---

## MVP-003: Der "Manuelle-Mediator & Doppelte Handschlag" (Das Kernstück)

### Feature-ID
MVP-003

### Feature-Name
Der "Manuelle-Mediator & Doppelte Handschlag" (Das Kernstück)

### Context & Goal (The "Why")
This is the "Wizard of Oz" part [cf. Vision 3]. Die Stiftung agiert als menschlicher Mediator bis die vollautomatische KI-Version live ist. Hier entsteht der doppelte Handschlag: Admins prüfen, ob der beantragte Partneranteil (Proof-of-Work oder Kapital) sowie ggf. Open-Banking-Nachweise korrekt sind, bevor der SBT gemintet und der Dividendenvault getriggert wird.

### User Story (Admin)
"As a foundation admin, I want to see all proposals with status `pending_review` in a protected area and react to them (reject, make counter-offer, or accept)."

### User Story (Pioneer)
"As a pioneer, I want to see the feedback/counter-offer from the foundation in my dashboard and react to it (accept or reject)."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Admin Actions**
- **GIVEN** an admin is in the panel
- **WHEN** they open a proposal with status `pending_review`
- **THEN** they can:
  1. **Reject** – add `foundation_notes`, set status `rejected`.
  2. **Counter Offer** – edit `foundation_offer_share_percent` (and `foundation_offer_capital_usdc` if contribution type `capital`), add reasoning, set status `counter_offer_pending`.
  3. **Accept** – confirm the requested partner share (and capital) as-is, set status `foundation_approved`.

**AC2: Capital Compliance Hook**
- **GIVEN** a proposal is of type `capital` or `requires_offchain_oracle == true`
- **WHEN** an admin attempts to accept it
- **THEN** the UI forces entry of:
  - Honesty bond amount (USDC) that will be locked until oracle confirms deposits
  - Open-Banking provider selection + account reference
  - Target vault (capital vs gain vault)
- **AND** the status moves to `foundation_approved` only after compliance metadata is stored.

**AC3: Pioneer Response to Counter-Offer**
- **GIVEN** a pioneer views a proposal with `counter_offer_pending`
- **WHEN** they open details
- **THEN** they see the counter share %, optional capital amount, and governance note. They may:
  1. Reject – status `rejected`
  2. Accept – status `pioneer_approved` which triggers MVP-004 (vault allocation + SBT mint preparation)

**AC4: Pioneer Acceptance of Foundation Approval**
- **GIVEN** a proposal status is `foundation_approved`
- **WHEN** the pioneer clicks "Accept & Start"
- **THEN** status becomes `pioneer_approved`, storing timestamp + wallet signature and triggering MVP-004.

### Technical Specifications (The "How")

**Stack:**
- Backend: API logic
- Frontend: Admin UI & Pioneer UI

**Data Model (Schema):**
- Uses the extended `proposals` table (see MVP-002)
- Additional columns:
  - `compliance_metadata JSONB` (oracle provider, honesty bond amount, bank_account_reference)
  - `status_history` (optional table) for traceability

**Status State Machine:**
```
pending_review 
  ├→ rejected (by admin)
  ├→ counter_offer_pending (by admin)
  └→ foundation_approved (by admin)

counter_offer_pending
  ├→ rejected (by pioneer)
  └→ pioneer_approved (by pioneer) → triggers MVP-004

foundation_approved
  └→ pioneer_approved (by pioneer) → triggers MVP-004

pioneer_approved
  └→ work_in_progress (after smart contract agreement created)

work_in_progress
  └→ completed (after both parties confirm)
```

**API Endpoints:**

- `GET /api/proposals/admin` – unchanged
- `PUT /api/proposals/admin/:id`
  - Body:
    ```json
    {
      "action": "reject" | "counter_offer" | "accept",
      "foundation_offer_share_percent": number,
      "foundation_offer_capital_usdc": number,
      "honesty_bond_usdc": number,
      "oracle_provider": "tink" | "finicity" | null,
      "bank_account_reference": "string",
      "foundation_notes": "string"
    }
    ```
  - Validations enforce honesty bond + oracle fields when `requires_offchain_oracle == true` or contribution_type `capital`.
- `PUT /api/proposals/respond/:id`
  - Pioneer-only (must match `creator_wallet_address`)
  - Body: `{ "action": "accept" | "reject" }`
  - Accept triggers:
    - `pioneer_signature` capture (SIWE)
    - Status `pioneer_approved`
    - Event for MVP-004: `{ proposal_id, partner_share_percent, contribution_type, capital_amount_usdc, requires_offchain_oracle }`

**Routes:**
- `/admin/proposals` - Admin panel
- `/dashboard/proposals/:id` - Proposal detail view for pioneer

### AI Notes
- State-machine enforcement is mandatory; encode allowed transitions in a shared module.
- All share percentages must be rounded to 2 decimals before storage to avoid drift between UI and vault calculations.
- When `requires_offchain_oracle` is true, automatically spawn a compliance task (queue) that pings the oracle microservice; MVP-004 must wait for that task before releasing dividends.
- Log `pioneer_signature` hash for audit; never store raw SIWE message beyond retention policy.

---

## MVP-004: Der "Dividend Vault & SBT Mint" Contract (Die Treuhand-Bank)

### Feature-ID
MVP-004

### Feature-Name
Der "Dividend Vault & SBT Mint" Contract (Die Treuhand-Bank)

### Context & Goal (The "Why")
Nach dem doppelten Handschlag existiert ein rechtsverbindlicher Partneranteil. MVP-004 automatisiert:
1. Registrierung des Anteils inkl. SBT
2. Zuordnung zu Dividendenvault(s) (Gewinn- und Kapitaltranche)
3. Aktivierung nach Work-Delivery oder Kapital-Deposit
4. claim()-Schnittstelle für Ausschüttungen [cf. Vision §5].

### User Story (System)
"As a system, I want to mint a partner SBT and register the share inside the dividend vault the moment `pioneer_approved` fires."

### User Story (Pioneer & Foundation)
"As a pioneer or capital partner, I want to confirm delivery/deposit so my share becomes active and I can claim dividends whenever the DAO decides to distribute."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Partner Share Registration**
- **GIVEN** status `pioneer_approved`
- **WHEN** backend worker runs
- **THEN** it:
  - Calls `registerPartnerShare(project_id, proposal_id, contributor, share_percent, contribution_type, requires_oracle)`
  - Calls `mintPartnerSBT(contributor, proposal_id, share_percent, contribution_type)`
  - Persists vault references + tx hashes to DB

**AC2: Work Contribution Activation**
- **GIVEN** contribution_type `work`
- **WHEN** pioneer presses "Work Completed" and foundation confirms
- **THEN** backend signs `markWorkDelivered(proposal_id)` which flips share status to `active` and sets proposal DB status `work_in_progress` → `completed`.

**AC3: Capital Contribution Activation**
- **GIVEN** contribution_type `capital`
- **WHEN** oracle microservice confirms deposit (or on-chain transfer arrives)
- **THEN** backend calls `activateCapitalShare(proposal_id, capital_amount_usdc, oracle_proof_hash)`:
  - Honesty bond escrow is released/redistributed according to compliance outcome
  - Share transitions from `pending_capital` to `active`

**AC4: Dividend Claim Interface**
- **GIVEN** DAO votes to distribute profits
- **WHEN** contributor calls `claim(proposal_id)`
- **THEN** vault calculates `payout = share_percent * distributable_amount`, transfers USDC, emits `DividendClaimed`, and backend logs the claim.

### Technical Specifications (The "How")

**Stack:**
- Smart Contracts: PartnerSBT (ERC-5192 style) + DividendVaultRegistry (custom)
- Backend: Secure signer service triggered by queue after MVP-003 events + oracle callbacks

**Key Contract Interfaces:**

```solidity
enum ContributionType { Work, Capital }

interface IPartnerSBT {
  function mintPartnerSBT(
    address contributor,
    uint256 proposalId,
    uint256 sharePercentBps,
    ContributionType cType
  ) external;
}

interface IDividendVaultRegistry {
  function registerPartnerShare(
    uint256 projectId,
    uint256 proposalId,
    address contributor,
    uint256 sharePercentBps,
    ContributionType cType,
    bool requiresOracle
  ) external returns (address dividendVault);

  function markWorkDelivered(uint256 proposalId, address confirmer) external;

  function activateCapitalShare(
    uint256 proposalId,
    uint256 capitalAmountUsdc,
    bytes32 oracleEvidenceHash
  ) external;
}

interface IDividendVault {
  function claim(uint256 proposalId, address claimer) external returns (uint256 payout);
}
```

**Backend Flow:**
1. `pioneer_approved` event enqueues `RegisterPartnerShareJob`.
2. Worker fetches agreement data, signs `registerPartnerShare` + `mintPartnerSBT`.
3. Pioneer clicks "Work Completed" → API `POST /api/partners/work-complete/:id` triggers `markWorkDelivered`.
4. Oracle service posts to `/api/oracle/capital-confirmation` which signs `activateCapitalShare`.
5. Distribution cycle (future feature) calls `vault.distribute(amount)`; partners call `claim()` via MVP-005.

**API Endpoints:**
- `POST /api/contracts/register-partner-share` (internal queue consumer)
- `POST /api/proposals/confirm-work/:id` (pioneer) → triggers `markWorkDelivered`
- `POST /api/proposals/approve-work/:id` (admin) → batch job to set DB + call registry if both confirmed
- `POST /api/oracle/capital-confirmation` (signed webhook) → triggers `activateCapitalShare`
- `POST /api/dividends/claim/:proposalId` (pioneer) → wraps vault `claim` call and returns receipt

### AI Notes
- Map UUID → uint256 via `uint256(keccak256(bytes(uuid)))` for contract IDs.
- Use AccessControl roles (`ROLE_REGISTER`, `ROLE_VAULT`) instead of single owner to support multi-sig foundation.
- For oracle proofs, store hashed payload on-chain; raw payload stays off-chain but auditable.
- Add pausable + circuit-breaker for vault operations.
- Unit-test SBT non-transferability (ERC-5192) and ensure revocation is impossible once active.

---

## MVP-005: Das "Miteigentümer-Dashboard" (Die Belohnungsschleife)

### Feature-ID
MVP-005

### Feature-Name
Das "Miteigentümer-Dashboard" (Die Belohnungsschleife)

### Context & Goal (The "Why")
Dies ist das Zuhause der Partner. Statt spekulativen Tokenpreisen zeigt das Dashboard Soulbound-Anteile, deren Dividendenvault-Status und alle To-Dos rund um Work- oder Kapital-Beiträge. Es verbindet Governance (Voting/Liquidität) mit Compliance (Oracle, Ehrlichkeits-Bond).

### User Story (The "What")
"As a partner, I want to see all my shares (SBTs), their dividend readiness, outstanding compliance tasks, and be able to confirm work, upload capital proofs, or claim payouts."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Dashboard Display**
- **GIVEN** I connect my wallet
- **WHEN** I load `/dashboard`
- **THEN** I see:

  1. **Module 1: Partner Shares**
     - Table listing each project share (SBT) with columns: Share %, Contribution Type, Status (`pending`, `active`, `claimable`, `needs_oracle`, `on_hold`)
     - Badge if honesty bond/oracle proof outstanding

  2. **Module 2: Dividend Vault**
     - Shows current distributable amount per project (if DAO approved)
     - Claim button is enabled per share when `claimable == true`

  3. **Module 3: Proposals**
     - List from `GET /api/proposals/me`
     - Each entry shows Title, Status, Requested Share %, pending action CTA linking to MVP-003 detail

  4. **Module 4: Tasks**
     - Dynamically surfaces: "Confirm Work Completed", "Upload Capital Proof", "Acknowledge Distribution Vote"

### Technical Specifications (The "How")

**Stack:**
- Frontend: React, Wagmi/Viem for contract reads (SBT + vault)
- Backend: Partner share API, dividend claim handler, oracle status sync

**Data Model (Schema):**
- Uses existing `proposals` table

**API Endpoints:**

- `GET /api/proposals/me`
  - Auth: wallet session
  - Returns proposals with derived fields (`requested_partner_share_percent`, `status`, `pending_action`)

- `GET /api/partners/shares`
  - Auth: wallet session
  - Aggregates on-chain SBT + vault info (share %, activation status, pending claimable amount)

- `POST /api/proposals/confirm-work/:id`
  - Auth: proposal creator
  - Triggers `markWorkDelivered` flow (MVP-004)

- `POST /api/dividends/claim/:proposalId`
  - Auth: partner wallet tied to SBT
  - Wraps vault `claim()` and records payout

**Routes:**
- `/dashboard` - Main dashboard
- `/dashboard/propose` - Create new proposal (from MVP-002)
- `/dashboard/proposals/:id` - Proposal detail view

**Frontend Components:**
- `PartnerSharesModule` – renders SBT cards, status pills, and compliance badges
- `DividendVaultModule` – shows distributable balances + claim buttons
- `ProposalsModule` – proposals list with CTAs (view, respond, upload proof)
- `ActionCenter` – context-sensitive actions (confirm work, upload oracle docs)

**Dividend Sync Implementation:**

```typescript
// Backend: services/dividendService.ts
import { getPartnerShares } from './partnerShareRepo'
import { readVaultState, claimDividend } from './vaultClient'

export async function listPartnerShares(wallet: string) {
  const shares = await getPartnerShares(wallet)
  return Promise.all(
    shares.map(async (share) => {
      const vaultState = await readVaultState(share.proposalId)
      return { ...share, vaultState }
    })
  )
}

export async function claimDividendForShare(wallet: string, proposalId: string) {
  // permission checks omitted for brevity
  const txHash = await claimDividend({ wallet, proposalId })
  await auditLog({ type: 'DIVIDEND_CLAIM', wallet, proposalId, txHash })
  return txHash
}
```

### AI Notes
- Fetch partner shares + vault data server-side; never rely solely on client reads.
- Provide optimistic UI updates for claim() but poll until transaction confirmed.
- Integrate oracle status (capital deposits) by subscribing to queue events; dashboard should show human-readable "Awaiting bank sync (~24h)" states.
- Keep dashboard reactive using React Query/SWR with focus revalidation.
- Enforce wallet wall for `/dashboard`; no data for anonymous visitors.

---

## Implementation Priority & Dependencies

### Phase 1: Foundation
1. **MVP-001** (Missions Board) - No dependencies
2. **MVP-002** (Proposal Engine) - Depends on: Database setup, wallet auth

### Phase 2: Core Logic
3. **MVP-003** (Manual Mediator) - Depends on: MVP-002, admin auth
4. **MVP-004** (Dividend Vault & SBT Mint) - Depends on: MVP-003, PartnerSBT + Vault contracts, Oracle service

### Phase 3: User Experience
5. **MVP-005** (Dashboard) - Depends on: MVP-002, MVP-004, Oracle status feed

### Critical Path
```
Database Setup → Wallet Auth → MVP-002 → MVP-003 → MVP-004
                                   ↓
                              MVP-001 → MVP-005
```

---

## Technical Stack Overview

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Web3**: Wagmi + Viem
- **State Management**: React Query / SWR
- **Forms**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes or Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: SIWE (Sign-In with Ethereum)
- **Web3 Integration**: Ethers.js v6 or Viem

### Smart Contracts
- **Language**: Solidity ^0.8.0
- **Framework**: Hardhat or Foundry
- **Libraries**: OpenZeppelin Contracts
- **Network**: Ethereum Mainnet / Base / Arbitrum (TBD)

### Infrastructure
- **Hosting**: Vercel (frontend), Railway/Render (backend)
- **RPC**: Alchemy or Infura
- **IPFS**: (Future) For proposal attachments

---

## Security Considerations

### High Priority
1. **Wallet Authentication**: Implement SIWE properly
2. **Smart Contract Security**: Audit before mainnet deployment
3. **Admin Panel**: Strong authentication, IP whitelisting
4. **Private Keys**: Never expose foundation wallet keys
5. **Rate Limiting**: Protect all API endpoints
6. **Input Validation**: Server-side validation for all user inputs

### Medium Priority
1. **CORS Configuration**: Proper origin restrictions
2. **SQL Injection Prevention**: Use parameterized queries
3. **XSS Prevention**: Sanitize markdown input/output
4. **CSRF Protection**: Implement tokens for state-changing operations

---

## Testing Strategy

### Smart Contracts
- Unit tests for all functions
- Integration tests for multi-step flows
- Fork testing on mainnet
- Gas optimization tests

### Backend
- API endpoint tests
- Database migration tests
- Authentication flow tests
- Error handling tests

### Frontend
- Component unit tests
- Integration tests for user flows
- E2E tests with Playwright
- Wallet connection tests

---

## Monitoring & Analytics

### Essential Metrics
1. Proposals submitted (count, rate)
2. Proposals accepted vs. rejected (%)
3. Average time from submission to approval
4. Active partner share %
5. Total dividends distributed (USDC)
6. Active pioneers (unique wallets)
7. Smart contract events (creation, confirmation, release)

### Error Tracking
- Frontend: Sentry or similar
- Backend: Application logs + Sentry
- Smart Contracts: Event monitoring + Tenderly

---

*Last Updated: November 2025*
*Version: 1.0.0*

