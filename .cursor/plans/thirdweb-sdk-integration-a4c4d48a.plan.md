<!-- a4c4d48a-bc94-4db7-b095-2a2161e95221 43bccdee-6f7c-4b55-9919-8049e48b8410 -->
# ThirdWeb + User-Flow Integration - Komplett Plan

## 🎯 Mission

**Dual-Goal**:

1. ✅ Web3-Integration via ThirdWeb MCP-API
2. ✅ Schließung der Critical User-Flow-Gaps (USERFLOW.md)

**Current State**: App ist 65% komplett mit major gaps in Core-Flows

**Target State**: 100% funktionale MVP-App mit vollständiger Web3-Integration

---

## 📊 Ticket-Struktur (3 Tracks)

### 🟦 Track A: Web3 Foundation (TW-001 bis TW-007)

Infrastructure für Wallets, Auth, Balance Display

### 🟥 Track B: Core User Flows (TW-019 bis TW-023) **NEU**

Schließung der 🔴 Critical Gaps aus USERFLOW.md

### 🟩 Track C: Web3 Features (TW-008 bis TW-018)

Backend, Contracts, Token-Deployment, Liquidity

---

## 🎫 TRACK A: Web3 Foundation

### **TW-001: Dependencies & Environment Setup**

**Effort**: 30min | **Priority**: 🔴 Critical

- Install `@thirdweb-dev/react`, `@thirdweb-dev/sdk`, `@thirdweb-dev/wallets`
- Create `.env.local` + `.env.example`
- Add ThirdWeb Client ID
- Update README

**DoD**: npm install funktioniert, app startet normal

---

### **TW-002: ThirdWeb Provider Integration**

**Effort**: 1h | **Priority**: 🔴 Critical | **Dep**: TW-001

- Create `src/lib/thirdweb.ts`
- Configure Embedded Wallets (Email/Google/Apple)
- Configure Smart Wallets (Gasless)
- Wrap app in `layout.tsx`

**DoD**: Provider aktiv, keine Errors, ConnectWallet vorbereitet

---

### **TW-003: ConnectWallet in Navigation**

**Effort**: 1h | **Priority**: 🔴 Critical | **Dep**: TW-002

- Replace dummy "Login" button
- Add `ConnectWallet` component
- Configure Email/Social als Primary
- Dark mode support

**DoD**:

- Email-Login funktioniert
- Google-Login funktioniert
- MetaMask als Fallback
- Disconnect funktioniert

