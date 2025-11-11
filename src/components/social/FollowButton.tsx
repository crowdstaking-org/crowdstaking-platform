/**
 * Follow Button Component
 * Follow/Unfollow user with count
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { showToast } from '@/lib/toast'

interface FollowButtonProps {
  targetAddress: string
}

export function FollowButton({ targetAddress }: FollowButtonProps) {
  const { wallet, isAuthenticated } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (wallet) {
      checkIfFollowing()
    }
  }, [wallet, targetAddress])

  async function checkIfFollowing() {
    try {
      const response = await fetch(`/api/social/following/${wallet}`)
      if (response.ok) {
        const data = await response.json()
        const following = data.following.some(
          (f: any) => f.following_address.toLowerCase() === targetAddress.toLowerCase()
        )
        setIsFollowing(following)
      }
    } catch (error) {
      console.error('Failed to check follow status:', error)
    }
  }

  async function handleFollow() {
    if (!wallet || !isAuthenticated) {
      showToast('Please log in to follow users', 'error')
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
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`/api/social/follow?address=${targetAddress}`, {
          method: 'DELETE',
          headers: {
            'x-wallet-address': wallet,
          },
        })

        if (response.ok) {
          setIsFollowing(false)
          showToast('Unfollowed successfully', 'success')
        } else {
          const errorData = await response.json()
          if (response.status === 401) {
            showToast('Please log in to unfollow users', 'error')
          } else {
            throw new Error(errorData.error || 'Failed to unfollow')
          }
        }
      } else {
        // Follow
        const response = await fetch('/api/social/follow', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-wallet-address': wallet,
          },
          body: JSON.stringify({ following_address: targetAddress }),
        })

        if (response.ok) {
          setIsFollowing(true)
          showToast('Followed successfully', 'success')
        } else {
          const errorData = await response.json()
          if (response.status === 401) {
            showToast('Please log in to follow users', 'error')
          } else {
            throw new Error(errorData.error || 'Failed to follow')
          }
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Error while following', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Show login prompt if not authenticated
  if (!wallet || !isAuthenticated) {
    return (
      <button
        onClick={() => showToast('Please log in to follow users', 'info')}
        className="px-4 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
      >
        Follow
      </button>
    )
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isFollowing
          ? 'bg-gray-600 hover:bg-gray-700 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  )
}

