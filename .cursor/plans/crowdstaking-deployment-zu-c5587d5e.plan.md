<!-- c5587d5e-2c42-4cf8-a744-9c12c4f125cd fa321640-6f0f-4634-b085-4fa11bd47e43 -->
# Hybrid Token Deployment - MINIMAL-INVASIV

## 🎯 Kernziele

1. User gibt Token Name/Symbol explizit ein (nicht auto-generiert)
2. Duplikat-Validierung (Reserved Symbols + CrowdStaking DB + Optional Blockchain)
3. Backend deployed Token (User braucht kein ETH)
4. Hybrid Gas Payment (Testnet: Server Wallet, Mainnet: Sponsored)

## 🔍 Minimal-Invasive Analyse

**Was IST bereits vorhanden:**

- ✅ Wizard State Management (`MissionData`)
- ✅ SetupStep Component (sehr clean, leicht erweiterbar)
- ✅ ThirdWeb MCP Tools (kein eigener Code nötig!)
- ✅ `successResponse` Wrapper für APIs
- ✅ `requireAuth` für Authentifizierung

**Was muss MINIMAL hinzugefügt werden:**

- 2 Input Felder in SetupStep (Token Name + Symbol)
- 1 Validation Function (inline, keine separate API nötig!)
- 1 Backend API für Deployment
- Env Var Update

**Lines of Code:** ~250 neue Zeilen (statt 800+)

---

## TICKET 1: Wizard State für Token Name/Symbol

**Ziel:** MissionData Interface erweitern

**Datei:** `src/app/wizard/page.tsx`

**Ändern:**

```typescript
interface MissionData {
  projectName: string
  mission: string
  vision: string
  tags: string
  tokenName: string      // NEU
  tokenSymbol: string    // NEU
  legalWrapper: boolean
  agreedToFee: boolean
}

// State initialisieren:
const [missionData, setMissionData] = useState<MissionData>({
  projectName: '',
  mission: '',
  vision: '',
  tags: '',
  tokenName: '',        // NEU
  tokenSymbol: '',      // NEU
  legalWrapper: true,
  agreedToFee: false,
})
```

**Definition of Done:**

- [ ] Interface erweitert
- [ ] State initialisiert
- [ ] TypeScript compiles

---

## TICKET 2: Token Name/Symbol Inputs im SetupStep

**Ziel:** User kann Token Name und Symbol eingeben

**Datei:** `src/components/wizard/SetupStep.tsx`

**VOR den Legal Wrapper Radio Buttons einfügen:**

```tsx
{/* Token Configuration */}
<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-4 mb-8">
  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
    Your Token Configuration:
  </h3>
  
  {/* Token Name */}
  <div>
    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
      Token Name (Full Name)
    </label>
    <input
      type="text"
      value={data.tokenName || ''}
      onChange={(e) => onUpdate({ tokenName: e.target.value })}
      placeholder={`e.g., ${data.projectName || 'My Project'} Token`}
      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
    />
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Full descriptive name (e.g., "Bitcoin", "Ethereum", "CrowdStaking Token")
    </p>
  </div>
  
  {/* Token Symbol with inline validation */}
  <div>
    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
      Token Symbol (Ticker)
    </label>
    <input
      type="text"
      value={data.tokenSymbol || ''}
      onChange={(e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10)
        onUpdate({ tokenSymbol: value })
      }}
      placeholder="e.g., CSTAKE"
      maxLength={10}
      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white uppercase font-mono focus:ring-2 focus:ring-blue-500"
    />
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      2-10 uppercase letters/numbers (e.g., "BTC", "ETH", "USDC")
    </p>
    
    {/* Validation Hints */}
    {data.tokenSymbol && data.tokenSymbol.length >= 2 && (
      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-600">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          💡 Symbol "{data.tokenSymbol}" will be validated before deployment.
          We'll check against major tokens and CrowdStaking projects.
        </p>
      </div>
    )}
  </div>
</div>
```

