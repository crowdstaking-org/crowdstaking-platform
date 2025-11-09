/**
 * ThirdWeb SDK v5 Configuration
 * Configures client and supported chains for Web3 integration
 */

import { createThirdwebClient } from "thirdweb";
import { base, ethereum } from "thirdweb/chains";

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
  base,      // Base (lower gas fees)
  ethereum,  // Ethereum Mainnet
];

// Default chain for connections
export const defaultChain = base;

