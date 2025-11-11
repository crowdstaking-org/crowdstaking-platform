/**
 * UserProfileLink Component
 * 
 * Reusable component to display a user profile with avatar, name, and optional trust score.
 * Always links to the user's profile page.
 * 
 * Features:
 * - Fetches profile data if not provided
 * - Shows avatar with gradient fallback
 * - Shows display name or shortened address
 * - Optional trust score badge
 * - Responsive sizing
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <UserProfileLink
 *   walletAddress="0x1234..."
 *   displayName="Alice"
 *   avatarUrl="/avatar.jpg"
 *   showTrustScore={true}
 *   size="md"
 * />
 * ```
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface UserProfileLinkProps {
  walletAddress: string           // Required: The user's wallet address
  displayName?: string             // Optional: Will be fetched if not provided
  avatarUrl?: string               // Optional: Will be fetched if not provided
  trustScore?: number              // Optional: Trust score to display
  size?: 'xs' | 'sm' | 'md' | 'lg' // Avatar size
  showAvatar?: boolean             // Default: true
  showName?: boolean               // Default: true
  showTrustScore?: boolean         // Default: false
  showAddress?: boolean            // Show address instead of name
  asLink?: boolean                 // Default: true - render as link, false for span
  className?: string               // Additional CSS classes
  onClick?: () => void             // Optional custom click handler
  referrer?: string                // Optional: Where the user came from (for breadcrumbs)
}

interface ProfileData {
  display_name: string
  avatar_url?: string
  trust_score?: number
}

export function UserProfileLink({
  walletAddress,
  displayName,
  avatarUrl,
  trustScore,
  size = 'md',
  showAvatar = true,
  showName = true,
  showTrustScore = false,
  showAddress = false,
  asLink = true,
  className = '',
  onClick,
  referrer,
}: UserProfileLinkProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Fetch profile data if not provided
  useEffect(() => {
    // Only fetch if we don't have the data we need
    const needsFetch = !displayName || !avatarUrl || (showTrustScore && !trustScore)
    
    if (!needsFetch) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/profiles/${walletAddress}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        
        const data = await response.json()
        setProfileData(data.profile)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [walletAddress, displayName, avatarUrl, trustScore, showTrustScore])

  // Determine what to display
  const finalDisplayName = displayName || profileData?.display_name
  const finalAvatarUrl = avatarUrl || profileData?.avatar_url
  const finalTrustScore = trustScore ?? profileData?.trust_score

  // Format wallet address (shortened)
  const shortenedAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
  const displayText = showAddress 
    ? shortenedAddress 
    : (finalDisplayName || shortenedAddress)

  // Size configurations
  const sizeConfig = {
    xs: {
      avatar: 'w-6 h-6',
      text: 'text-xs',
      gap: 'gap-1.5',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    sm: {
      avatar: 'w-8 h-8',
      text: 'text-sm',
      gap: 'gap-2',
      badge: 'text-xs px-2 py-0.5',
    },
    md: {
      avatar: 'w-10 h-10',
      text: 'text-base',
      gap: 'gap-2.5',
      badge: 'text-sm px-2 py-1',
    },
    lg: {
      avatar: 'w-12 h-12',
      text: 'text-lg',
      gap: 'gap-3',
      badge: 'text-sm px-2.5 py-1',
    },
  }

  const config = sizeConfig[size]

  // Trust score color
  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    if (score >= 60) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    if (score >= 40) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  // Loading state
  if (loading && !finalDisplayName && !error) {
    return (
      <div className={`flex items-center ${config.gap} animate-pulse ${className}`}>
        {showAvatar && (
          <div className={`${config.avatar} rounded-full bg-gray-300 dark:bg-gray-700`} />
        )}
        {showName && (
          <div className={`h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded`} />
        )}
      </div>
    )
  }

  // Content to render (same for link and span)
  const content = (
    <>
      {/* Avatar */}
      {showAvatar && (
        <div className={`${config.avatar} rounded-full overflow-hidden flex-shrink-0`}>
          {finalAvatarUrl ? (
            <Image
              src={finalAvatarUrl}
              alt={finalDisplayName || 'User'}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {(finalDisplayName || '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Name and Trust Score */}
      {showName && (
        <div className="flex items-center gap-2 min-w-0">
          <span className={`${config.text} font-medium text-gray-900 dark:text-white truncate`}>
            {displayText}
          </span>
          
          {showTrustScore && finalTrustScore !== undefined && (
            <span 
              className={`${config.badge} rounded-full font-semibold flex-shrink-0 ${getTrustScoreColor(finalTrustScore)}`}
              title={`Trust Score: ${finalTrustScore}/100`}
            >
              {finalTrustScore}
            </span>
          )}
        </div>
      )}
    </>
  )

  // Render as link or span based on asLink prop
  if (!asLink) {
    return (
      <div
        className={`flex items-center ${config.gap} ${className}`}
        title={`${finalDisplayName || walletAddress}`}
      >
        {content}
      </div>
    )
  }

  // Build profile URL with optional referrer
  const profileUrl = referrer 
    ? `/profiles/${walletAddress}?from=${referrer}`
    : `/profiles/${walletAddress}`

  return (
    <Link
      href={profileUrl}
      onClick={handleClick}
      className={`flex items-center ${config.gap} hover:opacity-80 transition-opacity ${className}`}
      title={`View profile of ${finalDisplayName || walletAddress}`}
    >
      {content}
    </Link>
  )
}