**Props erweitern:**

```typescript
interface SetupStepProps {
  data: {
    tokenName: string      // NEU
    tokenSymbol: string    // NEU
    legalWrapper: boolean
  }
  onUpdate: (updates: any) => void
  onNext: () => void
  onBack: () => void
}
```

**Validation vor Continue:**

```typescript
const canProceed = 
  data.tokenName && 
  data.tokenName.length >= 2 &&
  data.tokenSymbol && 
  data.tokenSymbol.length >= 2 && 
  data.tokenSymbol.length <= 10

// Button:
<button
  onClick={onNext}
  disabled={!canProceed}
  className="..."
>
```

**Definition of Done:**

- [ ] 2 Input Felder hinzugefügt
- [ ] Auto-uppercase für Symbol
- [ ] Nur A-Z und 0-9 erlaubt
- [ ] Max 10 Zeichen
- [ ] Continue button validation
- [ ] Placeholder verwendet projectName

---

## TICKET 3: Backend Deployment API (Hybrid Gas)

**Ziel:** Deploy Token via ThirdWeb MCP mit Hybrid Gas Payment

**Datei:** `src/app/api/tokens/deploy-backend/route.ts` (NEU)

**Code:**

```typescript
import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

// Reserved symbols that cannot be used
const RESERVED_SYMBOLS = [
  'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'WETH', 'WBTC',
  'UNI', 'LINK', 'AAVE', 'MATIC', 'BNB', 'SOL', 'ADA',
  'DOT', 'AVAX', 'ATOM', 'OP', 'ARB', 'BASE', 'USDB'
]

/**
 * POST /api/tokens/deploy-backend
 * 
 * Deploys ERC20 token via ThirdWeb MCP with hybrid gas payment
 * Server pays gas - user doesn't need ETH
 */
export async function POST(request: NextRequest) {
  try {
    const userWallet = requireAuth(request)
    const body = await request.json()
    const { tokenName, tokenSymbol, projectName } = body
    
    // Validation
    if (!tokenName || !tokenSymbol) {
      return errorResponse('Token name and symbol required', 400)
    }
    
    if (tokenSymbol.length < 2 || tokenSymbol.length > 10) {
      return errorResponse('Token symbol must be 2-10 characters', 400)
    }
    
    const symbolUpper = tokenSymbol.toUpperCase()
    
    // Check reserved symbols
    if (RESERVED_SYMBOLS.includes(symbolUpper)) {
      return errorResponse(
        `${symbolUpper} is a well-known token symbol and cannot be used. Try ${symbolUpper}X or ${symbolUpper}2 instead.`,
        400
      )
    }
    
    // Check CrowdStaking database
    const { supabase } = await import('@/lib/supabase')
    const { data: existing } = await supabase
      .from('projects')
      .select('token_symbol, name')
      .eq('token_symbol', symbolUpper)
      .limit(1)
    
    if (existing && existing.length > 0) {
      return errorResponse(
        `Symbol ${symbolUpper} is already used by "${existing[0].name}" on CrowdStaking`,
        400
      )
    }
    
    // Deploy token via ThirdWeb MCP
    const { mcp_thirdweb_createToken } = await import('@/lib/mcp-thirdweb')
    
    const result = await mcp_thirdweb_createToken({
      name: tokenName,
      symbol: symbolUpper,
      chainId: 84532, // Base Sepolia
      from: userWallet, // User gets ownership
      maxSupply: 1000000000,
      description: `Project token for ${projectName}`,
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(tokenName)}&background=4F46E5&color=fff`,
    })
    
    // Extract token address from result
    const tokenAddress = result.tokenAddress || result.address
    
    // Transfer 2% to DAO automatically
    const { mcp_thirdweb_sendTokens } = await import('@/lib/mcp-thirdweb')
    
    const totalSupply = '1000000000000000000000000000' // 1B with 18 decimals
    const twoPercent = (BigInt(totalSupply) * 2n / 100n).toString()
    
    await mcp_thirdweb_sendTokens({
      from: userWallet,
      chainId: 84532,
      tokenAddress,
      recipients: [{
        address: process.env.NEXT_PUBLIC_DAO_WALLET_ADDRESS!,
        quantity: twoPercent,
      }]
    })
    
    return successResponse({
      tokenAddress,
      tokenName,
      tokenSymbol: symbolUpper,
      message: 'Token deployed successfully',
    }, 201)
    
  } catch (error: any) {
    console.error('Backend token deployment error:', error)
    
    return errorResponse(
      error.message || 'Failed to deploy token',
      500
    )
  }
}
```

**WICHTIG:** ThirdWeb MCP nutzen = KEINE eigenen Helper Functions nötig!

**Definition of Done:**

- [ ] API verwendet ThirdWeb MCP direkt
- [ ] Reserved symbols check
- [ ] Database duplicate check
- [ ] Token deployment
- [ ] 2% auto-transfer
- [ ] Error handling

---

## TICKET 4: ThirdWeb MCP Wrapper (Optional)

**NUR wenn MCP nicht direkt importierbar ist**

**Datei:** `src/lib/mcp-thirdweb.ts` (NEU)

**Code:**

```typescript
/**
 * ThirdWeb MCP Wrapper
 * Provides type-safe access to ThirdWeb MCP tools
 */

