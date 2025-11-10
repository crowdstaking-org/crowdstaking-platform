# CrowdStaking User Flow Diagram

**Last Updated:** 2025-11-10 (Dashboard Architecture Fix - Public vs Private Routes)
**Status:** Current state of codebase - marks gaps and dead ends

**Recent Updates:**
- ✅ Dashboard privatisiert - nur für authentifizierte Founder
- ✅ Öffentliche Projekt-Detail-Seiten (/projects/[projectId])
- ✅ Öffentliche Mission-Detail-Seiten (/projects/[projectId]/missions/[missionId])
- ✅ Thirdweb Multi-Auth (Email + Wallet + Google)
- ✅ Navigation-Links korrigiert (ProjectCard → öffentliche Seiten)
- ✅ ProtectedButton/ConnectWalletModal entfernt
- ✅ Phase 4: Complete Double Handshake implementation
- ✅ Admin panel for proposal review (/admin/proposals)
- ✅ Admin actions: Accept, Reject, Counter-Offer
- ✅ Pioneer response UI in Cofounder Dashboard
- ✅ Full status state machine (5 states)
- ✅ Phase 3: Complete proposal submission flow
- ✅ Added /dashboard/propose with full-featured form
- ✅ Real-time validation & Markdown support
- ✅ API endpoints for proposal CRUD operations

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

## 2. ADMIN JOURNEY (Review & Negotiate Proposals) ✅ NEW (Phase 4)

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

## 3. CO-FOUNDER JOURNEY (Discover & Contribute)

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

## 3. BLOG SYSTEM (Public + Super-Admin) ✅ NEW (Phase 6)

```
[HOME PAGE]
    │
    │ (Click "Blog" in Nav)
    │
    ▼
[BLOG OVERVIEW] /blog
    │
    ├─ Hero Section: "CrowdStaking Blog"
    ├─ Grid of Blog Post Cards:
    │  ├─ Title & Excerpt (auto-generated, 200 chars)
    │  ├─ Author Info (display name, avatar)
    │  ├─ Published Date
    │  ├─ Tags (chips)
    │  └─ View Count
    │
    ├─ Pagination (20 posts per page)
    │
    │ (Click on Blog Post Card)
    │
    ▼
[BLOG POST DETAIL] /blog/[slug]
    │
    ├─ Full Post Content:
    │  ├─ Title
    │  ├─ Author Info (with avatar)
    │  ├─ Published Date & View Count
    │  ├─ Tags
    │  └─ Markdown Content (with remarkGfm)
    │
    ├─ Comment Section:
    │  │
    │  ├─ (If Authenticated)
    │  │  │
    │  │  ├─ Comment Form (max 1000 chars)
    │  │  │  └──> (Submit Comment)
    │  │  │       └──> Success: Comment added
    │  │  │
    │  │  └─ Comments List:
    │  │     ├─ Author Info & Date
    │  │     ├─ Comment Content
    │  │     └─ (Delete Own Comments)
    │  │         └──> Confirmation Modal
    │  │              └──> Success: Comment deleted
    │  │
    │  └─ (If Not Authenticated)
    │     └──> "Please connect wallet to comment" message
    │
    └─ Back to Blog Link


[SUPER-ADMIN FLOW]
    │
    │ (Super-Admin Wallet: dispatcher@crowdstaking.org or th@consensus.ventures)
    │
    ▼
[ADMIN BLOG MANAGEMENT] /admin/blog
    │
    ├─ Statistics & Actions:
    │  ├─ "New Post" Button ──────────────────┐
    │  └─ Posts Table (all posts, incl. drafts)│
    │     ├─ Title, Slug                       │
    │     ├─ Status Badge (draft/published)    │
    │     ├─ Published Date                    │
    │     ├─ View Count                        │
    │     ├─ Tags                              │
    │     └─ Actions:                          │
    │        ├─ Edit ─────────────────────┐   │
    │        └─ Delete (with confirmation) │   │
    │                                      │   │
    │                                      │   │
    │  ┌───────────────────────────────────┘   │
    │  │                                       │
    │  │  ┌────────────────────────────────────┘
    │  │  │
    │  ▼  ▼
    │  [CREATE/EDIT POST]
    │  /admin/blog/new or /admin/blog/[id]/edit
    │     │
    │     ├─ Blog Post Form:
    │     │  ├─ Title (1-200 chars)
    │     │  ├─ Slug Preview (auto-generated)
    │     │  ├─ Content (Markdown, max 50000 chars)
    │     │  ├─ Tags (comma-separated)
    │     │  ├─ Status (draft/published)
    │     │  └─ Excerpt Preview (auto-generated)
    │     │
    │     ├─ Features:
    │     │  ├─ Markdown Editor (write/preview tabs)
    │     │  ├─ Preview Modal (full post preview)
    │     │  └─ Real-time validation
    │     │
    │     ├─ (Submit)
    │     │   └──> Success: Post created/updated
    │     │        └──> Redirect to /admin/blog
    │     │
    │     └─ (Cancel) ──> Back to /admin/blog


✅ COMPLETED (Phase 6): Blog System
    - Database: blog_posts, blog_comments tables
    - Super-Admin Auth: isSuperAdmin() check via email
    - Admin API: CRUD operations for posts
    - Public API: Published posts + comments
    - React Query Hooks: useBlog.ts
    - Admin UI: Post management, form, pages
    - Public UI: Blog overview, post detail, comments
    - Navigation: "Blog" link added
    
    Key Features:
    - Markdown support with preview
    - Tag system (TEXT[] array)
    - View counter
    - Comment system (create/delete own)
    - Slug auto-generation
    - Excerpt auto-generation
    - Draft/Published status
```

