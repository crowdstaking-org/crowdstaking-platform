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
This is the "permissionless" input channel [cf. Vision 26]. Here pioneers submit their own ideas [cf. Vision 31] to build the platform. The process must be frictionless and securely store data in our backend.

### User Story (The "What")
"As a connected pioneer, I want to fill out a clear form to submit my proposal (my idea, my deliverable, and my $CSTAKE request) to the foundation."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Proposal Form Display**
- **GIVEN** I am on the dashboard and have connected my wallet
- **WHEN** I click "Make a Proposal" (e.g., on URL `/dashboard/propose`)
- **THEN** I see a form with the following fields:
  1. Title (text field, max 100 characters)
  2. Description (textarea, Markdown-capable, "What is your idea and how does it advance the mission?")
  3. Deliverable (textarea, Markdown-capable, "What is the concrete result? e.g., link to GitHub PR")
  4. Requested $CSTAKE Tokens (number field, > 0)

**AC2: Proposal Submission**
- **GIVEN** I fill out the form and click "Submit Proposal"
- **WHEN** the submission is successful
- **THEN** the form data is saved in the backend database together with my wallet address and status `pending_review`
- **AND** I am redirected to my Dashboard (Feature MVP-005) where I see my new proposal in the list

### Technical Specifications (The "How")

**Stack:**
- Frontend: React
- Backend: Supabase, Firebase, or Node.js/Postgres

**Data Model (Schema):**

Create a `proposals` table in the database:

```sql
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  creator_wallet_address TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverable TEXT NOT NULL,
  requested_cstake_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  -- Status values: 'pending_review', 'counter_offer_pending', 'foundation_approved', 
  --                'pioneer_approved', 'work_in_progress', 'completed', 'rejected'
  foundation_offer_cstake_amount NUMERIC,
  foundation_notes TEXT
);
```

**API Endpoints:**

- `POST /api/proposals`
  - Accepts form data
  - Performs server-side signature verification (to prove wallet ownership)
  - Saves proposal to `proposals` table
  - Returns created proposal object

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
This is the "Wizard of Oz" part [cf. Vision 32]. We (the foundation) act as the AI mediator. This feature is an admin panel for us and an action center for the pioneer to execute the "Double Handshake" [cf. Vision 35, 36].

### User Story (Admin)
"As a foundation admin, I want to see all proposals with status `pending_review` in a protected area and react to them (reject, make counter-offer, or accept)."

### User Story (Pioneer)
"As a pioneer, I want to see the feedback/counter-offer from the foundation in my dashboard and react to it (accept or reject)."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Admin Actions**
- **GIVEN** an admin is in the admin panel
- **WHEN** they open a proposal with status `pending_review`
- **THEN** they have three actions:
  1. **[Reject]**: Adds a justification (`foundation_notes`). Sets status to `rejected`.
  2. **[Counter-Offer]**: Enters a new amount (`foundation_offer_cstake_amount`) and a note (`foundation_notes`). Sets status to `counter_offer_pending`.
  3. **[Accept]**: Accepts `requested_cstake_amount`. Sets status to `foundation_approved`.

**AC2: Pioneer Response to Counter-Offer**
- **GIVEN** a pioneer opens their dashboard and sees a proposal with status `counter_offer_pending`
- **WHEN** they open the proposal
- **THEN** they see the counter-offer and note. They have two actions:
  1. **[Reject]**: Sets status to `rejected`.
  2. **[Accept]**: Sets status to `pioneer_approved`. **This triggers the call to Feature MVP-004.**

**AC3: Pioneer Acceptance of Foundation Approval**
- **GIVEN** a pioneer sees a proposal with status `foundation_approved`
- **WHEN** they open the proposal
- **THEN** they have one action:
  1. **[Accept & Start]**: Sets status to `pioneer_approved`. **This triggers the call to Feature MVP-004.**

### Technical Specifications (The "How")

**Stack:**
- Backend: API logic
- Frontend: Admin UI & Pioneer UI

**Data Model (Schema):**
- Uses the `proposals` table from Feature MVP-002
- Status transitions are central here

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

- `GET /api/proposals/admin`
  - **Auth**: Admin only
  - Returns all proposals

- `PUT /api/proposals/admin/:id`
  - **Auth**: Admin only
  - Updates a proposal (admin actions: reject, counter-offer, accept)
  - Body: `{ action: 'reject' | 'counter_offer' | 'accept', foundation_offer_cstake_amount?: number, foundation_notes?: string }`

