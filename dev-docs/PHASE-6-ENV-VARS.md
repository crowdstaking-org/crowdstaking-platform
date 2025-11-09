# Phase 6: Environment Variables Documentation

This document lists all environment variables needed for Phase 6 (Token Economics & Co-Owner Dashboard).

## Required Environment Variables

Add these to your `.env.local` file (which is protected by `.gitignore` and `.cursorignore`).

### Core Infrastructure (From Previous Phases)

```bash
# ThirdWeb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Blockchain RPC
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Foundation Wallet
FOUNDATION_WALLET_PRIVATE_KEY=your_foundation_wallet_private_key_here
```

### Phase 6: Token Economics

```bash
# $CSTAKE Token Contract Address (Deployed in Phase 5)
NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS=0xa746381E05aE069846726Eb053788D4879B458DA

# Uniswap Pool Configuration (Optional - for when liquidity is added)
CSTAKE_UNISWAP_POOL_ADDRESS=

# Manual Price Override (Optional - for testing)
# Set a fixed USD price, or leave empty to use fallback ($0.10)
CSTAKE_MANUAL_PRICE=
```

## Environment Variable Details

### `NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS`
- **Required:** Yes
- **Type:** Ethereum address
- **Default:** `0xa746381E05aE069846726Eb053788D4879B458DA`
- **Description:** The deployed $CSTAKE ERC20 token contract address on Base Sepolia
- **Where to get:** From Phase 5 deployment (`contracts/deployed/VestingContract-testnet.json`)

### `CSTAKE_UNISWAP_POOL_ADDRESS`
- **Required:** No
- **Type:** Ethereum address
- **Default:** None (falls back to manual/fallback pricing)
- **Description:** Uniswap V2 pool address for $CSTAKE/USDC pair
- **When to set:** After creating liquidity pool on Uniswap
- **Testnet Note:** Usually empty until liquidity is added

### `CSTAKE_MANUAL_PRICE`
- **Required:** No
- **Type:** Number (USD)
- **Default:** None (uses fallback of $0.10)
- **Description:** Override token price for testing/development
- **Example:** `0.25` for $0.25 per token
- **Use case:** Testing USD value calculations, demoing to investors

## Pricing Priority

The token price service uses this priority:

1. **Manual Price Override** - If `CSTAKE_MANUAL_PRICE` is set
2. **Uniswap Pool** - If `CSTAKE_UNISWAP_POOL_ADDRESS` is configured and pool exists
3. **Fallback Price** - $0.10 (testnet default)

## Setting Up Your .env.local

1. Copy the template variables above
2. Create/edit `.env.local` in project root
3. Fill in your actual values
4. Never commit this file to git!

## Testnet Resources

- **Base Sepolia Chain ID:** 84532
- **RPC URL:** https://sepolia.base.org
- **Block Explorer:** https://sepolia.basescan.org
- **Testnet Faucet:** https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## Security Notes

⚠️ **NEVER:**
- Share your `FOUNDATION_WALLET_PRIVATE_KEY`
- Commit `.env.local` to git
- Use production keys in testnet or vice versa
- Expose private keys in client-side code

✅ **ALWAYS:**
- Keep `.env.local` protected (it's in `.gitignore` and `.cursorignore`)
- Use separate wallets for testnet and production
- Rotate keys if exposed
- Use `NEXT_PUBLIC_` prefix only for safe client-side variables

