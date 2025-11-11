'use client'

/**
 * Authentication Hook
 * Manages wallet authentication state and login/logout functionality
 * 
 * Uses ThirdWeb for wallet connection and signature verification
 */

import { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { generateLoginPayload } from '@/lib/auth/thirdweb-auth'

interface AuthState {
  wallet: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
}

/**
 * useAuth Hook
 * 
 * Provides authentication state and functions for the entire app
 * 
 * @returns Auth state and functions
 * 
 * @example
 * const { wallet, isAuthenticated, login, logout } = useAuth()
 * 
 * if (!isAuthenticated) {
 *   return <button onClick={login}>Sign In</button>
 * }
 */
export function useAuth(): AuthState {
  const account = useActiveAccount()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already authenticated when wallet connects
  useEffect(() => {
    if (account) {
      checkAuthStatus()
    } else {
      setIsAuthenticated(false)
    }
  }, [account])

  const checkAuthStatus = async () => {
    try {
      // Check if session cookie exists by making a test request
      const response = await fetch('/api/test-auth')
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch {
      setIsAuthenticated(false)
    }
  }

  const login = async () => {
    if (!account) {
      setError('No wallet connected')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Generate message to sign
      const message = generateLoginPayload(account.address)

      // Request signature from wallet
      // Using eth_sign method through ThirdWeb
      const signature = await account.signMessage({ message })

      // Send to login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account.address,
          message,
          signature,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      setIsAuthenticated(true)
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await fetch('/api/auth/logout', {
        method: 'POST',
      })

      setIsAuthenticated(false)
    } catch (err) {
      console.error('Logout error:', err)
      setError(err instanceof Error ? err.message : 'Logout failed')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    wallet: account?.address || null,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  }
}


