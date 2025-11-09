/**
 * ThirdWeb Authentication Utilities
 * Provides secure wallet authentication using ThirdWeb SDK v5
 * 
 * This replaces the Phase 1 trust-based authentication with
 * cryptographic signature verification.
 */

import { verifySignature as thirdwebVerifySignature } from 'thirdweb/auth'
import { client } from '@/lib/thirdweb'

/**
 * Generates a login payload (message) for the user to sign
 * 
 * This creates a standard message that the user's wallet will sign.
 * The message includes:
 * - The wallet address (to prevent replay attacks)
 * - A timestamp (to prevent old signatures being reused)
 * - The domain (to prevent signatures from other apps)
 * 
 * @param address - Ethereum wallet address
 * @returns Message to be signed by the wallet
 */
export function generateLoginPayload(address: string): string {
  const timestamp = Date.now()
  const domain = typeof window !== 'undefined' ? window.location.host : 'localhost:3000'
  
  return `Sign this message to authenticate with CrowdStaking:

Address: ${address}
Timestamp: ${timestamp}
Domain: ${domain}

This request will not trigger a blockchain transaction or cost any gas fees.`
}

/**
 * Verifies a wallet signature
 * 
 * Uses ThirdWeb SDK to cryptographically verify that:
 * 1. The signature was created by the claimed wallet address
 * 2. The signature is for the exact message provided
 * 
 * @param params - Verification parameters
 * @param params.address - Ethereum wallet address that allegedly signed the message
 * @param params.message - Original message that was signed
 * @param params.signature - Cryptographic signature from wallet
 * @returns Promise<boolean> - true if signature is valid
 */
export async function verifyLoginSignature(params: {
  address: string
  message: string
  signature: string
}): Promise<boolean> {
  try {
    const isValid = await thirdwebVerifySignature({
      message: params.message,
      signature: params.signature,
      address: params.address,
      client,
    })

    return isValid
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

/**
 * Extracts wallet address from a verified message
 * 
 * The message format includes "Address: 0x..." line
 * This helper extracts it safely
 * 
 * @param message - Login message that was signed
 * @returns Wallet address or null if not found
 */
export function extractAddressFromMessage(message: string): string | null {
  const addressMatch = message.match(/Address:\s*(0x[a-fA-F0-9]{40})/)
  return addressMatch ? addressMatch[1] : null
}