**✅ CLOSES GAP**: Authentication System (Gap #3)

---

### **TW-004: useWalletAuth Hook (MCP)**

**Effort**: 1.5h | **Priority**: 🟡 High | **Dep**: TW-003

- Create `src/hooks/useWalletAuth.ts`
- MCP `initiateAuthentication` + `completeAuthentication`
- Auto-detection: Email vs Wallet login
- Session management

**DoD**: Hook funktioniert für Email/Social/Wallet

---

### **TW-005: Protected Routes Middleware**

**Effort**: 1.5h | **Priority**: 🟡 High | **Dep**: TW-004

- Create `src/middleware.ts`
- Protect `/dashboard`, `/wizard`, `/cofounder-dashboard`
- Redirect zu `/` wenn nicht connected
- Toast notifications

**DoD**: Unauthenticated users werden redirected

---

### **TW-006: Multi-Token Balance Display (MCP)**

**Effort**: 1h | **Priority**: 🟡 High | **Dep**: TW-003

- MCP `getWalletTokens` integration
- Display ETH, USDC, $CSTAKE
- USD values inkludiert
- Loading/Error states

**DoD**: Alle Token-Balances + USD-Werte angezeigt

---

### **TW-007: Wallet Info Component**

**Effort**: 1h | **Priority**: 🟢 Medium | **Dep**: TW-006

- Create `WalletInfo.tsx`
- Address (truncated + copy)
- Network display
- Native balance
- Disconnect button

**DoD**: Reusable Wallet-Info component funktional

---

## 🎫 TRACK B: Core User Flows (Critical Gaps) **NEU**

### **TW-019: Proposal Submission Frontend** 🔴 CRITICAL

**Effort**: 3h | **Priority**: 🔴 Critical | **Dep**: TW-005, TW-010

**Closes USERFLOW Gap #1**: Co-founders können keine Proposals einreichen

#### Description

Frontend-Interface für Co-Founders zum Einreichen von Proposals an Founders.

#### Tasks

- [ ] Create `src/app/submit-proposal/page.tsx`
- [ ] Create `src/components/proposal/ProposalForm.tsx`
- [ ] Form fields: Title, Description, Deliverable, Requested Tokens
- [ ] Markdown preview für Description/Deliverable
- [ ] Connect to `/api/proposals` (TW-010)
- [ ] Success screen mit Proposal-ID
- [ ] Add "Submit Proposal" CTA zu `/cofounder-dashboard` Discover tab
- [ ] Add "Submit Proposal" CTA zu `/discover-projects`

#### Definition of Done

- [ ] Form ist accessible via clear CTAs
- [ ] Validation funktioniert (client + server)
- [ ] Submission erfolgt an Backend-API
- [ ] Success/Error handling
- [ ] Wallet-Auth required
- [ ] Mobile responsive

#### Acceptance Criteria

```
Co-founder Journey:
1. Browse missions in /cofounder-dashboard Discover tab
2. Click "Submit Proposal" on a mission
3. Fill form (Title, Description, Deliverable, Tokens)
4. Preview markdown
5. Submit → Backend-API
6. Success: "Proposal submitted! ID: #123"
7. Redirect to My Contributions tab
```

#### Integration Points

- Links von: `/cofounder-dashboard` (Discover Tab), `/discover-projects`
- Backend: `POST /api/proposals` (TW-010)
- Auth: Protected route (TW-005)

#### Files Changed

- `src/app/submit-proposal/page.tsx` (new)
- `src/components/proposal/ProposalForm.tsx` (new)
- `src/components/cofounder/DiscoverTab.tsx` (add CTA)
- `src/components/discover-projects/ProjectCard.tsx` (add CTA)

---

### **TW-020: Proposal Review Integration** 🔴 CRITICAL

**Effort**: 2.5h | **Priority**: 🔴 Critical | **Dep**: TW-010

**Closes USERFLOW Gap #4**: Negotiation System fehlt

#### Description

Verbindung der existierenden `/proposal-review` Seite mit Backend-API für Accept/Reject/Counter-Offer.

#### Tasks

- [ ] Update `src/app/proposal-review/page.tsx`
- [ ] Connect zu `GET /api/proposals/:id`
- [ ] Implement Accept action → `PUT /api/proposals/:id/respond`
- [ ] Implement Reject action → `PUT /api/proposals/:id/respond`
- [ ] Implement Counter-Offer → Modal + API call
- [ ] Show AI recommendation (aus DB)
- [ ] Real-time status updates
- [ ] Navigation: Back to Dashboard nach Action

#### Definition of Done

- [ ] Proposal-Daten werden von API geladen
- [ ] Accept funktioniert → Status: `foundation_approved`
- [ ] Reject funktioniert → Status: `rejected`
- [ ] Counter-Offer funktioniert → Status: `counter_offer_pending`
- [ ] Status-Updates reflektiert in DB
- [ ] Error handling

#### Acceptance Criteria

```
Founder Journey:
1. Dashboard shows "1 New Proposal"
2. Click Proposal → Navigate to /proposal-review?id=123
3. View proposal details (from API)
4. See AI recommendation
5. Three actions available:
   a) Accept → Trigger Double Handshake
   b) Reject → Proposal closed
   c) Counter-Offer → Modal opens, neue Amount eingeben, Submit
6. Success: Status updated, redirect to Dashboard
```

#### Integration Points

- Frontend: `/proposal-review` (existing)
- Backend: `GET /api/proposals/:id`, `PUT /api/proposals/:id/respond` (TW-010)
- Next step: After Accept → TW-021 (Work Tracking)

#### Files Changed

- `src/app/proposal-review/page.tsx` (update)
- `src/components/proposal/Counter OfferModal.tsx` (new)

---

### **TW-021: Work Tracking Interface** 🔴 CRITICAL

**Effort**: 3h | **Priority**: 🔴 Critical | **Dep**: TW-012

**Closes USERFLOW Gap #2**: Nach Double Handshake fehlt Work-Tracking

#### Description

Interface für Co-Founders zum Markieren von "Work Done" und Founders zum Approven.

#### Tasks

- [ ] Update `src/components/cofounder/MyContributionsTab.tsx`
- [ ] Add "Mark Work Complete" button für `work_in_progress` proposals
- [ ] Connect zu Vesting Contract `confirmWorkDone()` (TW-012)
- [ ] Update Founder Dashboard `/dashboard` Proposals Tab
- [ ] Add "Approve Work" button für Founder
- [ ] Connect zu Vesting Contract `releaseAgreement()`
- [ ] Show work status: Pending → In Progress → Submitted → Approved
- [ ] Token transfer notification nach Approval

#### Definition of Done

- [ ] Co-founder kann "Work Complete" markieren
- [ ] Smart Contract wird called (`confirmWorkDone`)
- [ ] Founder sieht "Work submitted, awaiting approval"
- [ ] Founder kann approven
- [ ] Token werden released
- [ ] Status updates in realtime

#### Acceptance Criteria

```
Co-founder Journey:
1. Proposal accepted → Status: work_in_progress
2. Co-founder arbeitet
3. Click "Mark Work Complete"
4. Smart Contract: confirmWorkDone(proposalId)
5. Status: completed, awaiting founder approval
6. Founder sees notification
7. Founder clicks "Approve & Release Tokens"
8. Smart Contract: releaseAgreement(proposalId)
9. Tokens transferred to Co-founder
10. Success notification: "You received 1,000 $PROJECT-X tokens!"
```

#### Integration Points

- Smart Contract: Vesting Contract (TW-012)
- Frontend: `/cofounder-dashboard` My Contributions Tab
- Frontend: `/dashboard` Proposals Tab (Founder)

#### Files Changed

- `src/components/cofounder/MyContributionsTab.tsx` (update)
- `src/components/founder/ProposalsTab.tsx` (update)
- `src/components/proposal/WorkStatus.tsx` (new)

---

### **TW-022: Dashboard Tabs Implementation** 🟡 MEDIUM

**Effort**: 4h | **Priority**: 🟡 High | **Dep**: TW-010

**Closes USERFLOW Gap #8**: Dashboard tabs sind Placeholders

#### Description

Implementations der fehlenden Dashboard Tabs mit echten Daten.

#### Tasks

**Missions Tab** (Founder):

- [ ] List alle Mini-Missions
- [ ] Connect zu `GET /api/missions`
- [ ] Mission status (Active, Completed)
- [ ] Proposal count per Mission

**Proposals Tab** (Founder):

- [ ] List alle Proposals (all statuses)
- [ ] Filter: Pending, Accepted, Rejected
- [ ] Connect zu `GET /api/proposals/all`
- [ ] Quick actions: View, Accept, Reject

**Team Tab** (Founder):

- [ ] List all Co-founders (accepted proposals)
- [ ] Show Token distribution per person
- [ ] Total team size

**Tokenomics Tab** (Founder):

- [ ] Update Pie Chart mit echten Daten
- [ ] Connect zu Token contract
- [ ] Show: Founder %, Community %, Liquidity Pool %
- [ ] Total distributed vs available

**Settings Tab** (Founder):

- [ ] Project name, description editing
- [ ] Token settings display (read-only)
- [ ] DAO fee info

#### Definition of Done

- [ ] Alle 5 Tabs zeigen echte Daten (nicht Placeholders)
- [ ] Data loading von API/Contracts
- [ ] Loading/Error states
- [ ] Mobile responsive

#### Acceptance Criteria

```
Founder clicks each tab:
- Missions: Shows actual missions from DB
- Proposals: Shows actual proposals with filters
- Team: Shows actual co-founders
- Tokenomics: Shows actual token distribution
- Settings: Shows actual project settings
```

#### Files Changed

- `src/components/founder/MissionsTab.tsx` (complete)
- `src/components/founder/ProposalsTab.tsx` (complete)
- `src/components/founder/TeamTab.tsx` (complete)
- `src/components/founder/TokenomicsTab.tsx` (update)
- `src/components/founder/SettingsTab.tsx` (complete)

---

### **TW-023: Liquidity Success Navigation** 🟢 LOW

**Effort**: 15min | **Priority**: 🟢 Low | **Dep**: None

**Closes USERFLOW Gap #9**: Success screen hat keinen Back-Link

#### Tasks

- [ ] Update `src/components/liquidity/LiquiditySuccess.tsx`
- [ ] Add "Back to Dashboard" button
- [ ] Add "View Pool on Uniswap" link

#### DoD

- [ ] Button links zu `/dashboard`
- [ ] External link zu Uniswap funktioniert

---

## 🎫 TRACK C: Web3 Features

### **TW-008: Supabase Setup**

**Effort**: 2h | **Priority**: 🔴 Critical

- Create Supabase project
- Tables: `users`, `proposals`, `missions`
- RLS policies
- Connection test

**DoD**: Database schema deployed, client funktioniert

---

### **TW-009: API Auth Middleware**

**Effort**: 2h | **Priority**: 🔴 Critical | **Dep**: TW-004, TW-008

- `POST /api/auth/login` - SIWE verification
- JWT generation
- `src/lib/apiAuth.ts` middleware
- Validate JWT in protected routes

**DoD**: Auth middleware funktioniert, invalid tokens rejected

---

### **TW-010: Proposals API Endpoints**

**Effort**: 2h | **Priority**: 🔴 Critical | **Dep**: TW-009

- `POST /api/proposals` - Create
- `GET /api/proposals/me` - User's proposals
- `GET /api/proposals/:id` - Single proposal
- `PUT /api/proposals/:id/respond` - Accept/Reject/Counter
- Validation (Zod)
- Rate limiting

**DoD**: Alle Endpoints funktionieren, validation aktiv

---

### **TW-011: Vesting Contract Deployment**

**Effort**: 3h | **Priority**: 🔴 Critical

- Deploy `VestingContract.sol` (aus MVP-004)
- Base Sepolia
- Verify on Basescan
- Export ABI

**DoD**: Contract deployed + verified, address in `.env`

---

### **TW-012: Vesting Contract Frontend**

**Effort**: 2h | **Priority**: 🔴 Critical | **Dep**: TW-011, TW-003

- `src/hooks/useVesting.ts`
- `confirmWorkDone()` function
- Update `ProposalCard.tsx`
- Transaction loading/success states

**DoD**: "Confirm Work" button funktioniert, TX submitted

---

### **TW-014-MCP: Token Deployment via MCP**

**Effort**: 2h | **Priority**: 🟡 High | **Dep**: TW-003

- MCP `createToken` API call
- `/api/tokens/deploy` endpoint
- Update `SetupStep.tsx` (Wizard)
- Transfer 2% zu DAO-Wallet

**DoD**: Token-Deployment via MCP funktioniert, DAO-Fee transferiert

---

### **TW-015: Gas Sponsorship**

**Effort**: 4h | **Priority**: 🟢 Medium | **Dep**: TW-002, TW-009

- Paymaster setup (ThirdWeb Dashboard)
- Budget tracking in DB (`gas_budget_used`)
- Update Smart Wallet config
- UI indicator "Gasless transaction"

**DoD**: Erste 3 proposals sind gasless, 4. zeigt "Gas required"

---

### **TW-016-MCP: Price Service via MCP**

**Effort**: 30min | **Priority**: 🟢 Medium | **Dep**: TW-008

- MCP `listTokens` API call
- `/api/tokens/price` endpoint
- Multi-currency prices

**DoD**: Price API returns USD/EUR/GBP prices

---

### **TW-017: Liquidity Pool Integration**

**Effort**: 3h | **Priority**: 🟢 Medium | **Dep**: TW-014-MCP, TW-003

- Uniswap V2 Router integration
- `addLiquidity()` call
- Batch: Approve + AddLiquidity
- Show LP tokens received

**DoD**: Pool creation funktioniert, LP tokens geminted

---

### **TW-018: ThirdWeb Pay Onramp**

**Effort**: 2h | **Priority**: 🔵 Low | **Dep**: TW-003

- Install `@thirdweb-dev/pay`
- Create `OnrampWidget.tsx`
- Add zu Dashboard

**DoD**: Pay widget funktioniert (Test-Mode), tokens landen in wallet

---

## 📋 Implementation Order

### Sprint 1 (Week 1): Foundation

**TW-001, TW-002, TW-003** - Web3 basics

**TW-008** - Database setup

### Sprint 2 (Week 2): Auth + Backend

**TW-004, TW-005** - Auth system

**TW-009, TW-010** - Backend APIs

### Sprint 3 (Week 3): Critical User Flows

**TW-019** - Proposal Submission Frontend

**TW-020** - Proposal Review Integration

**TW-011, TW-012** - Vesting Contract

### Sprint 4 (Week 4): Work Tracking + Features

**TW-021** - Work Tracking Interface

**TW-022** - Dashboard Tabs

**TW-006, TW-007** - Balance Display

### Sprint 5 (Week 5): Token + Liquidity

**TW-014-MCP** - Token Deployment

**TW-016-MCP** - Price Service

**TW-017** - Liquidity Pool

**TW-023** - Liquidity Navigation Fix

### Sprint 6 (Optional): Polish

**TW-015** - Gas Sponsorship

**TW-018** - Pay Onramp

---

## 🎯 Success Metrics

### Application Completeness

- **Current**: 65%
- **After Track A+C**: 80% (Web3 works)
- **After Track B**: **100%** (All user flows complete)

### Critical Gaps Closed

- ✅ Gap #1: Proposal Submission (TW-019)
- ✅ Gap #2: Work Tracking (TW-021)
- ✅ Gap #3: Authentication (TW-003)
- ✅ Gap #4: Negotiation System (TW-020)
- ✅ Gap #5: Real Project Data (TW-008, TW-009, TW-010)
- ✅ Gap #8: Dashboard Tabs (TW-022)
- ✅ Gap #9: Liquidity Navigation (TW-023)

### User Journey Completeness

**Founder**: 100% (Register → Wizard → Dashboard → Create → Review → Track → Approve → Done)

**Co-founder**: 100% (Register → Browse → Apply → Negotiate → Accept → Work → Submit → Receive Tokens)

---

## 📊 Total Effort

| Track | Tickets | Hours |

|-------|---------|-------|

| Track A (Web3 Foundation) | 7 | 7.5h |

| Track B (User Flows) | 5 | 13h |

| Track C (Web3 Features) | 9 | 19.5h |

| **TOTAL** | **21** | **40h** |

**Time to Market**: 5 weeks @ 8h/week oder 2 weeks @ 20h/week

---

## ✅ Definition of "MVP Complete"

MVP ist complete wenn:

1. ✅ Alle User Flows aus USERFLOW.md funktional
2. ✅ Web3-Integration vollständig (Wallet, Tokens, Contracts)
3. ✅ Zero Critical Gaps verbleibend
4. ✅ Real data (kein Mocking)
5. ✅ Deployable auf Production

### To-dos

- [ ] TW-001: Install ThirdWeb dependencies & setup env
- [ ] TW-002: ThirdWeb Provider with Embedded Wallets
- [ ] TW-003: ConnectWallet in Navigation (closes Auth Gap)
- [ ] TW-004: useWalletAuth Hook with MCP
- [ ] TW-005: Protected Routes Middleware
- [ ] TW-006: Multi-Token Balance Display via MCP
- [ ] TW-007: Wallet Info Component
- [ ] TW-008: Supabase Setup & Schema
- [ ] TW-009: API Auth Middleware
- [ ] TW-010: Proposals API Endpoints (closes Data Gap)
- [ ] TW-019: Proposal Submission Frontend (closes Gap #1)
- [ ] TW-020: Proposal Review Integration (closes Gap #4)
- [ ] TW-011: Vesting Contract Deployment
- [ ] TW-012: Vesting Contract Frontend
- [ ] TW-021: Work Tracking Interface (closes Gap #2)
- [ ] TW-022: Dashboard Tabs Implementation (closes Gap #8)
- [ ] TW-023: Liquidity Success Navigation (closes Gap #9)
- [ ] TW-014-MCP: Token Deployment via MCP API
- [ ] TW-015: Gas Sponsorship Setup
- [ ] TW-016-MCP: Price Service via MCP API
- [ ] TW-017: Liquidity Pool Integration
- [ ] TW-018: ThirdWeb Pay Onramp