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
  const { walletAddress } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      checkIfFollowing()
    }
  }, [walletAddress, targetAddress])

  async function checkIfFollowing() {
    try {
      const response = await fetch(`/api/social/following/${walletAddress}`)
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
    if (!walletAddress) {
      showToast('Bitte verbinde deine Wallet', 'error')
      return
    }

    setLoading(true)
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`/api/social/follow?address=${targetAddress}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setIsFollowing(false)
          showToast('Nicht mehr gefolgt', 'success')
        } else {
          throw new Error('Failed to unfollow')
        }
      } else {
        // Follow
        const response = await fetch('/api/social/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ following_address: targetAddress }),
        })

        if (response.ok) {
          setIsFollowing(true)
          showToast('Erfolgreich gefolgt', 'success')
        } else {
          const error = await response.json()
          throw new Error(error.error || 'Failed to follow')
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Fehler beim Folgen', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!walletAddress) {
    return null
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isFollowing
          ? 'bg-gray-600 hover:bg-gray-700 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Lädt...' : isFollowing ? 'Nicht mehr folgen' : 'Folgen'}
    </button>
  )
}

