<!-- a4c4d48a-bc94-4db7-b095-2a2161e95221 b8f93285-b9be-462a-b64e-c04b1a88395c -->
# Phase 5 Refinement: Minimal-Invasive Smart Contract Development

## Context: What We've Built

### Phase 1-4 Complete ✅

- **Database:** proposals table with status field
- **Auth:** Secure wallet authentication
- **Proposals:** Co-founders can submit proposals
- **Double Handshake:** Admin reviews, pioneer accepts
- **Final State:** Proposals reach 'accepted' status

### What Happens Next?

When a proposal reaches 'accepted' status, tokens need to be:

1. **Locked in escrow** (createAgreement)
2. **Work completed** by pioneer
3. **Confirmed** by pioneer (confirmWorkDone)
4. **Verified** by admin
5. **Released** to pioneer (releaseAgreement)

This requires a **smart contract** to manage the escrow trustlessly.

## Phase 5 Goal: Token Escrow via Smart Contract

Implement VestingContract that:

- Locks $CSTAKE tokens when agreement is reached
- Allows pioneer to confirm work completion
- Allows admin to release tokens after verification
- Provides transparent, on-chain record

## Minimal-Invasive Strategy

**What we'll do:**

- Write minimal Solidity contract (150 lines)
- Deploy to testnet first (Base Sepolia)
- Use ThirdWeb for deployment (no Hardhat setup)
- Backend service to interact with contract
- Simple UUID to uint256 conversion
- Manual admin wallet for foundation

**What we'll skip:**

- ❌ Complex Hardhat/Foundry setup (use ThirdWeb)
- ❌ Extensive test suite (basic tests only)
- ❌ Gas optimization (premature)
- ❌ Multi-sig admin (single wallet for MVP)
- ❌ Pausable functionality (add later if needed)
- ❌ Upgradeable contracts (deploy new one if needed)

## Critical Decision: Use ThirdWeb for Deployment

**Why ThirdWeb over Hardhat?**

- Already integrated in project
- One-click deployment via dashboard
- Automatic verification on Basescan
- No complex tooling setup
- Can still write custom Solidity

**Trade-off:** Less local testing, but faster MVP.

## Smart Contract Specification

