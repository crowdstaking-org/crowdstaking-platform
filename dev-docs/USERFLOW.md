# CrowdStaking User Flow Diagram

**Last Updated:** 2025-11-12 (Account Deletion Feature)
**Status:** Current state of codebase - marks gaps and dead ends

**Recent Updates:**
- ✅ **ACCOUNT DELETION** (Complete - GDPR-compliant)
  - ✅ SQL Migration: Anonymisierungs- und Löschfunktionen
  - ✅ API Endpoint: DELETE /api/profiles/delete
  - ✅ UI: Settings Tab mit 2-Schritt-Bestätigung
  - ✅ Flow: Settings → Delete Dialog → Logout → Landing
  - ✅ GDPR Art. 17 konform: Löscht personenbezogene Daten, anonymisiert Content
- ✅ **PROFILE LINKING SYSTEM** (Complete)
  - ✅ Wiederverwendbare Components: UserProfileLink, UserAvatarStack, ProfileBadge
  - ✅ Proposals: Creator Profile-Links mit Avatar, Name, Trust Score
  - ✅ Blog: Author Profile-Links in Posts & Comments
  - ✅ Admin Panel: Creator Profile-Links mit Trust Score
  - ✅ Team Tab: Co-Founders mit Profile-Links und Stats
  - ✅ Leaderboards Page: /leaderboards mit Rankings und Profile-Links
  - ✅ Activity Timeline: User-Mentions in Activities verlinkt
  - ✅ API Extensions: Proposals API liefert Creator-Profile-Daten
  - ✅ Navigation: Leaderboards-Link hinzugefügt
- ✅ **GAMIFICATION SYSTEM** (Phase 1-6 Complete)
  - ✅ Database Schema: profiles extended, stats, badges, social features, privacy, activity
  - ✅ Trust Score Algorithm: Multi-factor reputation system (0-100)
  - ✅ Badge System: 8 initial badges with auto-awarding
  - ✅ Social Features: Follow, Bookmark, Endorse
  - ✅ Profile Pages: /profiles/[address] with tabs (Overview, Portfolio, Activity)
  - ✅ Settings Page: /settings/profile (Basic Info, Privacy)
  - ✅ API Integration: Event hooks in proposals & projects
  - ✅ Cron Job: Daily trust score updates
  - ✅ Leaderboards: Contributors, Founders, Rising Stars
  - ✅ Discovery: Find contributors by skill & trust score
- ✅ Dashboard privatisiert - nur für authentifizierte Founder
- ✅ Öffentliche Projekt-Detail-Seiten (/projects/[projectId])
- ✅ Öffentliche Mission-Detail-Seiten (/projects/[projectId]/missions/[missionId])
- ✅ Thirdweb Multi-Auth (Email + Wallet + Google)
- ✅ Phase 4: Complete Double Handshake implementation
- ✅ Admin panel for proposal review (/admin/proposals)
- ✅ Pioneer response UI in Cofounder Dashboard
- ✅ Full status state machine (5 states)

---

## Legend
```
[Page]              = Existing page
(Action)            = User action
--->                = Navigation flow
~~>                 = Missing/incomplete flow
[!DEAD END!]        = Flow stops without completion
[!GAP!]             = Missing functionality
```

---

## Modell 4.0 – Digitales Partnerschafts-Protokoll (✅ IMPLEMENTIERT)

