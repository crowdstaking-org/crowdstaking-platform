/**
 * Bookmark Button Component
 * Bookmark/Unbookmark user
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { showToast } from '@/lib/toast'

interface BookmarkButtonProps {
  targetAddress: string
}

export function BookmarkButton({ targetAddress }: BookmarkButtonProps) {
  const { wallet, isAuthenticated } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (wallet) {
      checkIfBookmarked()
    }
  }, [wallet, targetAddress])

  async function checkIfBookmarked() {
    if (!wallet) return
    
    try {
      const response = await fetch('/api/social/bookmarks', {
        headers: {
          'x-wallet-address': wallet,
        },
      })
      if (response.ok) {
        const data = await response.json()
        const bookmarked = data.bookmarks.some(
          (b: any) => b.bookmarked_address.toLowerCase() === targetAddress.toLowerCase()
        )
        setIsBookmarked(bookmarked)
      }
    } catch (error) {
      console.error('Failed to check bookmark status:', error)
    }
  }

  async function handleBookmark() {
    if (!wallet || !isAuthenticated) {
      showToast('Please log in to bookmark users', 'error')
      return
    }

    // Validate wallet format
    if (!wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      console.error('Invalid wallet format:', wallet)
      showToast('Invalid wallet address format', 'error')
      return
    }

    setLoading(true)
    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/social/bookmark?address=${targetAddress}`, {
          method: 'DELETE',
          headers: {
            'x-wallet-address': wallet,
          },
        })

        if (response.ok) {
          setIsBookmarked(false)
          showToast('Bookmark removed', 'success')
        } else {
          const errorData = await response.json()
          if (response.status === 401) {
            showToast('Please log in to remove bookmarks', 'error')
          } else {
            throw new Error(errorData.error || 'Failed to remove bookmark')
          }
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/social/bookmark', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-wallet-address': wallet,
          },
          body: JSON.stringify({ bookmarked_address: targetAddress }),
        })

        if (response.ok) {
          setIsBookmarked(true)
          showToast('Bookmark saved', 'success')
        } else {
          const errorData = await response.json()
          if (response.status === 401) {
            showToast('Please log in to bookmark users', 'error')
          } else {
            throw new Error(errorData.error || 'Failed to bookmark')
          }
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Error while bookmarking', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Show login prompt if not authenticated
  if (!wallet || !isAuthenticated) {
    return (
      <button
        onClick={() => showToast('Please log in to bookmark users', 'info')}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer transition-colors"
        title="Bookmark (login required)"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors ${
        isBookmarked 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      <svg
        className="w-5 h-5"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  )
}