export async function mcp_thirdweb_createToken(params: {
  name: string
  symbol: string
  chainId: number
  from: string
  maxSupply: number
  description?: string
  imageUrl?: string
}) {
  // This will use the actual MCP tool at runtime
  // For now, placeholder that will be replaced by actual MCP integration
  throw new Error('MCP integration required')
}

export async function mcp_thirdweb_sendTokens(params: {
  from: string
  chainId: number
  tokenAddress: string
  recipients: Array<{ address: string; quantity: string }>
}) {
  // This will use the actual MCP tool at runtime
  throw new Error('MCP integration required')
}
```

**Alternative: Direct Fetch zu ThirdWeb API**

**Definition of Done:**

- [ ] MCP wrapper OR direct API calls
- [ ] Type definitions
- [ ] Works in backend API routes

---

## TICKET 5: Update useLaunchMission

**Datei:** `src/hooks/useLaunchMission.ts`

**Ersetzen (Zeilen ~88-130):**

```typescript
// Phase 2: Deploy Token via Backend (NO gas needed!)
setCurrentPhase('🚀 Deploying token (this takes ~30 seconds)...')
toast('Deploying via CrowdStaking - no ETH or confirmations needed!', {
  icon: '⚡',
  duration: 5000,
})

let tokenAddress: string
try {
  const deployResponse = await fetch('/api/tokens/deploy-backend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-wallet-address': account.address,
    },
    body: JSON.stringify({
      tokenName: data.tokenName,
      tokenSymbol: data.tokenSymbol,
      projectName: data.projectName,
    }),
  })
  
  if (!deployResponse.ok) {
    const errorData = await deployResponse.json()
    throw new Error(errorData.error || 'Token deployment failed')
  }
  
  const responseData = await deployResponse.json()
  tokenAddress = responseData.data.tokenAddress
  
  toast.success(`Token ${data.tokenSymbol} deployed! 98% in your wallet, 2% to DAO.`, { 
    duration: 10000 
  })
  console.log('Token deployed:', tokenAddress)
  console.log('Basescan:', `https://sepolia.basescan.org/address/${tokenAddress}`)
  
} catch (error: any) {
  throw new Error(error.message || 'Token deployment failed')
}

// Phase 3: Legal Signature (ONLY user confirmation!)
let legalSignature = null
if (data.legalWrapper) {
  setCurrentPhase('📝 Please sign legal message in your wallet...')
  toast('Sign the Wyoming DAO LLC incorporation in your wallet', {
    icon: '📝',
    duration: 10000,
  })
  
  legalSignature = await requestLegalSignature(account as any, {
    projectName: data.projectName,
    founderAddress: account.address,
    tokenAddress,
  })
  
  toast.success('Legal incorporation signed!')
}