```
[HOME /] 
   │
   │ (Click "Start Mission" → /wizard/v4)
   ▼
[V4 PROJECT WIZARD] /wizard/v4
   │
   │ Step 1: Welcome
   │ Step 2: Project Details (Name, Slug, Mission)
   │ Step 3: Review & Deploy
   │
   │ (Project Created + Contracts Deployed)
   │
   ▼
[PROJECT DETAILS] /projects/[projectId]
   │
   │ (Click "Create v4 Proposal" in Founder Dashboard)
   ▼
[V4 PROPOSAL CREATION] /projects/[projectId]/proposals/v4/new
   │
   │ Select Proposal Type: WORK | CAPITAL | PAYOUT | REVOKE
   │ Fill Proposal Form
   │ Submit Proposal
   │
   ▼
[V4 GOVERNANCE UI] /projects/[projectId]/proposals/v4/[proposalId]
   │
   │ View Proposal Details
   │ Cast Vote (YES/NO) → On-chain Voting
   │ Execute Proposal (if approved) → On-chain Execution
   │
   ├─ Work Proposal (Proof-of-Work)
   │    ▼
   │  Proposal Accepted → registerPartnerShare() Job
   │    ▼
   │  PartnerSBT Mint + DividendVault Entry ✅
   │    ▼
   │  (Pioneer delivers work)
   │    ▼
   │  markWorkDelivered() ✅ (Queue Job)
   │    ▼
   │  DAO Voting (Reinvest / Distribute) ✅ (Voting UI implementiert)
   │    ▼
   │  PAYOUT Proposal → startDistribution() ✅
   │    ▼
   │  claim() → USDC Dividend Payout ✅ (Frontend Transaction Signing)
   │
   └─ Capital Proposal (Proof-of-Capital)
        ▼
     Proposal Accepted → registerPartnerShare() Job
        ▼
     PartnerSBT Mint (Status: pending_capital) ✅
        ▼
     Capital Deposit (USDC → Vault) + Honesty Bond
        ▼
     Oracle Confirmation ✅ (Oracle Webhook mit HMAC)
        ▼
     activateCapitalShare() ✅ (Queue Job)
        ▼
     claim() sobald Dividenden freigegeben ✅

[PARTNER DASHBOARD] /dashboard/v4/partner
   │
   │ View Partner Shares ✅
   │ View SBTs ✅
   │ View Dividend Claims ✅
   │ Claim Dividends ✅ (Frontend Transaction Signing)
```

> ✅ **Status:** Alle v4.0 User Flows sind vollständig implementiert. Legacy-Abschnitte bleiben unten zur Referenz markiert.

---

## 0. Zwei-Spur-Strategie (Bewegung vs Produkt)

```
[Track 1: Bewegung / Testnet]               [Track 2: Produkt / Mainnet]
   │                                              │
   │ Build-in-Public (CrowdStaking on itself)     │ Seed-Funding via Kapital-Partner
   │ Earn $CROWDSTAKING-SBT (Testnet)             │ Honest Foundation + Oracle Build
   │ 1:1 Upgrade → Mainnet                        │ Pragmatiker ("Sarah") Onboarding
   │                                              │
   └─ [!GAP!] UI Toggle (Movement vs Product) ────┘
```

---

## 1. Work-Partner Journey (Model 4.0)

```
[DASHBOARD /dashboard]
   │
   │ (Click "Make a Proposal")
   ▼
[PROPOSAL FORM /dashboard/propose]
   ├─ Title, Mission Impact, Deliverable
   ├─ Requested Partner Share (%)
   ├─ Contribution Type = work
   └─ Proof Links (Optional)
       │
       └─ (Submit) ──> Status `pending_review`
            │
            ▼
        [ADMIN PANEL]
            ├─ Accept / Counter / Reject
            └─ If accepted → `foundation_approved`
                  │
                  ▼
          (Contributor Accepts) → `pioneer_approved`
                  │
                  └─ Auto job: `registerPartnerShare` + `mintPartnerSBT`
                               │
                               ▼
                      Share Status = `pending_work`
                               │
                               └─ (Contributor delivers work)
                                       │
                                       ├─ (Click "Work Completed")
                                       │     ~~> [!GAP!] Dashboard CTA wired to API
                                       │
                                       └─ Admin verifies → `markWorkDelivered`
                                                │
                                                ▼
                                       Share Status = `active`
                                                │
                                                └─ DAO Vote → Distribution
                                                │     ~~> [!GAP!] Voting UI
                                                ▼
                                        (Contributor clicks Claim)
                                                │
                                                └─ `claim()` transfers USDC
```

---

## 2. Kapital-Partner Journey (Model 4.0)

```
[DASHBOARD /dashboard]
   │
   │ (Submit proposal with Contribution Type = capital)
   ▼
[ADMIN PANEL]
   │
   ├─ Collect capital amount, intended use, honesty bond
   └─ Vote + Accept → `foundation_approved`
          │
          ▼
(Contributor Accepts) → `pioneer_approved`
          │
          └─ registerPartnerShare(requires_oracle = true)
                   │
                   ▼
          SBT minted (status: pending_capital)
                   │
                   └─ Contributor deposits USDC (on-chain) **or**
                      uploads bank proof ~~> [!GAP!] "Bank Proof Upload" UI
                           │
                           ▼
                Oracle Webhook → `activateCapitalShare`
                           │
                           └─ share status = active
                                   │
                                   └─ DAO decides → Dividend payout
                                           │
                                           └─ Contributor claims from vault
```

---

## 3. Dividend Claim Flow (Model 4.0)

