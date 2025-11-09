'use client'

/**
 * Protected Route Component
 * Wraps pages/components that require wallet authentication
 * 
 * Flow:
 * 1. No wallet? -> Show "Connect Wallet" prompt
 * 2. Wallet but not authenticated? -> Show "Sign Message" prompt
 * 3. Authenticated? -> Render children
 */

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ConnectButton } from 'thirdweb/react'
import { client } from '@/lib/thirdweb'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * ProtectedRoute Component
 * 
 * Ensures user is connected and authenticated before showing content
 * 
 * @param children - Content to show when authenticated
 * 
 * @example
 * <ProtectedRoute>
 *   <ProposalForm />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { wallet, isAuthenticated, login, isLoading, error } = useAuth()

  // Step 1: No wallet connected
  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Connect Your Wallet
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300">
            You need to connect a Web3 wallet to access this page
          </p>
          
          <div className="pt-4">
            <ConnectButton
              client={client}
              theme="dark"
              connectButton={{
                label: "Connect Wallet",
              }}
              connectModal={{
                title: "Join CrowdStaking",
                showThirdwebBranding: false,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Wallet connected but not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign In to Continue
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300">
            Please sign a message with your wallet to verify ownership
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connected: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{wallet?.slice(0, 6)}...{wallet?.slice(-4)}</code>
          </p>
          
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="pt-4">
            <button
              onClick={login}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing...
                </span>
              ) : (
                'Sign Message'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Fully authenticated - show content
  return <>{children}</>
}

