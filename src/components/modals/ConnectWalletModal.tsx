'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
  actionName?: string
}

/**
 * ConnectWalletModal Component
 * 
 * Modal that prompts users to connect their wallet to perform protected actions.
 * Uses the useAuth hook to trigger wallet connection.
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal should close
 * @param actionName - Name of the action requiring authentication (e.g., "Create Mission")
 */
export function ConnectWalletModal({ isOpen, onClose, actionName }: ConnectWalletModalProps) {
  const { login, isLoading, isAuthenticated } = useAuth()

  // Close modal when authentication succeeds
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose()
    }
  }, [isAuthenticated, isOpen, onClose])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleConnect = async () => {
    try {
      await login()
      // Modal will close automatically via useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-blue-600 dark:text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
          Connect Your Wallet
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {actionName ? (
            <>
              To <span className="font-semibold">{actionName}</span>, please connect your wallet first.
            </>
          ) : (
            'Please connect your wallet to perform this action.'
          )}
        </p>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          We'll never access your private keys or funds without your explicit permission.
        </p>
      </div>
    </div>
  )
}