```
[DAO Vote Passed]
   │
   │ (Set distribution amount in vault)
   ▼
[PARTNER DASHBOARD]
   │
   ├─ Module "Dividend Vault" shows claimable amount
   ├─ (Click "Claim")
   │     └─ `POST /api/dividends/claim/:proposalId`
   │           ├─ Verifies share belongs to caller
   │           ├─ Calls `claim()` on vault
   │           └─ Stores tx hash + updates UI
   │
   └─ [!GAP!] DAO Vote history component
```

---

> **Legacy Hinweis:** Die folgenden Abschnitte beziehen sich auf das alte `$CSTAKE`-basierte Modell. Sie bleiben bis zur vollständigen Migration erhalten und sind entsprechend gekennzeichnet.

---

## Main User Flow Overview (Legacy Reference)

```
                                    ┌─────────────────┐
                                    │   HOME PAGE (/) │
                                    │  Landing Page   │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
        ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
        │ Information Pages │   │  Founder Journey  │   │ Co-founder Journey│
        └───────────────────┘   └───────────────────┘   └───────────────────┘
```

---

## 1. FOUNDER JOURNEY (Legacy v3.0 – Mission Creation & Tokens)

```
[HOME PAGE]
    │
    │ (Click "Start Mission" in Nav)
    │
    ▼
[WIZARD PAGE] /wizard
    │
    │ Step 0: Welcome
    │ Step 1: Mission Details (Project name, mission, vision, tags)
    │ Step 2: Setup (Legal wrapper, fee agreement)
    │ Step 3: Deal Terms
    │ Step 4: Review
    │ Step 5: Success
    │
    │ (Mission Created)
    │
    ▼
[FOUNDER DASHBOARD] /dashboard
    │
    ├─── Tab: Overview
    │    ├─ View pending proposals (1 New Proposal shown)
    │    ├─ Active Mini-Missions list
    │    ├─ Project Statistics
    │    │
    │    ├─ (Click "New Mini-Mission")
    │    │   │
    │    │   ▼
    │    │  [CREATE MINI-MISSION] /create-mini-mission
    │    │   │
    │    │   ├─ Form: Title, Description, Required Skills
    │    │   ├─ (Submit)
    │    │   │
    │    │   ▼
    │    │  Success Screen
    │    │   ├─ "Create Another Mini-Mission" ─────┐
    │    │   └─ "Go to Founder Dashboard" ─────────┤
    │    │                                          │
    │    │                                          ▼
    │    └─ (Click on Proposal) ─────────> [PROPOSAL REVIEW] /proposal-review
    │         │
    │         ├─ View Proposal Details
    │         ├─ AI Mediator Recommendation
    │         │
    │         ├─ (Accept Proposal)
    │         │   └──> ✅ Double Handshake Complete ─────> [!GAP!] Work Tracking
    │         │
    │         ├─ (Make Counter-Offer)
    │         │   └──> Counter-Offer Modal ─────> [!GAP!] Negotiation System
    │         │
    │         └─ (Reject Proposal)
    │             └──> Back to Dashboard
    │
    ├─── Tab: Missions
    │    └─ [!GAP!] Mission management interface
    │
    ├─── Tab: Proposals
    │    └─ [!GAP!] All proposals view
    │
    ├─── Tab: Team
    │    └─ [!GAP!] Team member overview
    │
    ├─── Tab: Tokenomics
    │    └─ [!GAP!] Token distribution visualization
    │
    └─── Tab: Settings
         ├─ Project Details (Name, Mission, Tags)
         ├─ Legal Wrapper Setup
         ├─ Danger Zone: Archive Project
         └─ ✅ Account Deletion (NEW - GDPR-compliant)
              │
              ├─ Warning: Permanent deletion notice
              ├─ Lists what will be deleted (Profile, Stats, Badges, Social)
              ├─ Lists what stays anonymized (Proposals, Blog Posts, Comments)
              │
              ├─ (Click "Account permanent löschen")
              │   └──> Inline Dialog opens
              │        ├─ Input field: Type "DELETE"
              │        ├─ (Cancel) → closes dialog
              │        └─ (Confirm) → API call
              │             ├─ DELETE /api/profiles/delete
              │             ├─ Anonymizes content (SQL function)
              │             ├─ Deletes profile + CASCADE all related data
              │             ├─ Logout & clear localStorage
              │             └─> Redirect to [HOME PAGE] /
    
    
[DASHBOARD] - Project Statistics Section
    │
    │ (Token Status: Illiquid)
    │ (Click "Make Your Tokens Liquid Now")
    │
    ▼
[LIQUIDITY WIZARD] /liquidity-wizard
    │
    ├─ Step 1: Liquidity Requirement Agreement
    ├─ Step 2: Choose Platform & Amounts (Uniswap V3, token/stablecoin amounts)
    ├─ Step 3: Confirm & Deploy
    │
    ▼
    Success Screen: Liquidity Pool Created
    └──> [!GAP!] Back to Dashboard (no link)
```