### VestingContract.sol (Simplified)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VestingContract {
    struct Agreement {
        address contributor;
        uint256 amount;
        bool pioneerConfirmed;
        bool foundationConfirmed;
        bool exists;
    }
    
    mapping(uint256 => Agreement) public agreements;
    
    IERC20 public immutable cstakeToken;
    address public foundationWallet;
    
    event AgreementCreated(uint256 indexed proposalId, address indexed contributor, uint256 amount);
    event PioneerConfirmed(uint256 indexed proposalId);
    event AgreementReleased(uint256 indexed proposalId, address indexed contributor, uint256 amount);
    
    constructor(address _cstakeToken, address _foundationWallet) {
        cstakeToken = IERC20(_cstakeToken);
        foundationWallet = _foundationWallet;
    }
    
    modifier onlyFoundation() {
        require(msg.sender == foundationWallet, "Not foundation");
        _;
    }
    
    function createAgreement(uint256 _proposalId, address _contributor, uint256 _amount) 
        external 
        onlyFoundation 
    {
        require(!agreements[_proposalId].exists, "Agreement exists");
        require(_contributor != address(0), "Invalid contributor");
        require(_amount > 0, "Amount must be > 0");
        
        // Pull tokens from foundation into contract
        require(
            cstakeToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        agreements[_proposalId] = Agreement(_contributor, _amount, false, false, true);
        emit AgreementCreated(_proposalId, _contributor, _amount);
    }
    
    function confirmWorkDone(uint256 _proposalId) external {
        Agreement storage agreement = agreements[_proposalId];
        require(agreement.exists, "No agreement");
        require(msg.sender == agreement.contributor, "Not contributor");
        require(!agreement.pioneerConfirmed, "Already confirmed");
        
        agreement.pioneerConfirmed = true;
        emit PioneerConfirmed(_proposalId);
    }
    
    function releaseAgreement(uint256 _proposalId) external onlyFoundation {
        Agreement storage agreement = agreements[_proposalId];
        require(agreement.exists, "No agreement");
        require(agreement.pioneerConfirmed, "Pioneer not confirmed");
        require(!agreement.foundationConfirmed, "Already released");
        
        agreement.foundationConfirmed = true;
        uint256 amount = agreement.amount;
        
        // Release tokens to contributor
        require(
            cstakeToken.transfer(agreement.contributor, amount),
            "Transfer failed"
        );
        
        emit AgreementReleased(_proposalId, agreement.contributor, amount);
        delete agreements[_proposalId]; // Save gas
    }
    
    function getAgreement(uint256 _proposalId) 
        external 
        view 
        returns (Agreement memory) 
    {
        return agreements[_proposalId];
    }
}
```

**Total: ~100 lines, simple and auditable.**

## Refined Actionable Tickets

### PHASE-5-TICKET-001: Write VestingContract.sol

**Priority:** P0 | **Time:** 2 hours

**Goal:** Write complete smart contract in Solidity

**What to Do:**

1. Create `contracts/VestingContract.sol`
2. Implement complete contract as specified above
3. Add NatSpec comments for documentation
4. Ensure compiles with Solidity ^0.8.20

**Files to Create:**

- `contracts/VestingContract.sol`

**Definition of Done:**

- [ ] Contract code complete with all functions
- [ ] Uses OpenZeppelin IERC20
- [ ] onlyFoundation modifier works
- [ ] All events defined and emitted
- [ ] NatSpec documentation added
- [ ] Compiles without errors (can test on Remix)
- [ ] No obvious security issues

**Contract Functions:**

- `createAgreement(proposalId, contributor, amount)` - Foundation only
- `confirmWorkDone(proposalId)` - Contributor only
- `releaseAgreement(proposalId)` - Foundation only
- `getAgreement(proposalId)` - View function

---

### PHASE-5-TICKET-002: Deploy Mock $CSTAKE Token (Testnet Only)

**Priority:** P0 | **Time:** 30 min

**Goal:** Deploy a simple ERC20 token to Base Sepolia for testing

**What to Do:**

1. Use ThirdWeb dashboard to deploy ERC20 token
2. Name: "CrowdStaking Test Token"
3. Symbol: $CSTAKE
4. Mint 1,000,000 tokens to foundation wallet
5. Save token address

**Definition of Done:**

- [ ] Token deployed to Base Sepolia
- [ ] Token address saved in .env
- [ ] Foundation wallet has 1M tokens
- [ ] Can view token on Base Sepolia Basescan
- [ ] Token contract verified

**Alternative:** Use existing testnet token if available.

**Environment Variable:**

```
CSTAKE_TOKEN_ADDRESS_TESTNET=0x...
```

---

### PHASE-5-TICKET-003: Deploy VestingContract to Testnet

**Priority:** P0 | **Time:** 1 hour

**Goal:** Deploy VestingContract to Base Sepolia using ThirdWeb

**What to Do:**

1. Go to ThirdWeb dashboard
2. Upload VestingContract.sol
3. Deploy to Base Sepolia
4. Constructor params:

   - _cstakeToken: from PHASE-5-TICKET-002
   - _foundationWallet: admin wallet address

5. Verify contract on Basescan
6. Save contract address

**Files to Edit:**

- `.env.local` (add contract address)
- `.env.example` (document)

**Definition of Done:**

- [ ] Contract deployed to Base Sepolia
- [ ] Contract verified on Basescan
- [ ] Constructor parameters correct
- [ ] Can view contract on block explorer
- [ ] Contract address saved in environment
- [ ] Foundation wallet approved for token spending

**Environment Variables:**

```
VESTING_CONTRACT_ADDRESS_TESTNET=0x...
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

**Important:** Foundation wallet must approve VestingContract to spend tokens:

```
CSTAKE.approve(vestingContractAddress, MAX_UINT256)
```

---

### PHASE-5-TICKET-004: Create UUID to uint256 Conversion Utility

