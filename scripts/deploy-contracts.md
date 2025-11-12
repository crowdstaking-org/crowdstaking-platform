# Automated Smart Contract Deployment Guide

## Prerequisites

✅ **Foundation Wallet:** `0x252825B2DD9d4ea3489070C09Be63ea18879E5ab`  
❌ **Testnet ETH:** 0 ETH (benötigt: ~0.05 ETH)

## Step 1: Get Testnet ETH

Siehe `dev-docs/TESTNET-ETH-FAUCET.md`

## Step 2: Deploy via ThirdWeb Dashboard (Empfohlen)

### A) Deploy $CSTAKE Token

1. Gehe zu: https://thirdweb.com/dashboard/contracts/deploy
2. Wähle "Token" (ERC-20)
3. **Configuration:**
   - Name: `CrowdStaking Test Token`
   - Symbol: `CSTAKE`
   - Initial Supply: `1000000` (1 Million)
   - Decimals: `18`
   - Premint to: `0x252825B2DD9d4ea3489070C09Be63ea18879E5ab`
4. **Network:** Base Sepolia (Chain ID: 84532)
5. **Deploy** und warte auf Confirmation
6. **Kopiere Token Address** → speichere als `CSTAKE_TOKEN_ADDRESS`

### B) Deploy VestingContract

1. Gehe zu: https://thirdweb.com/dashboard/contracts/deploy
2. Wähle "Custom Contract"
3. **Upload File:** `contracts/VestingContract.sol`
4. **Constructor Parameters:**
   ```
   _cstakeToken: [CSTAKE_TOKEN_ADDRESS from Step A]
   _foundationWallet: 0x252825B2DD9d4ea3489070C09Be63ea18879E5ab
   ```
5. **Network:** Base Sepolia (Chain ID: 84532)
6. **Deploy** und warte auf Confirmation
7. **Verify Contract** (automatisch durch ThirdWeb)
8. **Kopiere Contract Address** → speichere als `VESTING_CONTRACT_ADDRESS`

### C) Approve VestingContract

1. Gehe zu deployed $CSTAKE Token auf ThirdWeb Dashboard
2. Navigiere zu "Write" Tab
3. Finde `approve` function
4. **Parameters:**
   ```
   spender: [VESTING_CONTRACT_ADDRESS from Step B]
   amount: 115792089237316195423570985008687907853269984665640564039457584007913129639935
   ```
   (Das ist `type(uint256).max` - maximale Erlaubnis)
5. **Execute** Transaction

## Step 3: Update .env.local

Erstelle/Update `/Users/thomashuhn/Code/CS/.env.local`:

```bash
# Smart Contract Addresses (Base Sepolia)
CSTAKE_TOKEN_ADDRESS_TESTNET=[Token Address from Step A]
VESTING_CONTRACT_ADDRESS_TESTNET=[Contract Address from Step B]

# Network
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Foundation Wallet (bereits im System)
FOUNDATION_WALLET_PRIVATE_KEY=[wird von ThirdWeb verwaltet]
```

**Wichtig:** Die Foundation Wallet wird von ThirdWeb als Server Wallet verwaltet, du brauchst keinen Private Key manuell zu setzen!

## Step 4: Verify Deployment

Nach dem Deployment, prüfe:

### Check Token auf Basescan
```
https://sepolia.basescan.org/token/[CSTAKE_TOKEN_ADDRESS]
```

Erwartete Info:
- ✅ Name: CrowdStaking Test Token
- ✅ Symbol: CSTAKE
- ✅ Total Supply: 1,000,000
- ✅ Holder: 0x252825B2DD9d4ea3489070C09Be63ea18879E5ab (Balance: 1M)

### Check VestingContract auf Basescan
```
https://sepolia.basescan.org/address/[VESTING_CONTRACT_ADDRESS]
```

Erwartete Info:
- ✅ Verified Contract ✓
- ✅ Constructor Args: cstakeToken, foundationWallet
- ✅ Functions: createAgreement, releaseAgreement, etc.

### Check Approval
```
https://sepolia.basescan.org/token/[CSTAKE_TOKEN_ADDRESS]?a=0x252825B2DD9d4ea3489070C09Be63ea18879E5ab
```

Unter "Token Approvals" sollte stehen:
- ✅ Spender: [VESTING_CONTRACT_ADDRESS]
- ✅ Amount: Unlimited

## Step 5: Test via Application

1. Starte Dev Server: `npm run dev`
2. Gehe zu: http://localhost:3000/submit-proposal
3. Erstelle Test Proposal
4. Gehe zu Admin Dashboard: http://localhost:3000/admin/proposals
5. Akzeptiere Proposal
6. Als Pioneer: Akzeptiere Agreement
7. **Check:** Blockchain Transaction sollte automatisch erstellt werden!
8. Status sollte zu `work_in_progress` wechseln
9. Als Pioneer: "Arbeit abgeschlossen" klicken
10. Als Admin: "Tokens freigeben" klicken
11. **Check:** Tokens sollten transferred werden!

## Alternative: Programmatic Deployment (Fortgeschritten)

Falls du die Contracts programmatisch deployen möchtest:

### Deploy Token via ThirdWeb SDK

```typescript
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.FOUNDATION_WALLET_PRIVATE_KEY!,
  "base-sepolia"
);

// Deploy Token
const tokenAddress = await sdk.deployer.deployToken({
  name: "CrowdStaking Test Token",
  symbol: "CSTAKE",
  primary_sale_recipient: "0x252825B2DD9d4ea3489070C09Be63ea18879E5ab",
  initial_supply: "1000000"
});

console.log("Token deployed:", tokenAddress);
```

### Deploy VestingContract via ethers.js

```typescript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
const wallet = new ethers.Wallet(process.env.FOUNDATION_WALLET_PRIVATE_KEY!, provider);

// Kompiliere Contract mit solc oder hardhat
// const bytecode = "0x...";
// const abi = [...];

const factory = new ethers.ContractFactory(abi, bytecode, wallet);
const contract = await factory.deploy(tokenAddress, "0x252825B2DD9d4ea3489070C09Be63ea18879E5ab");
await contract.waitForDeployment();

console.log("VestingContract deployed:", await contract.getAddress());
```

## Troubleshooting

### "Insufficient funds for gas"
→ Wallet braucht mehr Testnet ETH

### "Deployment failed"
→ Check Basescan für detailed error message

### "Transaction reverted"
→ Constructor parameters falsch oder Token Address ungültig

### "Approval failed"
→ Stelle sicher, dass du die Token Adresse korrekt eingegeben hast

## Benötigte Zeit

- Testnet ETH besorgen: 1-5 Minuten
- Token Deployment: 2 Minuten
- VestingContract Deployment: 2 Minuten
- Approval: 1 Minute
- Testing: 5 Minuten

**Total: ~10-15 Minuten** ⚡

## Fertig! 🎉

Nach diesen Schritten ist Phase 5 vollständig deployed und die komplette CrowdStaking Anwendung ist funktionsfähig mit echten Smart Contracts auf Base Sepolia!