---

## 2. ADMIN JOURNEY (Legacy v3.0 – Review & Negotiate Proposals) ✅ (Phase 4)

```
[ADMIN LOGIN]
    │
    │ (Connect Admin Wallet - requires ADMIN_WALLET_ADDRESS in .env)
    │
    ▼
[ADMIN PROPOSALS LIST] /admin/proposals
    │
    ├─ Statistics Dashboard:
    │  ├─ Total Proposals
    │  ├─ Pending Review (yellow)
    │  ├─ Counter-Offers (purple)
    │  └─ Accepted (green)
    │
    ├─ Proposals List (sorted by created_at DESC):
    │  ├─ Title, Creator, Status Badge
    │  ├─ Requested Amount
    │  └─ (Click Proposal) ────────────┐
    │                                   │
    │                                   ▼
    └──────────────────> [ADMIN PROPOSAL DETAIL] /admin/proposals/:id
                              │
                              ├─ Full Proposal Details:
                              │  ├─ Title, Creator Wallet
                              │  ├─ Description (Markdown rendered)
                              │  ├─ Deliverable (Markdown rendered)
                              │  ├─ Requested Amount
                              │  ├─ Status Badge
                              │  └─ Foundation Notes (if any)
                              │
                              ├─ Actions (only if status = 'pending_review'):
                              │  │
                              │  ├─ (Accept) ────────────┐
                              │  │                       │
                              │  │                       ▼
                              │  │              [Accept Modal]
                              │  │               ├─ Optional Notes
                              │  │               ├─ (Confirm)
                              │  │               │   └──> Status: approved ✅
                              │  │               │         └──> Pioneer sees in Dashboard
                              │  │               │               └──> Can accept to finalize
                              │  │               │
                              │  │               └─ (Cancel)
                              │  │
                              │  ├─ (Counter-Offer) ────┐
                              │  │                     │
                              │  │                     ▼
                              │  │            [Counter-Offer Modal]
                              │  │             ├─ Amount Input (required, suggested 80%)
                              │  │             ├─ Explanation (optional)
                              │  │             ├─ (Submit)
                              │  │             │   └──> Status: counter_offer_pending 🤝
                              │  │             │         └──> Pioneer sees in Dashboard
                              │  │             │               └──> Can accept/reject
                              │  │             │
                              │  │             └─ (Cancel)
                              │  │
                              │  └─ (Reject) ───────────┐
                              │                        │
                              │                        ▼
                              │                [Reject Modal]
                              │                 ├─ Notes (required - reason)
                              │                 ├─ (Confirm)
                              │                 │   └──> Status: rejected ❌
                              │                 │         └──> Flow ends
                              │                 │
                              │                 └─ (Cancel)
                              │
                              └─ (Back to List)
                                  └──> [ADMIN PROPOSALS LIST]

✅ COMPLETED (Phase 4): Admin Review System
    Full Double Handshake implementation with:
    - Admin panel & detail views
    - Three admin actions (accept/reject/counter-offer)
    - Status state machine enforcement
    - API endpoints with authorization
```

---

## 3. CO-FOUNDER JOURNEY (Legacy v3.0 – Discover & Contribute)

