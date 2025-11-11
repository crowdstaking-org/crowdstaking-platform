'use client'

/**
 * Authentication Hook
 * Manages wallet authentication state and login/logout functionality
 * 
 * Uses ThirdWeb for wallet connection and signature verification
 */

import { useState, useEffect, useRef } from 'react'
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
  const loginAttemptedRef = useRef<string | null>(null)

  // Check if user is already authenticated when wallet connects
  // If not authenticated, auto-trigger login (once per address)
  useEffect(() => {
    if (account) {
      const address = account.address.toLowerCase()
      
      // Prevent multiple login attempts for same address
      if (loginAttemptedRef.current === address) {
        return
      }
      
      checkAuthStatus().then(async () => {
        // Double-check we haven't already tried this address
        if (loginAttemptedRef.current === address) {
          return
        }
        
        // Check if session exists
        const response = await fetch('/api/test-auth')
        if (!response.ok) {
          // No valid session - trigger login automatically
          console.log('🔄 No session found, auto-triggering login for:', address)
          loginAttemptedRef.current = address
          await login()
        } else {
          console.log('✅ Valid session found for:', address)
          setIsAuthenticated(true)
        }
      })
    } else {
      setIsAuthenticated(false)
      loginAttemptedRef.current = null
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

      // Debug: Log wallet info to understand structure
      const wallet = (account as any)?._wallet
      const walletId = wallet?.id
      console.log('🔍 Login Debug:', {
        walletId,
        walletType: typeof wallet,
        accountType: account.constructor?.name,
        hasWallet: !!wallet,
      })
      
      // Check if this is an InApp Wallet (Email OTP, Social Login)
      // InApp Wallets use email/social auth, not signature
      // Try multiple detection methods
      const isInAppWallet = 
        walletId === 'inApp' || 
        walletId === 'embedded' ||
        walletId === 'embeddedWallet' ||
        wallet?.walletId === 'inApp' ||
        !wallet || // If no wallet object, assume InApp
        (account as any)?.type === 'inApp'
      
      console.log('🔍 Is InApp Wallet?', isInAppWallet)
      
      if (isInAppWallet) {
        console.log('✅ Using Email/Social Login flow')
        
        // Get email from account if available
        const accountDetails = (account as any)?.details
        const accountInfo = (account as any)?.info
        const email = accountDetails?.email || accountInfo?.email
        const authMethod = accountDetails?.authMethod || 'email'
        
        console.log('📧 Email/Auth:', { email, authMethod })
        
        // Use email login endpoint (no signature required)
        const response = await fetch('/api/auth/email-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: account.address,
            email,
            authMethod,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Login failed')
        }
        
        const result = await response.json()
        console.log('✅ Email login successful:', result)

        setIsAuthenticated(true)
        return
      }

      console.log('🔐 Using Wallet Signature Login flow')

      // Traditional wallet signature login
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
      loginAttemptedRef.current = null

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


