'use client'

/**
 * UserAccountButton Component
 * Custom user display for authenticated users
 * Shows email/name instead of wallet address for better UX
 */

import { useState, useEffect, useRef } from 'react'
import { useActiveAccount, useDisconnect } from 'thirdweb/react'
import { ChevronDown, User, LogOut, Wallet, Mail, Bookmark, UserCircle, Settings, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export function UserAccountButton() {
  const account = useActiveAccount()
  const { disconnect } = useDisconnect()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<{
    email?: string
    name?: string
    avatar?: string
  }>({})
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get the wallet from account
  const wallet = (account as any)?._wallet

  // Get user info from Supabase profile and ThirdWeb account
  useEffect(() => {
    async function getUserInfo() {
      if (!account) return

      try {
        // First, try to get info from Supabase profile
        const response = await fetch(`/api/profiles/${account.address}`)
        if (response.ok) {
          const data = await response.json()
          const profile = data.profile
          
          if (profile) {
            setUserInfo({
              email: profile.email,
              name: profile.display_name,
              avatar: profile.avatar_url,
            })
            return
          }
        }
        
        // Fallback: Try to extract from ThirdWeb account metadata
        const accountDetails = (account as any)?.details
        const accountInfo = (account as any)?.info
        
        const email = accountDetails?.email || accountInfo?.email
        const name = accountDetails?.name || accountInfo?.name || accountDetails?.displayName
        const avatar = accountDetails?.picture || accountDetails?.avatar || accountInfo?.picture
        
        if (email || name || avatar) {
          setUserInfo({
            email,
            name,
            avatar,
          })
        }
      } catch (error) {
        console.log('Could not fetch user details:', error)
      }
    }

    getUserInfo()
  }, [account])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!account) return null

  const handleDisconnect = async () => {
    setIsOpen(false)
    
    console.log('🔴 LOGOUT: Starting logout process...')
    
    try {
      // Step 1: Clear ThirdWeb wallet data from localStorage FIRST
      // This prevents auto-reconnect on next page load
      const thirdWebKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('thirdweb:') || 
        key.startsWith('walletToken-') ||
        key === 'lastAuthProvider'
      )
      console.log('🔴 LOGOUT: Clearing ThirdWeb keys:', thirdWebKeys)
      thirdWebKeys.forEach(key => localStorage.removeItem(key))
      
      // Step 2: Call logout API to clear session cookie
      console.log('🔴 LOGOUT: Calling logout API...')
      await logout().catch(error => {
        console.error('Logout API call failed:', error)
      })
      
      // Step 3: Disconnect wallet from ThirdWeb
      // This will set account to null and trigger useAuth cleanup
      console.log('🔴 LOGOUT: Disconnecting wallet...')
      if (wallet) {
        await disconnect(wallet).catch(error => {
          console.error('Wallet disconnect failed:', error)
        })
      }
      
      console.log('🔴 LOGOUT: Complete! Redirecting to homepage...')
      
      // Step 4: Navigate to homepage (triggers state reset without page reload)
      // Small delay to ensure disconnect completes
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
      
    } catch (error) {
      console.error('🔴 LOGOUT ERROR:', error)
      // Even on error, try to navigate away
      window.location.href = '/'
    }
  }

  // Determine display name/email
  const displayName = userInfo.name || userInfo.email || `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
  const hasEmailOrName = !!(userInfo.name || userInfo.email)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Split Button: Dashboard Link + Dropdown */}
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {/* Left: Dashboard Link (Avatar + User Info) */}
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
            {userInfo.avatar ? (
              <img 
                src={userInfo.avatar} 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>

          {/* User Info */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {userInfo.name || 'Account'}
            </span>
            {userInfo.email && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {userInfo.email}
              </span>
            )}
            {!hasEmailOrName && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </span>
            )}
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* Right: Dropdown Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                {userInfo.avatar ? (
                  <img 
                    src={userInfo.avatar} 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {userInfo.name && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {userInfo.name}
                  </p>
                )}
                {userInfo.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userInfo.email}
                  </p>
                )}
              </div>
            </div>

            {/* Wallet Address */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Wallet className="w-3 h-3" />
              <code className="font-mono">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(account.address)
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href={`/profiles/${account.address}`}
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <UserCircle className="w-4 h-4" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/bookmarks"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks</span>
            </Link>
            <Link
              href="/settings/profile"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Logout - Separator */}
          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('🔴 LOGOUT BUTTON CLICKED!')
                handleDisconnect()
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