```
[HOME PAGE]
    │
    │ (Click "Discover Projects" in Nav)
    │
    ▼
[DISCOVER PROJECTS] /discover-projects
    │
    ├─ Hero Section
    ├─ Project Marketplace (Browse missions)
    ├─ How to Become Co-founder
    └─ CTA Section
    │
    │ (User navigates to Co-founder Dashboard)
    │
    ▼
[CO-FOUNDER DASHBOARD] /cofounder-dashboard
    │
    ├─── Tab: Discover
    │    │
    │    ├─ ✅ "Submit Proposal" CTA (prominent purple gradient banner)
    │    │   │
    │    │   └──> [PROPOSAL FORM] /dashboard/propose ✅ NEW (Phase 3)
    │    │        │
    │    │        ├─ Form Fields:
    │    │        │  ├─ Proposal Title (5-200 chars)
    │    │        │  ├─ Description (50-5000 chars, Markdown)
    │    │        │  ├─ Deliverable (20-2000 chars, Markdown)
    │    │        │  └─ Requested $CSTAKE Amount
    │    │        │
    │    │        ├─ Features:
    │    │        │  ├─ Real-time validation (Zod + react-hook-form)
    │    │        │  ├─ Markdown editor with preview tabs
    │    │        │  ├─ Preview modal (full proposal preview)
    │    │        │  ├─ Help text & formatting guide
    │    │        │  └─ Character counters
    │    │        │
    │    │        ├─ (Submit Proposal)
    │    │        │   │
    │    │        │   ├─ Server-side validation (Zod)
    │    │        │   ├─ Save to Supabase
    │    │        │   │
    │    │        │   ▼
    │    │        │  Success Modal
    │    │        │   ├─ "Proposal Submitted!" message
    │    │        │   └─ Redirect to Cofounder Dashboard (2s)
    │    │        │
    │    │        └─ (Error Handling)
    │    │            └──> Display error message & allow retry
    │    │
    │    ├─ Browse Available Missions
    │    │  ├─ Mission Cards with details
    │    │  └─ (Click "View Project & Propose")
    │    │      │
    │    │      └──> [FOUNDER DASHBOARD] /dashboard
    │    │           [!NOTE!] Redirects to Founder view - might be confusing
    │    │
    │    └─ Search & Filter Missions
    │
    ├─── Tab: My Contributions ✅ UPDATED (Phase 4)
    │    │
    │    ├─ View Submitted Proposals (via /api/proposals/me)
    │    │  │
    │    │  ├─ Sub-tabs: Alle, Pending Review, Aktion erforderlich, Akzeptiert, Abgelehnt
    │    │  │
    │    │  ├─ Proposal Cards mit Status Badge:
    │    │  │  ├─ pending_review → Wartet auf Admin Review
    │    │  │  │
    │    │  │  ├─ counter_offer_pending → 🤝 Counter-Offer Response UI
    │    │  │  │   ├─ Zeigt Foundation Offer vs. Request
    │    │  │  │   ├─ Zeigt Foundation Notes
    │    │  │  │   └─ Actions:
    │    │  │  │       ├─ (Accept Counter-Offer) → Status: accepted ✅
    │    │  │  │       └─ (Reject Counter-Offer) → Status: rejected ❌
    │    │  │  │
    │    │  │  ├─ approved → ✅ Approval Response UI
    │    │  │  │   ├─ "Proposal genehmigt!" message
    │    │  │  │   ├─ Zeigt Foundation Notes (optional)
    │    │  │  │   └─ (Accept & Start Work) → Status: accepted ✅
    │    │  │  │
    │    │  │  ├─ accepted → 🎉 Double Handshake Complete!
    │    │  │  │   └─ Ready to start work [!GAP!] Work tracking interface
    │    │  │  │
    │    │  │  └─ rejected → ❌ Shows rejection reason
    │    │  │
    │    │  └─ API: PUT /api/proposals/respond/:id (accept/reject)
    │    │
    │    └─ [!GAP!] No work submission interface yet
    │         (Planned: Phase 5+ - Track work progress, milestones)
    │
    ├─── Tab: Portfolio
    │    └─ [!DEAD END!] "Portfolio view coming soon..."
    │
    └─── Tab: Governance
         └─ [!DEAD END!] "Governance view coming soon..."


✅ COMPLETED (Phase 3): Proposal Submission Flow
    [Discover Mission] -> [Proposal Form] -> [Submit to Founder]
    
✅ COMPLETED (Phase 4): Double Handshake Flow
    [Pioneer Submits] -> [Admin Reviews] -> [Admin Accept/Reject/Counter] 
    -> [Pioneer Responds] -> [Both Agreed: accepted ✅]
    
    API Endpoints:
    - POST /api/proposals (create new proposal)
    - GET /api/proposals/me (fetch user's proposals)
    - GET /api/proposals/admin (admin: fetch all proposals)
    - PUT /api/proposals/admin/:id (admin: accept/reject/counter_offer)
    - PUT /api/proposals/respond/:id (pioneer: accept/reject response)
```

---

## 3. INFORMATION PAGES (Read-only Content)