// No Phase 3 for 2% transfer - backend does it automatically!
```

**Definition of Done:**

- [ ] Nur 1 Backend API call statt 2 Frontend TXs
- [ ] Legal Signature bleibt als einzige User Confirmation
- [ ] Toast messages updated
- [ ] Console logs mit Basescan URLs
- [ ] Verwendet data.tokenName und data.tokenSymbol

---

## TICKET 6: Update ReviewStep

**Datei:** `src/components/wizard/ReviewStep.tsx`

**Props erweitern:**

```typescript
interface ReviewStepProps {
  data: {
    projectName: string
    mission: string
    vision: string
    tags: string
    tokenName: string      // NEU
    tokenSymbol: string    // NEU
    legalWrapper: boolean
  }
  onNext: () => void
  onBack: () => void
}
```

**Summary erweitern (nach Tags):**

```tsx
<div>
  <span className="font-semibold text-gray-700 dark:text-gray-300">
    Token Name:
  </span>
  <p className="text-gray-900 dark:text-white">{data.tokenName}</p>
</div>

<div>
  <span className="font-semibold text-gray-700 dark:text-gray-300">
    Token Symbol:
  </span>
  <p className="text-gray-900 dark:text-white">{data.tokenSymbol}</p>
</div>

<div>
  <span className="font-semibold text-gray-700 dark:text-gray-300">
    Total Supply:
  </span>
  <p className="text-gray-900 dark:text-white">
    1,000,000,000 {data.tokenSymbol}
  </p>
</div>
```

**Wallet Notice ändern:**

```tsx
<p className="text-gray-700 dark:text-gray-300 mb-3">
  To incorporate your "Digital Company", you'll need to sign
  ONE message in your wallet:
</p>
<ol className="list-decimal ml-6 space-y-2 text-gray-700 dark:text-gray-300">
  <li>Legal signature (Wyoming DAO LLC incorporation)</li>
</ol>
<p className="text-gray-700 dark:text-gray-300 mt-3">
  ✅ <strong>Good news:</strong> Token deployment happens automatically 
  via our infrastructure. You don't need ETH for gas fees!
</p>
```

**Definition of Done:**

- [ ] Props erweitert
- [ ] Token Name/Symbol im Summary
- [ ] ONE signature statt THREE transactions
- [ ] "No ETH needed" Message
- [ ] User-friendly

---

## TICKET 7: Environment Variables (Hybrid)

**Zu `.env.local` hinzufügen:**

```bash
# ThirdWeb Secret Key (BACKEND)
THIRDWEB_SECRET_KEY=your_secret_key_here

# Gas Payment Mode: 'server-wallet' or 'sponsored'
# Testnet: Use 'server-wallet' with free testnet ETH
# Mainnet: Use 'sponsored' with ThirdWeb credits
THIRDWEB_GAS_MODE=server-wallet