- `PUT /api/proposals/respond/:id`
  - **Auth**: Authenticated as pioneer (must be proposal creator)
  - Updates a proposal (pioneer actions: accept/reject offer)
  - Body: `{ action: 'accept' | 'reject' }`
  - If action is 'accept' and current status is `counter_offer_pending` or `foundation_approved`:
    - Set status to `pioneer_approved`
    - Trigger smart contract call (MVP-004 createAgreement)

**Routes:**
- `/admin/proposals` - Admin panel
- `/dashboard/proposals/:id` - Proposal detail view for pioneer

### AI Notes
- This is a critical workflow. Build a state machine for status transitions to prevent invalid states.
- Use middleware to enforce proper authentication and authorization.
- The `PUT /api/proposals/respond/:id` endpoint must be the trigger for the smart contract call (Feature MVP-004) after setting the status to `pioneer_approved` in the DB.
- Log all status changes with timestamps for audit trail.
- Consider adding a `status_history` table for tracking all transitions.

---

## MVP-004: Der "Vesting & Transfer" Contract (Die Treuhand-Bank)

### Feature-ID
MVP-004

### Feature-Name
Der "Vesting & Transfer" Contract (Die Treuhand-Bank)

### Context & Goal (The "Why")
This is the "escrow bank" that creates trust [cf. Vision 38]. Once the "Double Handshake" (MVP-003) is complete, the agreed $CSTAKE tokens must be demonstrably reserved (locked) for the pioneer. They are released when the work is confirmed by both parties [cf. Vision 39].

### User Story (System)
"As a system, I want to lock the agreed amount of $CSTAKE in a smart contract after a `pioneer_approved` event, bound to the pioneer's wallet and the proposal ID."

### User Story (Pioneer & Foundation)
"As a pioneer or foundation, I want to mark the work as 'done', and when both parties have done this, the tokens should be automatically released."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Agreement Creation**
- **GIVEN** the backend (Feature MVP-003) has marked a proposal as `pioneer_approved`
- **WHEN** the `createAgreement` process is triggered
- **THEN** the backend (as foundation wallet) calls a function in the smart contract that pulls $CSTAKE tokens from the foundation into the contract and assigns them to a new Agreement (with `proposal_id`, `contributor_address`, `amount`)

**AC2: Pioneer Work Confirmation**
- **GIVEN** an agreement exists in the contract
- **WHEN** the pioneer calls the function `confirmWorkDone(proposal_id)`
- **THEN** a flag `pioneer_confirmed` for this agreement is set to `true` in the contract

**AC3: Foundation Release**
- **GIVEN** an agreement exists and `pioneer_confirmed == true`
- **WHEN** the foundation (admin wallet) calls the function `releaseAgreement(proposal_id)`
- **THEN** the contract checks if `pioneer_confirmed == true`, sets the foundation flag `foundation_confirmed` to `true`, and transfers the locked $CSTAKE tokens to the `contributor_address`
- **AND** the proposal DB status is set to `completed`

### Technical Specifications (The "How")

**Stack:**
- Smart Contract: Solidity
- Backend: For calling `createAgreement`

