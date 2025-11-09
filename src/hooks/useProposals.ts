/**
 * useProposals Hook
 * Phase 6: React Query hook for fetching and managing proposals
 * Provides automatic refetching, caching, and invalidation
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Proposal } from '@/types/proposal'

/**
 * Hook to fetch user's proposals with React Query
 * Auto-refetches and caches data
 */
export function useProposals() {
  const { data, isLoading, error, refetch } = useQuery<Proposal[]>({
    queryKey: ['proposals', 'me'],
    queryFn: async () => {
      const response = await fetch('/api/proposals/me')
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch proposals')
      }
      
      const data = await response.json()
      return data.proposals || []
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  })

  return {
    proposals: data || [],
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to respond to a proposal (accept/reject)
 * Automatically invalidates proposals query after mutation
 */
export function useRespondToProposal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      proposalId, 
      action 
    }: { 
      proposalId: string
      action: 'accept' | 'reject' 
    }) => {
      const response = await fetch(`/api/proposals/respond/${proposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to respond')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate proposals to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['proposals'] })
      // Also invalidate token balance (might have changed)
      queryClient.invalidateQueries({ queryKey: ['tokenBalance'] })
    },
  })
}

/**
 * Hook to confirm work completion
 * Automatically invalidates proposals and balance queries
 */
export function useConfirmWork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (proposalId: string) => {
      const response = await fetch(`/api/contracts/confirm-work/${proposalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to confirm work')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate proposals to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['proposals'] })
    },
  })
}

/**
 * Hook to manually invalidate all queries
 * Useful for refresh buttons or after major state changes
 */
export function useRefreshAll() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ['proposals'] })
    queryClient.invalidateQueries({ queryKey: ['tokenBalance'] })
    queryClient.invalidateQueries({ queryKey: ['tokenPrice'] })
  }
}