**Priority:** P0 | **Time:** 30 min

**Goal:** Convert proposal UUID from database to uint256 for smart contract

**What to Do:**

1. Create `src/lib/contracts/utils.ts`
2. Implement uuidToUint256() function
3. Use keccak256 hash of UUID string
4. Test with sample UUIDs
5. Ensure deterministic conversion

**Files to Create:**

- `src/lib/contracts/utils.ts`

**Definition of Done:**

- [ ] Function converts UUID string to bigint
- [ ] Conversion is deterministic (same UUID = same uint256)
- [ ] Different UUIDs produce different uint256s
- [ ] Works with ethers.js types
- [ ] Unit tests pass
- [ ] TypeScript types correct

**Code Pattern:**

```typescript
// src/lib/contracts/utils.ts
import { keccak256, toUtf8Bytes } from 'ethers'

export function uuidToUint256(uuid: string): bigint {
  // Remove hyphens from UUID
  const cleanUuid = uuid.replace(/-/g, '')
  
  // Hash the UUID to get uint256
  const hash = keccak256(toUtf8Bytes(cleanUuid))
  
  // Convert hex string to bigint
  return BigInt(hash)
}

// Example usage:
// uuidToUint256('123e4567-e89b-12d3-a456-426614174000')
// → 12345678901234567890n
```

---

### PHASE-5-TICKET-005: Create Contract Interaction Service

**Priority:** P0 | **Time:** 2 hours

**Goal:** Build backend service to interact with VestingContract

**What to Do:**

1. Install ethers.js: `npm install ethers`
2. Create `src/lib/contracts/vestingService.ts`
3. Implement createAgreement function
4. Implement releaseAgreement function
5. Implement getAgreement function (read-only)
6. Setup provider and signer

**Files to Create:**

- `src/lib/contracts/vestingService.ts`
- `src/lib/contracts/abi.ts` (contract ABI)

**Definition of Done:**

- [ ] ethers.js installed
- [ ] Contract ABI extracted and imported
- [ ] Can call createAgreement from backend
- [ ] Can call releaseAgreement from backend
- [ ] Can read agreement data
- [ ] Foundation wallet private key securely loaded
- [ ] Error handling for failed transactions
- [ ] Gas estimation working

**Code Pattern:**

```typescript
// src/lib/contracts/vestingService.ts
import { ethers } from 'ethers'
import { VESTING_ABI } from './abi'
import { uuidToUint256 } from './utils'

const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL!
const CONTRACT_ADDRESS = process.env.VESTING_CONTRACT_ADDRESS_TESTNET!
const FOUNDATION_PRIVATE_KEY = process.env.FOUNDATION_WALLET_PRIVATE_KEY!

export class VestingService {
  private provider: ethers.JsonRpcProvider
  private signer: ethers.Wallet
  private contract: ethers.Contract
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL)
    this.signer = new ethers.Wallet(FOUNDATION_PRIVATE_KEY, this.provider)
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      VESTING_ABI,
      this.signer
    )
  }
  
  async createAgreement(
    proposalId: string,
    contributorAddress: string,
    amount: bigint
  ): Promise<string> {
    try {
      const proposalIdUint = uuidToUint256(proposalId)
      
      // Call contract function
      const tx = await this.contract.createAgreement(
        proposalIdUint,
        contributorAddress,
        amount
      )
      
      // Wait for confirmation
      const receipt = await tx.wait()
      
      return receipt.hash
    } catch (error) {
      console.error('Create agreement failed:', error)
      throw error
    }
  }
  
  async releaseAgreement(proposalId: string): Promise<string> {
    try {
      const proposalIdUint = uuidToUint256(proposalId)
      
      const tx = await this.contract.releaseAgreement(proposalIdUint)
      const receipt = await tx.wait()
      
      return receipt.hash
    } catch (error) {
      console.error('Release agreement failed:', error)
      throw error
    }
  }
  
  async getAgreement(proposalId: string) {
    const proposalIdUint = uuidToUint256(proposalId)
    return await this.contract.getAgreement(proposalIdUint)
  }
}

// Singleton instance
export const vestingService = new VestingService()
```