**Contract Functions (VestingContract):**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VestingContract is Ownable {
    // Struct for the agreement
    struct Agreement {
        address contributor;
        uint256 amount;
        bool pioneer_confirmed;
        bool foundation_confirmed;
        bool exists;
    }

    // Mapping from proposal_id to Agreement
    mapping(uint256 => Agreement) public agreements;

    // Address of the $CSTAKE (ERC20) token
    IERC20 public cstakeToken;

    // Address of the foundation (allowed to create agreements)
    address public foundation_wallet;

    // Events
    event AgreementCreated(uint256 indexed proposal_id, address indexed contributor, uint256 amount);
    event PioneerConfirmed(uint256 indexed proposal_id);
    event AgreementReleased(uint256 indexed proposal_id, address indexed contributor, uint256 amount);

    constructor(address _cstakeToken, address _foundation_wallet) {
        cstakeToken = IERC20(_cstakeToken);
        foundation_wallet = _foundation_wallet;
    }

    modifier onlyFoundation() {
        require(msg.sender == foundation_wallet, "Not foundation");
        _;
    }

    // Foundation function: Creates and locks tokens
    function createAgreement(uint256 _proposal_id, address _contributor, uint256 _amount) external onlyFoundation {
        require(!agreements[_proposal_id].exists, "Agreement exists");
        require(_contributor != address(0), "Invalid contributor");
        require(_amount > 0, "Amount must be > 0");
        
        // Pull tokens from foundation into this contract
        cstakeToken.transferFrom(msg.sender, address(this), _amount);
        
        agreements[_proposal_id] = Agreement(_contributor, _amount, false, false, true);
        emit AgreementCreated(_proposal_id, _contributor, _amount);
    }

    // Pioneer function: Confirms work
    function confirmWorkDone(uint256 _proposal_id) external {
        Agreement storage agreement = agreements[_proposal_id];
        require(agreement.exists, "No agreement");
        require(msg.sender == agreement.contributor, "Not contributor");
        require(!agreement.pioneer_confirmed, "Already confirmed");
        
        agreement.pioneer_confirmed = true;
        emit PioneerConfirmed(_proposal_id);
    }

    // Foundation function: Confirms & releases
    function releaseAgreement(uint256 _proposal_id) external onlyFoundation {
        Agreement storage agreement = agreements[_proposal_id];
        require(agreement.exists, "No agreement");
        require(agreement.pioneer_confirmed, "Pioneer not confirmed");
        require(!agreement.foundation_confirmed, "Already released");

        agreement.foundation_confirmed = true;
        uint256 amount = agreement.amount;

        // Release tokens
        cstakeToken.transfer(agreement.contributor, amount);
        emit AgreementReleased(_proposal_id, agreement.contributor, amount);

        // Clean up (saves gas)
        delete agreements[_proposal_id];
    }

    // View function: Get agreement details
    function getAgreement(uint256 _proposal_id) external view returns (Agreement memory) {
        return agreements[_proposal_id];
    }

    // Admin function: Update foundation wallet
    function setFoundationWallet(address _newFoundation) external onlyOwner {
        require(_newFoundation != address(0), "Invalid address");
        foundation_wallet = _newFoundation;
    }
}
```

**Backend Integration:**

After setting status to `pioneer_approved` in the database:

1. Convert UUID proposal ID to uint256 (e.g., using keccak256 hash of UUID string)
2. Get agreed amount (use `foundation_offer_cstake_amount` if exists, else `requested_cstake_amount`)
3. Call `createAgreement(proposal_id_uint256, contributor_address, amount)` from foundation wallet
4. Update proposal status to `work_in_progress`

**API Endpoints:**

- `POST /api/contracts/create-agreement`
  - **Auth**: Internal/system only
  - Triggered automatically when proposal status becomes `pioneer_approved`
  - Calls smart contract `createAgreement` function

- `POST /api/contracts/confirm-work/:proposalId`
  - **Auth**: Authenticated pioneer (must be proposal creator)
  - Calls smart contract `confirmWorkDone` function from pioneer's wallet

- `POST /api/contracts/release-agreement/:proposalId`
  - **Auth**: Admin only
  - Calls smart contract `releaseAgreement` function from foundation wallet
  - Updates DB status to `completed`

### AI Notes
- **SECURITY CRITICAL**: Use OpenZeppelin libraries (IERC20, Ownable or AccessControl for `onlyFoundation`)
- The `createAgreement` call must be triggered by a secure backend worker that manages the foundation wallet
- The proposal UUID from DB must be converted to uint256 to serve as a key in the contract (consider using keccak256(abi.encodePacked(uuid_string)))
- Consider implementing pausable functionality for emergency situations
- Thoroughly test all state transitions and edge cases
- Implement proper error handling for failed transactions
- Consider gas optimization for frequently called functions
- Add re-entrancy guards if needed (though OpenZeppelin ERC20 is safe)

---

## MVP-005: Das "Miteigentümer-Dashboard" (Die Belohnungsschleife)

### Feature-ID
MVP-005

### Feature-Name
Das "Miteigentümer-Dashboard" (Die Belohnungsschleife)

### Context & Goal (The "Why")
This is the pioneer's "home". It makes co-ownership tangible by displaying the real, liquid market value of the $CSTAKE balance [cf. Vision 47] and serves as the action center for all proposals.

### User Story (The "What")
"As a pioneer, I want to see a dashboard after connecting my wallet that displays my current $CSTAKE balance, its live market value in USD, and a list of all my proposals (with status and next actions)."

### Acceptance Criteria (ACs) (The "Target")

**AC1: Dashboard Display**
- **GIVEN** I connect my wallet
- **WHEN** I load the dashboard page (`/dashboard`)
- **THEN** I see:

  1. **Module 1: My Wallet**
     - My $CSTAKE balance (read from wallet via Wagmi/Ethers.js)
     - Current $CSTAKE price (read from backend API endpoint that fetches DEX price [cf. Vision 47])
     - Total USD value (balance * price)

  2. **Module 2: My Proposals**
     - A list of all my proposals (read from DB via `GET /api/proposals/me`)
     - Each entry shows: Title, Status, Requested/Agreed Amount
     - If a proposal requires action (e.g., status `counter_offer_pending`), an "Action Required" button is displayed that leads to proposal details (Feature MVP-003)

  3. **Module 3: My Actions (Context-sensitive)**
     - If I have a proposal with status `work_in_progress`, I see a "Work Completed" button (that triggers `confirmWorkDone` from Feature MVP-004)

### Technical Specifications (The "How")

**Stack:**
- Frontend: React, Wagmi/Ethers.js
- Backend: For price API

**Data Model (Schema):**
- Uses existing `proposals` table

**API Endpoints:**

- `GET /api/proposals/me`
  - **Auth**: Authenticated user
  - Returns all proposals from `proposals` table where `creator_wallet_address` equals connected wallet
  - Response: Array of proposal objects with all fields

- `GET /api/cstake-price`
  - **Auth**: Public or authenticated
  - Returns current $CSTAKE token price from DEX
  - **IMPORTANT**: This price must be cached server-side (e.g., for 60 seconds) to avoid excessive RPC calls and rate limiting
  - Response: `{ price: number, currency: 'USD', timestamp: string }`

- `POST /api/proposals/confirm-work/:id`
  - **Auth**: Authenticated pioneer (must be proposal creator)
  - Triggers `confirmWorkDone` smart contract call (Feature MVP-004) for specified proposal
  - Updates proposal status tracking

**Routes:**
- `/dashboard` - Main dashboard
- `/dashboard/propose` - Create new proposal (from MVP-002)
- `/dashboard/proposals/:id` - Proposal detail view

**Frontend Components:**

```typescript
// Dashboard structure
- Dashboard
  ├─ WalletModule
  │  ├─ BalanceDisplay (reads from contract)
  │  ├─ PriceDisplay (reads from /api/cstake-price)
  │  └─ ValueDisplay (calculated: balance * price)
  ├─ ProposalsModule
  │  ├─ ProposalsList (reads from /api/proposals/me)
  │  └─ ProposalCard (shows status, amount, actions)
  └─ ActionsModule
     └─ ConfirmWorkButton (context-sensitive)
