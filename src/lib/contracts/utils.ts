/**
 * Contract utility functions
 * Provides helpers for blockchain interaction
 */

import { keccak256, toUtf8Bytes } from 'ethers';

/**
 * Converts a UUID string to a uint256 for smart contract use
 * 
 * @param uuid - UUID string (with or without hyphens)
 * @returns bigint representation suitable for Solidity uint256
 * 
 * @example
 * ```typescript
 * const proposalId = '123e4567-e89b-12d3-a456-426614174000';
 * const uint256Id = uuidToUint256(proposalId);
 * // → 12345678901234567890n (example)
 * ```
 * 
 * @remarks
 * - Conversion is deterministic: same UUID always produces same uint256
 * - Uses keccak256 hash to ensure different UUIDs produce different numbers
 * - Removes hyphens before hashing for consistency
 */
export function uuidToUint256(uuid: string): bigint {
  if (!uuid || typeof uuid !== 'string') {
    throw new Error('Invalid UUID: must be a non-empty string');
  }
  
  // Remove hyphens from UUID for consistent hashing
  const cleanUuid = uuid.replace(/-/g, '');
  
  // Validate cleaned UUID is 32 hex characters
  if (!/^[0-9a-fA-F]{32}$/.test(cleanUuid)) {
    throw new Error('Invalid UUID format');
  }
  
  // Hash the UUID to get a deterministic uint256
  const hash = keccak256(toUtf8Bytes(cleanUuid));
  
  // Convert hex string to bigint
  return BigInt(hash);
}

/**
 * Converts CSTAKE token amount from human-readable format to wei (smallest unit)
 * 
 * @param amount - Amount in CSTAKE tokens (e.g., 100 for 100 tokens)
 * @param decimals - Token decimals (default: 18)
 * @returns Amount in wei as bigint
 * 
 * @example
 * ```typescript
 * const humanAmount = 100; // 100 CSTAKE
 * const weiAmount = tokenAmountToWei(humanAmount);
 * // → 100000000000000000000n (100 * 10^18)
 * ```
 */
export function tokenAmountToWei(amount: number, decimals: number = 18): bigint {
  if (amount < 0) {
    throw new Error('Amount must be non-negative');
  }
  
  if (!Number.isFinite(amount)) {
    throw new Error('Amount must be a finite number');
  }
  
  // Convert to string to avoid floating point issues
  const amountStr = amount.toString();
  const [whole, fraction = ''] = amountStr.split('.');
  
  // Pad fraction to correct decimals
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  
  // Combine whole and fraction
  const weiStr = whole + paddedFraction;
  
  return BigInt(weiStr);
}

/**
 * Converts wei amount to human-readable CSTAKE tokens
 * 
 * @param weiAmount - Amount in wei as bigint or string
 * @param decimals - Token decimals (default: 18)
 * @returns Amount in CSTAKE tokens as number
 * 
 * @example
 * ```typescript
 * const weiAmount = 100000000000000000000n; // 100 * 10^18
 * const humanAmount = weiToTokenAmount(weiAmount);
 * // → 100
 * ```
 */
export function weiToTokenAmount(weiAmount: bigint | string, decimals: number = 18): number {
  const wei = typeof weiAmount === 'string' ? BigInt(weiAmount) : weiAmount;
  
  if (wei < 0n) {
    throw new Error('Wei amount must be non-negative');
  }
  
  const divisor = 10n ** BigInt(decimals);
  const whole = wei / divisor;
  const remainder = wei % divisor;
  
  // Convert to decimal
  const wholeNum = Number(whole);
  const fractionNum = Number(remainder) / Number(divisor);
  
  return wholeNum + fractionNum;
}