---

### PHASE-5-TICKET-006: Add Contract Fields to Proposals Table

**Priority:** P1 | **Time:** 20 min

**Goal:** Track contract interaction data in database

**What to Do:**

1. Add migration for new fields
2. Add columns:

   - `contract_agreement_tx` - Transaction hash for createAgreement
   - `contract_release_tx` - Transaction hash for releaseAgreement
   - `pioneer_confirmed_at` - Timestamp when pioneer confirmed

3. Update Proposal TypeScript type

**Migration SQL:**

```sql
ALTER TABLE proposals
  ADD COLUMN contract_agreement_tx TEXT,
  ADD COLUMN contract_release_tx TEXT,
  ADD COLUMN pioneer_confirmed_at TIMESTAMPTZ;
```

**Definition of Done:**

- [ ] Migration applied
- [ ] New columns exist
- [ ] Proposal type updated
- [ ] No breaking changes

---

### PHASE-5-TICKET-007: API Endpoint - Create Agreement (Auto-trigger)

**Priority:** P0 | **Time:** 1 hour

**Goal:** Automatically create smart contract agreement when proposal is accepted by pioneer

**What to Do:**

1. Update `src/app/api/proposals/respond/[id]/route.ts`
2. When pioneer accepts (status → 'accepted'), trigger contract creation
3. Call vestingService.createAgreement()
4. Save transaction hash to database
5. Update proposal status to 'work_in_progress'

**Files to Edit:**

- `src/app/api/proposals/respond/[id]/route.ts`

**Definition of Done:**

- [ ] When pioneer accepts, contract is called
- [ ] Agreement created on blockchain
- [ ] Transaction hash saved to DB
- [ ] Status updated to 'work_in_progress'
- [ ] Error handling if contract call fails
- [ ] Pioneer sees success message
- [ ] Can view transaction on Basescan

**Code Pattern:**

```typescript
// In respond/[id]/route.ts (UPDATE)
import { vestingService } from '@/lib/contracts/vestingService'

// After pioneer accepts
if (action === 'accept' && ['counter_offer_pending', 'approved'].includes(proposal.status)) {
  try {
    // Determine agreed amount
    const agreedAmount = proposal.foundation_offer_cstake_amount 
      || proposal.requested_cstake_amount
    
    // Create agreement on blockchain
    const txHash = await vestingService.createAgreement(
      proposal.id,
      proposal.creator_wallet_address,
      BigInt(agreedAmount * 1e18) // Convert to wei (assuming 18 decimals)
    )
    
    // Update DB with transaction and new status
    const { data: updated, error } = await supabase
      .from('proposals')
      .update({
        status: 'work_in_progress',
        contract_agreement_tx: txHash,
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    return jsonResponse({ 
      success: true, 
      proposal: updated,
      message: 'Agreement created on blockchain. You can now start work!'
    })
  } catch (error) {
    // Revert status if contract fails
    return errorResponse('Failed to create blockchain agreement', 500)
  }
}
```

---

### PHASE-5-TICKET-008: API Endpoint - Confirm Work (Pioneer)

**Priority:** P0 | **Time:** 45 min

**Goal:** Allow pioneer to confirm work completion via smart contract

**What to Do:**

1. Create `src/app/api/contracts/confirm-work/[id]/route.ts`
2. Verify proposal is in 'work_in_progress' status
3. Verify caller is contributor
4. Call contract confirmWorkDone from pioneer's wallet
5. Update DB with confirmation timestamp

**Files to Create:**

- `src/app/api/contracts/confirm-work/[id]/route.ts`

**Definition of Done:**

- [ ] POST endpoint works
- [ ] Requires pioneer authentication
- [ ] Only works if status is 'work_in_progress'
- [ ] Calls smart contract function
- [ ] Updates pioneer_confirmed_at timestamp
- [ ] Returns success with transaction hash
- [ ] Error handling

**Note:** Pioneer must sign transaction themselves (not foundation wallet).