# DAO Wallet (with NEXT_PUBLIC prefix for frontend access)
NEXT_PUBLIC_DAO_WALLET_ADDRESS=0x252825B2DD9d4ea3489070C09Be63ea18879E5ab
```

**Setup Anleitung:**

**Testnet Setup:**

1. Get Secret Key: https://thirdweb.com/dashboard/settings/api-keys
2. Find Server Wallet Address in Dashboard
3. Fund wallet: https://www.alchemy.com/faucets/base-sepolia (0.1 ETH)
4. Set `THIRDWEB_GAS_MODE=server-wallet`
5. ✅ Ready for ~70 token deployments

**Mainnet Setup (später):**

1. Same Secret Key
2. Buy Gas Credits in ThirdWeb Dashboard
3. Set `THIRDWEB_GAS_MODE=sponsored`
4. ✅ No wallet management needed!

**Definition of Done:**

- [ ] THIRDWEB_SECRET_KEY added
- [ ] THIRDWEB_GAS_MODE configured
- [ ] NEXT_PUBLIC_DAO_WALLET_ADDRESS with prefix
- [ ] .env.example updated
- [ ] README with setup guide

---

## TICKET 8: Cleanup Unused Code

**Dateien zu LÖSCHEN:**

- `src/lib/contracts/tokenDeploy.ts` (nicht mehr benötigt)
- `src/lib/contracts/daoTransfer.ts` (nicht mehr benötigt)

**Imports zu ENTFERNEN aus `useLaunchMission.ts`:**

- `deployProjectToken`
- `transfer2PercentToDAO`
- `formatTokenAmount`
- `getDAOWalletAddress`

**Behalten:**

- `requestLegalSignature` (wird noch benötigt)

**Definition of Done:**

- [ ] Unused files gelöscht
- [ ] Unused imports entfernt
- [ ] Build funktioniert
- [ ] Keine broken imports

---

## TICKET 9: Validation Logic (Simple Inline)

**KEINE separate API!** Einfach inline in Backend:

**In `/api/tokens/deploy-backend`:**

```typescript
// Validation Layer 1: Reserved Symbols
if (RESERVED_SYMBOLS.includes(symbolUpper)) {
  return errorResponse(`${symbolUpper} cannot be used`, 400)
}

// Validation Layer 2: CrowdStaking Database
const { data: dbCheck } = await supabase
  .from('projects')
  .select('token_symbol')
  .eq('token_symbol', symbolUpper)

if (dbCheck && dbCheck.length > 0) {
  return errorResponse(`${symbolUpper} already used on CrowdStaking`, 400)
}

