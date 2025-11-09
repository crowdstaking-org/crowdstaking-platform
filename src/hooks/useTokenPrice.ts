/**
 * useTokenPrice Hook
 * Phase 6: Fetches $CSTAKE token price from API
 * Uses React Query for caching and automatic refetching
 */

'use client'

import { useQuery } from '@tanstack/react-query'

/**
 * API response interface for token price endpoint
 */
interface TokenPriceResponse {
  success: boolean
  price: number
  currency: string
  timestamp: string
  cached?: boolean
  error?: string
}

/**
 * Hook to fetch and cache $CSTAKE token price
 * - Auto-refetches every 60 seconds
 * - Refetches on window focus
 * - Caches for 60 seconds
 * 
 * @returns price data, loading state, error state, and refetch function
 */
export function useTokenPrice() {
  const { data, isLoading, error, refetch } = useQuery<TokenPriceResponse>({
    queryKey: ['tokenPrice'],
    queryFn: async () => {
      const response = await fetch('/api/token-price')
      
      if (!response.ok) {
        throw new Error('Failed to fetch token price')
      }
      
      const data: TokenPriceResponse = await response.json()
      return data
    },
    // Consider data fresh for 60 seconds
    staleTime: 60000,
    // Auto-refetch every 60 seconds
    refetchInterval: 60000,
    // Refetch when user returns to window
    refetchOnWindowFocus: true,
    // Retry once on failure
    retry: 1,
  })
  
  return {
    price: data?.price ?? 0,
    currency: data?.currency ?? 'USD',
    timestamp: data?.timestamp,
    cached: data?.cached ?? false,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to format price for display
 * @param price - Raw price number
 * @returns formatted price string (e.g., "$0.10")
 */
export function useFormattedPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(price)
}