**Code Pattern:**

```typescript
// src/app/api/contracts/confirm-work/[id]/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wallet = requireAuth(request)
    
    // Get proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (fetchError || !proposal) {
      return errorResponse('Proposal not found', 404)
    }
    
    // Verify caller is creator
    if (proposal.creator_wallet_address.toLowerCase() !== wallet.toLowerCase()) {
      return errorResponse('Forbidden', 403)
    }
    
    // Verify status
    if (proposal.status !== 'work_in_progress') {
      return errorResponse('Work not in progress', 400)
    }
    
    // TODO: Call contract from FRONTEND (pioneer signs transaction)
    // For now, just update timestamp
    // Real implementation needs frontend to call contract directly
    
    const { data: updated, error } = await supabase
      .from('proposals')
      .update({
        pioneer_confirmed_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    return jsonResponse({ 
      success: true, 
      proposal: updated,
      message: 'Work confirmation recorded. Awaiting admin approval.'
    })
  } catch (error) {
    return errorResponse(error.message, 500)
  }
}
```

---

### PHASE-5-TICKET-009: API Endpoint - Release Agreement (Admin)

**Priority:** P0 | **Time:** 45 min

**Goal:** Allow admin to release tokens after verifying work

**What to Do:**

1. Create `src/app/api/contracts/release-agreement/[id]/route.ts`
2. Verify admin authentication
3. Verify pioneer has confirmed work
4. Call vestingService.releaseAgreement()
5. Update status to 'completed'
6. Save release transaction hash

**Files to Create:**

- `src/app/api/contracts/release-agreement/[id]/route.ts`

**Definition of Done:**

- [ ] POST endpoint works
- [ ] Requires admin authentication
- [ ] Verifies pioneer confirmed work first
- [ ] Calls smart contract releaseAgreement
- [ ] Updates status to 'completed'
- [ ] Saves transaction hash
- [ ] Returns success
- [ ] Error handling

**Code Pattern:**

```typescript
// src/app/api/contracts/release-agreement/[id]/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAdmin } from '@/lib/auth/admin'
import { vestingService } from '@/lib/contracts/vestingService'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request)
    
    // Get proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (fetchError || !proposal) {
      return errorResponse('Proposal not found', 404)
    }
    
    // Verify work is in progress and pioneer confirmed
    if (proposal.status !== 'work_in_progress') {
      return errorResponse('Proposal not in progress', 400)
    }
    
    if (!proposal.pioneer_confirmed_at) {
      return errorResponse('Pioneer has not confirmed work completion', 400)
    }
    
    // Release tokens via smart contract
    const txHash = await vestingService.releaseAgreement(proposal.id)
    
    // Update DB
    const { data: updated, error } = await supabase
      .from('proposals')
      .update({
        status: 'completed',
        contract_release_tx: txHash,
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    return jsonResponse({ 
      success: true, 
      proposal: updated,
      txHash,
      message: 'Tokens released to contributor!'
    })
  } catch (error) {
    return errorResponse(error.message, 500)
  }
}
```

---

### PHASE-5-TICKET-010: Frontend - Confirm Work Button

**Priority:** P1 | **Time:** 30 min

**Goal:** Add UI for pioneer to confirm work completion

**What to Do:**

1. Update cofounder dashboard
2. Show "Confirm Work Done" button for work_in_progress proposals
3. Call /api/contracts/confirm-work endpoint
4. Show success/error feedback

**Files to Edit:**

- `src/app/cofounder-dashboard/page.tsx`

**Definition of Done:**

- [ ] Button visible for work_in_progress proposals
- [ ] Button calls confirm-work API
- [ ] Shows loading state
- [ ] Shows success message
- [ ] Shows error if fails
- [ ] Updates UI after confirmation
- [ ] Mobile responsive

**Code Pattern:**