```

**Price Fetching Implementation:**

Server-side price fetching service:

```typescript
// Backend: services/priceService.ts
import { ethers } from 'ethers';

let cachedPrice: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 60 seconds

export async function getCSTAKEPrice(): Promise<number> {
  const now = Date.now();
  
  // Return cached price if still valid
  if (cachedPrice && (now - cachedPrice.timestamp) < CACHE_DURATION) {
    return cachedPrice.price;
  }

  // Fetch from Uniswap V2/V3 pool
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const poolAddress = process.env.CSTAKE_POOL_ADDRESS;
  
  // Uniswap V2 example (adjust for V3 if needed)
  const poolABI = ['function getReserves() view returns (uint112, uint112, uint32)'];
  const poolContract = new ethers.Contract(poolAddress, poolABI, provider);
  
  const [reserve0, reserve1] = await poolContract.getReserves();
  const price = Number(reserve1) / Number(reserve0); // Adjust based on token order
  
  // Cache the result
  cachedPrice = { price, timestamp: now };
  
  return price;
}
```

### AI Notes
- **Price querying (`/api/cstake-price`) must NEVER be done client-side**
- Build a robust backend service (e.g., with Ethers.js) that queries the Uniswap pool contract to determine price, and caches it
- The dashboard frontend must be reactive and automatically update when wallet status or proposal status changes
- Use Wagmi hooks for wallet connection and balance reading
- Implement error states for when wallet is not connected, price fetch fails, etc.
- Consider using React Query or SWR for data fetching with automatic revalidation
- Display loading states during data fetching
- Make the dashboard the main entry point after wallet connection
- Implement proper wallet connection flow (connect button, account display, disconnect option)
- Consider adding a "Connect Wallet" wall if user tries to access dashboard without connection

---

## Implementation Priority & Dependencies

### Phase 1: Foundation
1. **MVP-001** (Missions Board) - No dependencies
2. **MVP-002** (Proposal Engine) - Depends on: Database setup, wallet auth

### Phase 2: Core Logic
3. **MVP-003** (Manual Mediator) - Depends on: MVP-002, admin auth
4. **MVP-004** (Vesting Contract) - Depends on: MVP-003, $CSTAKE token deployment

### Phase 3: User Experience
5. **MVP-005** (Dashboard) - Depends on: MVP-002, MVP-004, DEX pool setup

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
4. $CSTAKE tokens locked in vesting
5. $CSTAKE price (tracked over time)
6. Active pioneers (unique wallets)
7. Smart contract events (creation, confirmation, release)

### Error Tracking
- Frontend: Sentry or similar
- Backend: Application logs + Sentry
- Smart Contracts: Event monitoring + Tenderly

---

*Last Updated: November 2025*
*Version: 1.0.0*

