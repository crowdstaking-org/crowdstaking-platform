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
  const { walletAddress } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      checkIfBookmarked()
    }
  }, [walletAddress, targetAddress])

  async function checkIfBookmarked() {
    try {
      const response = await fetch('/api/social/bookmarks')
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
    if (!walletAddress) {
      showToast('Bitte verbinde deine Wallet', 'error')
      return
    }

    setLoading(true)
    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/social/bookmark?address=${targetAddress}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setIsBookmarked(false)
          showToast('Bookmark entfernt', 'success')
        } else {
          throw new Error('Failed to remove bookmark')
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/social/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookmarked_address: targetAddress }),
        })

        if (response.ok) {
          setIsBookmarked(true)
          showToast('Bookmark gespeichert', 'success')
        } else {
          throw new Error('Failed to bookmark')
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Fehler beim Bookmarken', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!walletAddress) {
    return null
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors ${
        isBookmarked ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isBookmarked ? 'Bookmark entfernen' : 'Bookmarken'}
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