```typescript
// In cofounder-dashboard/page.tsx
{proposal.status === 'work_in_progress' && !proposal.pioneer_confirmed_at && (
  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4">
    <p className="font-semibold mb-2">Work in Progress</p>
    <p className="text-sm mb-3">
      Have you completed the work? Mark it as done to request review.
    </p>
    <button
      onClick={() => handleConfirmWork(proposal.id)}
      className="bg-green-600 text-white px-6 py-2 rounded-lg"
    >
      ✅ Mark Work as Complete
    </button>
  </div>
)}

{proposal.status === 'work_in_progress' && proposal.pioneer_confirmed_at && (
  <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
    <p className="font-semibold">⏳ Awaiting Admin Review</p>
    <p className="text-sm text-gray-600">
      You marked this work as complete. The foundation will review and release tokens.
    </p>
  </div>
)}
```

---

### PHASE-5-TICKET-011: Frontend - Admin Release Tokens Button

**Priority:** P1 | **Time:** 30 min

**Goal:** Add UI for admin to release tokens after verifying work

**What to Do:**

1. Update admin proposal detail page
2. Show "Release Tokens" button if pioneer confirmed work
3. Call /api/contracts/release-agreement endpoint
4. Show transaction hash
5. Link to Basescan

**Files to Edit:**

- `src/app/admin/proposals/[id]/page.tsx`

**Definition of Done:**

- [ ] Button visible when pioneer confirmed work
- [ ] Button calls release-agreement API
- [ ] Shows loading state during blockchain transaction
- [ ] Shows success with transaction hash
- [ ] Links to Basescan to view transaction
- [ ] Shows error if fails
- [ ] Updates proposal status after release

**Code Pattern:**

```typescript
// In admin proposal detail
{proposal.status === 'work_in_progress' && proposal.pioneer_confirmed_at && (
  <div className="mt-6 bg-green-50 border border-green-200 rounded p-6">
    <p className="font-semibold mb-2">✅ Pioneer Confirmed Work Complete</p>
    <p className="text-sm text-gray-600 mb-4">
      Confirmed at: {new Date(proposal.pioneer_confirmed_at).toLocaleString()}
    </p>
    <button
      onClick={() => handleReleaseTokens(proposal.id)}
      disabled={releasing}
      className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
    >
      {releasing ? 'Releasing Tokens...' : '💰 Release Tokens to Contributor'}
    </button>
  </div>
)}

{proposal.status === 'completed' && (
  <div className="mt-6 bg-green-50 border border-green-200 rounded p-6">
    <p className="font-semibold mb-2">✅ Completed</p>
    <p className="text-sm text-gray-600 mb-2">
      Tokens released successfully!
    </p>
    {proposal.contract_release_tx && (
      <a
        href={`https://sepolia.basescan.org/tx/${proposal.contract_release_tx}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm"
      >
        View transaction on Basescan →
      </a>
    )}
  </div>
)}
```

---

### PHASE-5-TICKET-012: E2E Integration Test - Complete Lifecycle

**Priority:** P0 | **Time:** 1 hour

**Goal:** Test complete proposal lifecycle including smart contract interactions

**What to Do:**

1. Test full flow from proposal to token release
2. Verify blockchain state matches DB state
3. Check token balances before/after
4. Test error cases
5. Verify all transaction hashes valid

**Definition of Done:**

- [ ] Can submit and accept proposal
- [ ] Agreement created on blockchain
- [ ] Can confirm work as pioneer
- [ ] Can release tokens as admin
- [ ] Tokens transferred to pioneer wallet
- [ ] All transaction hashes valid
- [ ] All statuses update correctly
- [ ] Can view transactions on Basescan
- [ ] Error handling works
- [ ] Mobile UI tested

**Test Checklist:**

```
Setup:
✓ Foundation wallet has $CSTAKE tokens
✓ Foundation wallet approved VestingContract

Full Lifecycle:
✓ Pioneer submits proposal
✓ Admin accepts proposal
✓ Pioneer accepts (triggers contract)
✓ Check Basescan: createAgreement transaction
✓ Verify agreement exists in contract
✓ Pioneer confirms work done
✓ Admin clicks "Release Tokens"
✓ Check Basescan: releaseAgreement transaction
✓ Verify tokens received in pioneer wallet
✓ Verify proposal status = 'completed'

