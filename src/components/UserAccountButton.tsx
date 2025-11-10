'use client'

/**
 * UserAccountButton Component
 * Custom user display for authenticated users
 * Shows email/name instead of wallet address for better UX
 */

import { useState, useEffect, useRef } from 'react'
import { useActiveAccount, useDisconnect } from 'thirdweb/react'
import { ChevronDown, User, LogOut, Wallet, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

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

  // Get user info from Thirdweb account
  useEffect(() => {
    async function getUserInfo() {
      if (!account) return

      try {
        // For InAppWallet with social login, account might have user details
        // Try to extract from account metadata or make API call
        const accountDetails = (account as any)?.details
        const accountInfo = (account as any)?.info
        
        // Check various possible locations for user data
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
    try {
      await logout()
      if (wallet) {
        disconnect(wallet)
      }
      setIsOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Determine display name/email
  const displayName = userInfo.name || userInfo.email || `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
  const hasEmailOrName = !!(userInfo.name || userInfo.email)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

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
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
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

