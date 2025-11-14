/**
 * ThirdWeb SDK v5 Configuration
 * Configures client and supported chains for Web3 integration
 */

import { createThirdwebClient } from "thirdweb";
import { base, baseSepolia, ethereum } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";

// Get Client ID from environment or use development fallback
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

// Development warning if Client ID is missing
if (!clientId && typeof window !== "undefined") {
  console.warn(
    "⚠️ ThirdWeb Client ID not found. " +
    "Please create .env.local and add NEXT_PUBLIC_THIRDWEB_CLIENT_ID. " +
    "Get your Client ID from: https://thirdweb.com/dashboard"
  );
}

// Create ThirdWeb client (required for v5)
export const client = createThirdwebClient({
  clientId: clientId || "ce354da832525e0a5b35810270a39a7a",
});

// Supported blockchain networks (using thirdweb/chains)
export const supportedChains = [
  baseSepolia, // Base Sepolia Testnet (for testing)
  base,        // Base Mainnet (lower gas fees)
  ethereum,    // Ethereum Mainnet
];

// Default chain for connections
export const defaultChain = base;

// Chain for token deployment (testnet for MVP, mainnet for production)
export const deploymentChain = baseSepolia; // TODO: Change to 'base' for mainnet

// Multi-Auth Configuration: Email + Wallet + Social Login
// With Smart Account for Sponsored Transactions (gasless!)
export const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "google", "wallet"],
    },
    smartAccount: {
      chain: baseSepolia,
      sponsorGas: true, // ThirdWeb pays gas - user needs NO ETH!
    },
  }),
];

