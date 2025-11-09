# CrowdStaking User Flow Diagram

**Last Updated:** 2025-11-09  
**Status:** Current state of codebase - marks gaps and dead ends

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

## Main User Flow Overview

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

## 1. FOUNDER JOURNEY (Complete Mission Creation & Management)

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
         └─ [!GAP!] Project settings
    
    
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

## 2. CO-FOUNDER JOURNEY (Discover & Contribute)

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
    │ [!GAP!] No direct application/proposal submission from this page
    │
    │ (User navigates to Co-founder Dashboard via Navigation? - Not clear)
    │
    ▼
[CO-FOUNDER DASHBOARD] /cofounder-dashboard
    │
    ├─── Tab: Discover
    │    │
    │    ├─ Browse Available Missions
    │    │  ├─ Mission Cards with details
    │    │  └─ (Click "View Project")
    │    │      │
    │    │      └──> [FOUNDER DASHBOARD] /dashboard
    │    │           [!NOTE!] Redirects to Founder view - might be confusing
    │    │
    │    └─ [!GAP!] No "Submit Proposal" action from Discover tab
    │
    ├─── Tab: My Contributions
    │    │
    │    ├─ Active Contributions (In Progress)
    │    ├─ Completed Contributions
    │    │
    │    └─ [!GAP!] No work submission interface
    │
    ├─── Tab: Portfolio
    │    └─ [!DEAD END!] "Portfolio view coming soon..."
    │
    └─── Tab: Governance
         └─ [!DEAD END!] "Governance view coming soon..."


[!GAP!] Missing Flow: How does Co-founder submit a proposal?
    Expected: [Discover Mission] -> [Proposal Form] -> [Submit to Founder]
    Current: No interface exists for this critical flow
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

1. **Proposal Submission by Co-founders**
   - Current: No interface for co-founders to submit proposals
   - Needed: Form to submit proposal with work description and token request
   - Entry Point: From /cofounder-dashboard Discover tab or /discover-projects

2. **Work Tracking & Completion**
   - Current: After "Double Handshake", no tracking system
   - Needed: Interface for co-founders to submit work, founders to review/approve
   - Status: Completely missing

3. **Authentication System**
   - Current: "Login" button does nothing
   - Needed: Wallet connection or traditional auth
   - Impact: Users can't save state, manage real projects

4. **Negotiation System**
   - Current: Counter-offer form exists but doesn't connect to anything
   - Needed: Back-and-forth negotiation interface
   - Impact: "Double Handshake" is incomplete

5. **Real Project Data**
   - Current: All data is hardcoded/mocked
   - Needed: Backend API connection
   - Impact: Application is currently a prototype only

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

ACTUAL: [No Auth] -> Browse ✅ -> [!GAP! Can't Apply] -> [!GAP!] -> [!GAP!] 
        -> [!GAP!] -> [!GAP!] -> [!GAP!] -> [!GAP!] -> [Liquidity exists ✅]
```

---

## 7. PAGE INVENTORY & COMPLETENESS STATUS

| Route                   | Status | Completeness | Notes                              |
|-------------------------|--------|--------------|-------------------------------------|
| `/`                     | ✅     | 95%          | Landing page - fully functional     |
| `/discover-projects`    | ⚠️     | 70%          | Missing: Application flow           |
| `/how-it-works`         | ✅     | 100%         | Information only                    |
| `/about`                | ✅     | 100%         | Information only                    |
| `/whitepaper`           | ✅     | 100%         | Information only                    |
| `/start-mission`        | ✅     | 100%         | Information only                    |
| `/wizard`               | ✅     | 90%          | Missing: Backend integration        |
| `/dashboard`            | ⚠️     | 40%          | Only Overview tab functional        |
| `/cofounder-dashboard`  | ⚠️     | 35%          | Discover tab works, others empty    |
| `/create-mini-mission`  | ✅     | 85%          | Missing: Backend integration        |
| `/proposal-review`      | ⚠️     | 60%          | Missing: Negotiation, work tracking |
| `/liquidity-wizard`     | ✅     | 85%          | Missing: Return navigation          |

**Overall Application Completeness: ~65%**

---

## 8. RECOMMENDED IMPLEMENTATION PRIORITY

### Phase 1: Complete Core Flows (MVP)
1. Authentication system (Wallet Connect)
2. Proposal submission form (Co-founder -> Founder)
3. Backend API integration for real data
4. Basic work tracking & approval system

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

**Last Review:** 2025-11-09  
**Next Review:** After next feature implementation