// Validation Layer 3: Blockchain (Optional - via console log)
// Token symbols are NOT unique on blockchain
// Multiple tokens can have same symbol
// We just log a warning if needed
console.log(`Deploying token with symbol: ${symbolUpper}`)
console.log('Note: Other tokens with this symbol may exist on-chain')
```

**Blockchain Duplikat-Erklärung:**

**Warum KEINE weltweite Uniqueness:**

- Token Symbole sind **nicht unique** auf der Blockchain
- Jeder kann ein Token "BTC" nennen
- Unterscheidung erfolgt über **Contract Address**
- Beispiel: 100+ "Bitcoin" Tokens auf Ethereum

**Unsere Protection:**

- ✅ Block major symbols (BTC, ETH, USDC) → User Confusion vermeiden
- ✅ Block CrowdStaking duplicates → Innerhalb Platform unique
- ⚠️ Warn bei Blockchain duplicates → User informieren, aber erlauben

**Definition of Done:**

- [ ] 3-Layer validation inline
- [ ] Reserved symbols hardcoded list
- [ ] Database check
- [ ] Console warnings für info
- [ ] Clear error messages

---

## Files Summary

| File | Action | Lines |

|------|--------|-------|

| `src/app/wizard/page.tsx` | MODIFY | +2 (tokenName, tokenSymbol in interface) |

| `src/components/wizard/SetupStep.tsx` | MODIFY | +60 (2 inputs + validation) |

| `src/components/wizard/ReviewStep.tsx` | MODIFY | +20 (summary + notice update) |

| `src/app/api/tokens/deploy-backend/route.ts` | CREATE | +120 (backend deployment) |

| `src/hooks/useLaunchMission.ts` | MODIFY | -80/+40 (replace frontend with backend) |

| `src/lib/contracts/tokenDeploy.ts` | DELETE | -141 |

| `src/lib/contracts/daoTransfer.ts` | DELETE | -60 |

| `.env.example` | MODIFY | +10 |

**Total:** 3 new files, 4 modified, 2 deleted, ~250 net new lines

---

## Implementation Order (Optimized)

1. **TICKET 7** - Env Vars (10 min) 
2. **TICKET 1** - Wizard State (5 min)
3. **TICKET 2** - Token Inputs (30 min)
4. **TICKET 9** - Validation Logic (inline, 15 min)
5. **TICKET 3** - Backend API (45 min)
6. **TICKET 5** - Update Launch Hook (20 min)
7. **TICKET 6** - Update ReviewStep (15 min)
8. **TICKET 8** - Cleanup (10 min)

**Total: ~2.5 hours**

---

## Hybrid Gas Payment Details

### Testnet (FREE):

```bash
THIRDWEB_GAS_MODE=server-wallet
# Server wallet needs 0.1 ETH from faucet
# ~70 deployments possible
```

### Mainnet (Credits):

```bash
THIRDWEB_GAS_MODE=sponsored
# Buy credits in ThirdWeb Dashboard
# ~$0.03 per deployment
```

**Switching:** Just change env var, no code changes!

---

## Worldwide Duplicate Prevention - REALITY CHECK

**❌ Cannot prevent:**

- Anyone deploying token with symbol "CSTAKE" on blockchain
- Symbols are NOT unique protocol-level

**✅ Can prevent:**

- Using major symbols (BTC, ETH) → Protects users from confusion
- Duplicates within CrowdStaking → Platform consistency
- Accidental conflicts → Database check

**✅ Can warn:**

- "Symbol exists on blockchain" → User makes informed decision
- "X other tokens found" → Transparency

**Best Practice:**

- Check database (required)
- Block major symbols (required)
- Log blockchain duplicates (informational)
- User understands: Token ADDRESS is unique, Symbol is not

---

## Testing Strategy

**Test Case 1: Reserved Symbol**

- Input: "BTC"
- Result: ❌ Error "BTC is a well-known token..."

**Test Case 2: CrowdStaking Duplicate**

- Input: Symbol from existing project
- Result: ❌ Error "Symbol already used by Project X"

**Test Case 3: Unique Symbol**

- Input: "MYTEST"
- Result: ✅ Success, token deployed

**Test Case 4: No ETH in User Wallet**

- User has 0 ETH
- Result: ✅ Still works! Backend pays gas

**Test Case 5: Mainnet Switch**

- Change `THIRDWEB_GAS_MODE=sponsored`
- Result: ✅ Uses credits instead of server wallet

---

## Cost Comparison

| Scenario | Testnet | Mainnet |

|----------|---------|---------|

| **Server Wallet** | FREE (faucet) | ~$0.003/TX |

| **Sponsored** | N/A (no credits for testnet) | ~$0.01/TX |

| **User Pays** | FREE (faucet) | ~$0.003/TX |

**Empfehlung:**

- Testnet: Server Wallet (free faucet ETH)
- Mainnet: Sponsored (easier management)

---

## Success Criteria

✅ User gibt Token Name/Symbol manuell ein

✅ Symbol validation (reserved + database)

✅ Backend deployed token (no user ETH needed)

✅ 98% zu User, 2% zu DAO automatisch

✅ Nur 1 Signature vom User

✅ Hybrid gas payment (configurable)

✅ Production build erfolgreich

✅ Funktioniert mit Google/Email/Wallet login

### To-dos

- [ ] TICKET 7: Add baseSepolia to supported chains in src/lib/thirdweb.ts
- [ ] TICKET 1: Create src/lib/contracts/tokenDeploy.ts with deployProjectToken and transfer2PercentToDAO
- [ ] TICKET 3: Update imports in useLaunchMission.ts - remove old, add new
- [ ] TICKET 2: Replace mock token deploy and transfer with real ThirdWeb SDK calls
- [ ] TICKET 4: Add comprehensive blockchain error handling (gas, nonce, network)
- [ ] TICKET 5: Add Basescan transaction links to success toasts
- [ ] TICKET 6: Update ReviewStep wallet notice text (3 transactions, faucet link)
- [ ] TICKET 8: Delete unused src/app/api/tokens/create-project-token/route.ts
- [ ] TICKET 9: E2E test with real wallet on Base Sepolia testnet