```
[HOME PAGE]
    │
    ├────────────────────┬────────────────────┬────────────────────┐
    │                    │                    │                    │
    ▼                    ▼                    ▼                    ▼
[HOW IT WORKS]      [ABOUT]           [WHITEPAPER]         [START MISSION]
/how-it-works       /about            /whitepaper          /start-mission
    │                    │                    │                    │
    ├─ Hero              ├─ Hero              ├─ Hero              ├─ Hero
    ├─ Role Split        ├─ Mission           ├─ 9 Sections:       ├─ Three Steps
    ├─ Founder Process   ├─ Who We Are        │  1. Future          ├─ FAQ
    ├─ Cofounder Process ├─ Dogfooding        │  2. What is CS      └─ CTA
    ├─ Economic Model    ├─ Legal Structure   │  3. Mechanics            │
    ├─ Legal Fortress    └─ CTA               │  4. Liquidity            │
    └─ CTA                   │                │  5. Flywheel             │
        │                    │                │  6. Start                │
        └────────────────────┴────────────────┤  7. Moat                 │
                                              │  8. Legal                │
                                              │  9. Conclusion           │
                                              └─ CTA                     │
                                                  │                      │
                                                  └──────────────────────┘
                                                             │
                                                             ▼
                                                    (Links to /wizard)
```

---

## 4. NAVIGATION & CONTEXT SWITCHING

```
[NAVIGATION BAR] (Sticky on all pages except /wizard and /liquidity-wizard)
    │
    ├─ Logo (Links to /) ────────────────────────────> [HOME PAGE]
    │
    ├─ "Discover Projects" ──────────────────────────> [DISCOVER PROJECTS]
    │
    ├─ "How It Works" ───────────────────────────────> [HOW IT WORKS]
    │
    ├─ "About" ──────────────────────────────────────> [ABOUT]
    │
    ├─ Theme Toggle (Light/Dark)
    │
    ├─ "Login" Button ──────────────────────────────> [!DEAD END!] No functionality
    │
    └─ "Start Mission" Button ──────────────────────> [WIZARD]


[CONTEXT SWITCHER] (In Dashboards)
    │
    ├─ "Co-founder View" ────────────────────────────> [CO-FOUNDER DASHBOARD]
    │
    ├─ "Project: Flight-AI" ─────────────────────────> [FOUNDER DASHBOARD]
    │
    └─ "New Project" ────────────────────────────────> [WIZARD]
```

---

## 5. CRITICAL GAPS & DEAD ENDS

### 🔴 High Priority Gaps

1. ~~**Proposal Submission by Co-founders**~~ ✅ **COMPLETED (Phase 3)**
   - ✅ Full proposal form at /dashboard/propose
   - ✅ Markdown editor with preview
   - ✅ Real-time & server-side validation
   - ✅ Success/error handling
   - ✅ Prominent CTA in cofounder dashboard

2. **Work Tracking & Completion** 🔴 **Still Needed**
   - Current: After "Double Handshake", no tracking system
   - Needed: Interface for co-founders to submit work, founders to review/approve
   - Status: Completely missing - Priority for Phase 4

3. ~~**Authentication System**~~ ✅ **COMPLETED (Phase 2)**
   - ✅ ThirdWeb wallet authentication
   - ✅ Session management with cookies
   - ✅ Protected routes
   - ✅ Login/Logout endpoints

4. **Negotiation System** 🔴 **Still Needed**
   - Current: Counter-offer form exists but doesn't connect to anything
   - Needed: Back-and-forth negotiation interface
   - Impact: "Double Handshake" is incomplete
   - Priority: Phase 4-5

5. **Real Project Data** 🟡 **Partially Complete**
   - ✅ Proposals: Real database (Supabase) with API
   - ✅ Auth: Real sessions & wallet addresses
   - 🔴 Projects/Missions: Still mocked
   - 🔴 Token balances: Still mocked
   - Priority: Phase 5+

### 🟡 Medium Priority Gaps

6. **Portfolio Tab** (/cofounder-dashboard)
   - Status: "Coming soon" placeholder

7. **Governance Tab** (/cofounder-dashboard)
   - Status: "Coming soon" placeholder

8. **Founder Dashboard Tabs** (/dashboard)
   - Missions, Proposals, Team, Tokenomics, Settings tabs
   - Status: Component files exist but show placeholders

9. **Liquidity Success Flow**
   - Current: Success screen has no navigation back
   - Needed: Link back to dashboard

10. **Project Discovery -> Application Flow**
    - Current: Users can view projects but can't apply
    - Needed: Clear CTA from /discover-projects to proposal submission

### 🟢 Low Priority / Polish Items

11. **Whitepaper Page** - No direct link from navigation
    - Accessible via content CTAs only

12. **Mobile Navigation** - Hidden on small screens
    - Hamburger menu needed

13. **Context Switcher Clarity**
    - Switching from co-founder to specific project might confuse users

---

## 6. COMPLETE USER JOURNEY MAP (Ideal vs Reality)