Token Balances:
✓ Check pioneer balance before (0 $CSTAKE)
✓ Check pioneer balance after (agreed amount)
✓ Check contract balance = 0 after release

Edge Cases:
✓ Try to release before pioneer confirms (should fail)
✓ Try to create duplicate agreement (should fail)
✓ Try to confirm work twice (should fail on contract)
✓ Non-admin tries to release (should fail)
✓ Non-pioneer tries to confirm (should fail)
```

---

## Implementation Order

**Do these tickets in exact order:**

1. **PHASE-5-TICKET-001** - Write VestingContract.sol (2 hours)
2. **PHASE-5-TICKET-002** - Deploy mock $CSTAKE token (30 min)
3. **PHASE-5-TICKET-003** - Deploy VestingContract (1 hour)
4. **PHASE-5-TICKET-004** - UUID to uint256 utility (30 min)
5. **PHASE-5-TICKET-005** - Contract interaction service (2 hours)
6. **PHASE-5-TICKET-006** - Add contract fields to DB (20 min)
7. **PHASE-5-TICKET-007** - Auto-trigger createAgreement (1 hour)
8. **PHASE-5-TICKET-008** - Confirm work API (45 min)
9. **PHASE-5-TICKET-009** - Release agreement API (45 min)
10. **PHASE-5-TICKET-010** - Frontend confirm work button (30 min)
11. **PHASE-5-TICKET-011** - Frontend release tokens button (30 min)
12. **PHASE-5-TICKET-012** - E2E integration test (1 hour)

**Total Estimated Time: 11 hours**

## New Dependencies

```json
{
  "dependencies": {
    "ethers": "^6.13.4"
  }
}
```

## Updated Status Flow

```
pending_review → approved/counter_offer_pending → accepted
                                                      ↓
                                          [BLOCKCHAIN: createAgreement]
                                                      ↓
                                              work_in_progress
                                                      ↓
                                          pioneer confirms work
                                                      ↓
                                          admin verifies & releases
                                                      ↓
                                          [BLOCKCHAIN: releaseAgreement]
                                                      ↓
                                                 completed
```

## Environment Variables Summary

```bash
# From previous phases
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_WALLET_ADDRESS=0x...

# New in Phase 5
CSTAKE_TOKEN_ADDRESS_TESTNET=0x...
VESTING_CONTRACT_ADDRESS_TESTNET=0x...
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
FOUNDATION_WALLET_PRIVATE_KEY=0x... # NEVER COMMIT!
```

## What We're Skipping

- ❌ Hardhat/Foundry test suite
- ❌ Gas optimization analysis
- ❌ Formal verification
- ❌ Multi-signature admin wallet
- ❌ Pausable/upgradeable contracts
- ❌ Slashing for incomplete work
- ❌ Partial releases (milestones)
- ❌ Dispute resolution mechanism

These can be added in Phase 6+ or post-MVP.

## Security Considerations

✅ **What we're doing right:**

- Using OpenZeppelin IERC20
- onlyFoundation modifier
- Require statements for validation
- Double confirmation (pioneer + admin)
- Event emission for transparency

⚠️ **What to audit before mainnet:**

- Re-entrancy (not applicable here but verify)
- Integer overflow (Solidity 0.8+ protects)
- Access control (simple but verify)
- Token approval mechanism
- Front-running considerations

## Success Criteria

After Phase 5 is complete:

✅ Smart contract deployed to testnet

✅ Tokens locked in escrow on agreement

✅ Pioneer can confirm work completion

✅ Admin can release tokens after verification

✅ All transactions on-chain and verifiable

✅ Complete lifecycle tested end-to-end

✅ Ready for Phase 6 (Dashboard enhancements)

## Next Steps After Phase 5

Once smart contracts work:

- Phase 6: Co-founder dashboard with wallet balance, token price
- Phase 7: Admin dashboard with analytics
- Phase 8: Polish, testing, launch prep
- Phase 9: Mainnet deployment

The core CrowdStaking mechanism is now fully functional with trustless escrow!