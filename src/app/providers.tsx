'use client'

/**
 * Client-side Providers wrapper
 * Wraps the app with ThirdWeb Provider for Web3 functionality
 * Using ThirdWeb SDK v5
 * Phase 6: Added React Query for data fetching and caching
 */

import { ThirdwebProvider } from "thirdweb/react";
import { client, supportedChains } from "@/lib/thirdweb";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance with default options
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // 60 seconds - data considered fresh
        refetchOnWindowFocus: true, // Refetch when user returns to window
        retry: 1, // Retry failed requests once
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        {children}
        {/* Show React Query Devtools in development mode */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