---

## 4. INFORMATION PAGES (Read-only Content)

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

## 5. NAVIGATION & CONTEXT SWITCHING

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
    ├─ "Blog" ───────────────────────────────────────> [BLOG] ✅ NEW
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

## 6. CRITICAL GAPS & DEAD ENDS

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

## 7. COMPLETE USER JOURNEY MAP (Ideal vs Reality)

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

## 8. PAGE INVENTORY & COMPLETENESS STATUS

| Route                                | Status | Completeness | Notes                              |
|--------------------------------------|--------|--------------|-------------------------------------|
| `/`                                  | ✅     | 95%          | Landing page - fully functional     |
| `/discover-projects`                 | ✅     | 85%          | Has proposal CTA (Phase 3)          |
| `/projects/[projectId]`              | ✅     | 90%          | **NEW** - Public project details    |
| `/projects/[projectId]/missions/[id]`| ✅     | 90%          | **NEW** - Public mission details    |
| `/how-it-works`                      | ✅     | 100%         | Information only                    |
| `/about`                             | ✅     | 100%         | Information only                    |
| `/whitepaper`                        | ✅     | 100%         | Information only                    |
| `/start-mission`                     | ✅     | 100%         | Information only                    |
| `/wizard`                            | ✅     | 90%          | Missing: Backend integration        |
| `/dashboard`                         | ✅     | 75%          | **UPDATED** - Now private, Auth required |
| `/cofounder-dashboard`               | ✅     | 65%          | Proposal flow complete (Phase 3)    |
| `/dashboard/propose`                 | ✅     | 95%          | Full proposal form                  |
| `/create-mini-mission`               | ✅     | 85%          | Missing: Backend integration        |
| `/proposal-review`                   | ⚠️     | 60%          | Missing: Negotiation, work tracking |
| `/liquidity-wizard`                  | ✅     | 85%          | Missing: Return navigation          |
| `/submit-proposal`                   | ⚠️     | 60%          | Old version - replaced by /dashboard/propose |
| `/blog`                              | ✅     | 100%         | **NEW** - Public blog overview (Phase 6) |
| `/blog/[slug]`                       | ✅     | 100%         | **NEW** - Blog post detail + comments |
| `/admin/blog`                        | ✅     | 100%         | **NEW** - Super-admin blog management |
| `/admin/blog/new`                    | ✅     | 100%         | **NEW** - Create blog post          |
| `/admin/blog/[id]/edit`              | ✅     | 100%         | **NEW** - Edit blog post            |

**Overall Application Completeness: ~82%** (+2% from Blog System)

---

## 9. RECOMMENDED IMPLEMENTATION PRIORITY

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

**Last Review:** 2025-11-10 (Blog System Implementation - Phase 6)
**Next Review:** After next feature implementation

**Recent Update:** Added complete Blog System with:
- Public blog pages (/blog, /blog/[slug])
- Super-admin management (/admin/blog)
- Comment system with authentication
- Markdown support and auto-generated slugs/excerpts
- Navigation link added

