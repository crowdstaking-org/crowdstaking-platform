/**
 * In-Memory Price Cache
 * Phase 6: Simple caching mechanism for token prices
 * Reduces API calls and improves performance
 */

interface CachedPrice {
  price: number
  timestamp: number
}

// In-memory cache for token price
let cache: CachedPrice | null = null

// Cache duration: 60 seconds
const CACHE_DURATION = 60000

/**
 * Get cached price if still valid
 * @returns cached price or null if expired/missing
 */
export function getCachedPrice(): number | null {
  if (!cache) {
    return null
  }
  
  const now = Date.now()
  const age = now - cache.timestamp
  
  // Check if cache has expired
  if (age > CACHE_DURATION) {
    cache = null
    return null
  }
  
  return cache.price
}

/**
 * Set new price in cache
 * @param price - The token price to cache
 */
export function setCachedPrice(price: number): void {
  cache = {
    price,
    timestamp: Date.now(),
  }
}

/**
 * Clear the cache (useful for testing or forced refresh)
 */
export function clearCache(): void {
  cache = null
}