### Founder Journey
```
IDEAL:  Register -> Wizard -> Dashboard -> Create Mission -> Receive Proposals 
        -> Review -> Accept/Reject -> Track Work -> Approve -> Distribute Tokens

ACTUAL: [No Auth] -> Wizard ✅ -> Dashboard ✅ -> Create Mission ✅ -> [Mock Data] 
        -> Review ✅ -> Accept ⚠️ -> [!GAP! No Tracking] -> [!GAP!] -> [!GAP!]
```

### Co-founder Journey
```
IDEAL:  Register -> Browse -> Apply -> Negotiate -> Get Accepted -> Work 
        -> Submit -> Get Approved -> Receive Tokens -> Trade on DEX

ACTUAL: Auth ✅ -> Browse ✅ -> Submit Proposal ✅ -> [!GAP! Negotiate] -> [!GAP! Accept] 
        -> [!GAP! Work Tracking] -> [!GAP! Submit Work] -> [!GAP! Approve] 
        -> [!GAP! Tokens] -> [Liquidity exists ✅]

PHASE 3 COMPLETED: 
   - ✅ Authentication (Phase 2)
   - ✅ Proposal Submission (Phase 3)
   - ✅ API Integration (Phase 3)
```

---

## 7. PAGE INVENTORY & COMPLETENESS STATUS

| Route                                | Status | Completeness | Notes                              |
|--------------------------------------|--------|--------------|-------------------------------------|
| `/`                                  | ✅     | 95%          | Landing page - fully functional     |
| `/discover-projects`                 | ✅     | 85%          | Has proposal CTA (Phase 3)          |
| `/projects/[projectId]`              | ✅     | 90%          | Public project details              |
| `/projects/[projectId]/missions/[id]`| ✅     | 90%          | Public mission details              |
| `/profiles/[address]`                | ✅     | 98%          | Profile with stats, badges, portfolio, activity |
| `/settings/profile`                  | ✅     | 95%          | Profile & Privacy settings |
| `/leaderboards`                      | ✅     | 95%          | **NEW** - Rankings with Profile Links |
| `/how-it-works`                      | ✅     | 100%         | Information only                    |
| `/about`                             | ✅     | 100%         | Information only                    |
| `/whitepaper`                        | ✅     | 100%         | Information only                    |
| `/start-mission`                     | ✅     | 100%         | Information only                    |
| `/wizard`                            | ✅     | 90%          | Missing: Backend integration        |
| `/dashboard`                         | ✅     | 75%          | Private, Auth required              |
| `/cofounder-dashboard`               | ✅     | 65%          | Proposal flow complete (Phase 3)    |
| `/dashboard/propose`                 | ✅     | 95%          | Full proposal form                  |
| `/create-mini-mission`               | ✅     | 85%          | Missing: Backend integration        |
| `/proposal-review`                   | ⚠️     | 60%          | Missing: Negotiation, work tracking |
| `/liquidity-wizard`                  | ✅     | 85%          | Missing: Return navigation          |
| `/submit-proposal`                   | ⚠️     | 60%          | Old version - replaced by /dashboard/propose |

**Overall Application Completeness: ~88%** (+10% from Gamification, +3% from Profile Linking)

---

## 8. RECOMMENDED IMPLEMENTATION PRIORITY

### ~~Phase 1: Complete Core Flows (MVP)~~ ✅ COMPLETED
1. ✅ Authentication system (Wallet Connect) - Phase 2
2. ✅ Proposal submission form (Co-founder -> Founder) - Phase 3
3. 🟡 Backend API integration for real data - Partially (Proposals complete)
4. 🔴 Basic work tracking & approval system - Phase 4

### Phase 2: Enhance Interactions
5. Negotiation system for proposals
6. Complete all dashboard tabs
7. Portfolio & Governance features
8. Mobile responsive navigation

### Phase 3: Platform Features
9. Search & filter for missions
10. Notifications system
11. User profiles
12. Project analytics

---

## Auto-Update Notice

**⚠️ RULE STORED:** This diagram must be checked and updated after every code change that affects:
- New pages/routes
- Navigation changes
- User flow modifications
- Feature additions/removals

**Last Review:** 2025-11-12 (Account Deletion Feature Complete)
**Next Review:** After next feature implementation

## 9. PROFILE LINKING SYSTEM (NEW)

Profile-Links sind jetzt überall im System integriert:

### ✅ Implementiert
- **Proposals**: Creator Profile mit Avatar, Name, Trust Score (Mission Detail, Founder Dashboard, Admin Panel)
- **Blog**: Author Profile-Links in Posts & Comments  
- **Leaderboards**: Top Contributors/Founders/Rising Stars mit Profile-Links
- **Team Tab**: Co-Founders mit Profile-Cards (Avatar, Trust Score, Contributions)
- **Activity Timeline**: User-Mentions in Activities verlinkt
- **Navigation**: Leaderboards-Link in Main Nav & Mobile Menu

### 🎯 Gamification-Effekt
- User sehen Trust Scores anderer überall
- Ein Klick zu jedem User-Profil
- Social Discovery wird gefördert
- Team-Zusammenarbeit wird sichtbar

---

## 10. ACCOUNT DELETION SYSTEM (NEW - GDPR-COMPLIANT)

### ✅ Implementiert (2025-11-12)

**Location**: Founder Dashboard → Settings Tab → Account Deletion Sektion

**Features**:
- **2-Schritt-Bestätigung**: Minimiert versehentliche Löschungen
- **Inline-Dialog**: Keine Overlay-Modals, direkt in der Settings-Sektion
- **DELETE-Eingabe**: User muss "DELETE" tippen zur finalen Bestätigung
- **Loading-States**: Klare Feedback während des Löschvorgangs
- **Error-Handling**: Aussagekräftige Fehlermeldungen

**GDPR-Compliance (Art. 17 - Recht auf Vergessenwerden)**:

**Gelöscht (Personenbezogene Daten)**:
- ✅ Wallet-Adresse, Display-Name, Bio
- ✅ Email, Avatar-URL, Social-Links (GitHub, Twitter, LinkedIn, Website)
- ✅ Skills, Trust-Score, Profile-Views
- ✅ Total Earned Tokens, Availability Status
- ✅ Profile Stats (Proposals, Missions, Completion Rate, etc.)
- ✅ User Badges (alle erworbenen Badges)
- ✅ Social Connections:
  - Follows (als Follower und Following)
  - Bookmarks (als Bookmarker und Gebookmarkter)
  - Endorsements (als Endorser und Endorsed)
- ✅ Activity Timeline
- ✅ Privacy Settings

**Anonymisiert (User-Generated Content)**:
- ✅ Proposals: `creator_wallet_address` → NULL
- ✅ Blog Posts: `author_wallet_address` → NULL (Author als "Deleted User" via JOIN)
- ✅ Blog Comments: `author_wallet_address` → NULL (Author als "Deleted User" via JOIN)

**Technische Implementierung**:

1. **Database Migration**: `supabase-migrations/016_account_deletion.sql`
   - SQL-Funktion `anonymize_user_content(wallet_text)`: Anonymisiert Proposals, Blog Posts, Comments
   - SQL-Funktion `delete_user_account(wallet_text)`: Löscht Profile + CASCADE-Delete aller Related Data

2. **API Endpoint**: `src/app/api/profiles/delete/route.ts`
   - DELETE-Methode mit Auth-Validierung (`getAuthenticatedWallet`)
   - Ruft SQL-Funktion via `supabase.rpc('delete_user_account')`
   - Error-Handling: 401 Unauthorized, 500 Server Error

3. **UI Component**: `src/components/founder/SettingsTab.tsx`
   - Inline-Dialog mit State Management
   - DELETE-Eingabe-Validierung (case-insensitive)
   - Logout + localStorage.clear() + Redirect zu `/`

**User Flow**:
```
[Settings Tab]
    │
    ├─ Scroll zu "Account Deletion" Sektion (roter Border)
    │
    ├─ Lesen: Warnung + Liste der zu löschenden Daten
    │
    ├─ (Click "Account permanent löschen")
    │   └──> Inline-Dialog erscheint
    │        ├─ Input: "DELETE" eintippen
    │        ├─ Disabled bis korrekte Eingabe
    │        └─ (Click "Account endgültig löschen")
    │             ├─ Loading-State: "Wird gelöscht..."
    │             ├─ API Call: DELETE /api/profiles/delete
    │             ├─ Success: Logout + Clear localStorage
    │             └─ Redirect: [HOME PAGE] /
    │
    └─ (Click "Abbrechen") → Dialog schließt sich
```

**Rechtliche Basis**:
- Art. 17 DSGVO: Recht auf Vergessenwerden ✅
- Art. 6(1)(f) DSGVO: Berechtigtes Interesse an Plattform-Integrität ✅
- Standard-Praxis: Reddit, GitHub, Stack Overflow verwenden gleiche Strategie ✅

**Security**:
- ✅ Auth-Validierung auf API-Level
- ✅ Keine Möglichkeit für andere User, Accounts zu löschen
- ✅ 2-Schritt-Bestätigung verhindert versehentliche Löschung
- ✅ Logout erfolgt vor Redirect (verhindert Session-Leaks)

