/**
 * ProfileBadge Component
 * 
 * Compact inline display of user profile (avatar + name).
 * Useful for lists, tables, and cards where space is limited.
 * 
 * Features:
 * - Compact layout (horizontal or vertical)
 * - Links to profile
 * - Optional trust score display
 * - Responsive sizing
 * 
 * Usage:
 * ```tsx
 * <ProfileBadge
 *   walletAddress="0x..."
 *   profile={{ displayName: 'Alice', avatarUrl: '...', trustScore: 85 }}
 *   layout="horizontal"
 *   showTrustScore={true}
 * />
 * ```
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'

export interface ProfileBadgeProps {
  walletAddress: string
  profile?: {
    displayName: string
    avatarUrl?: string
    trustScore?: number
  }
  layout?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md'
  showTrustScore?: boolean
  className?: string
}

export function ProfileBadge({
  walletAddress,
  profile,
  layout = 'horizontal',
  size = 'md',
  showTrustScore = false,
  className = '',
}: ProfileBadgeProps) {
  const displayName = profile?.displayName || `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
  const avatarUrl = profile?.avatarUrl
  const trustScore = profile?.trustScore

  // Size configurations
  const sizeConfig = {
    sm: {
      avatar: 'w-8 h-8',
      text: 'text-sm',
      badge: 'text-xs px-1.5 py-0.5',
      gap: layout === 'horizontal' ? 'gap-2' : 'gap-1',
    },
    md: {
      avatar: 'w-10 h-10',
      text: 'text-base',
      badge: 'text-sm px-2 py-1',
      gap: layout === 'horizontal' ? 'gap-3' : 'gap-2',
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

  return (
    <Link
      href={`/profiles/${walletAddress}`}
      className={`
        flex 
        ${layout === 'horizontal' ? 'flex-row items-center' : 'flex-col items-center text-center'}
        ${config.gap}
        hover:opacity-80 
        transition-opacity
        ${className}
      `}
      title={`View profile of ${displayName}`}
    >
      {/* Avatar */}
      <div className={`${config.avatar} rounded-full overflow-hidden flex-shrink-0`}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name and optional trust score */}
      <div className={`flex ${layout === 'vertical' ? 'flex-col items-center' : 'flex-row items-center'} gap-2 min-w-0`}>
        <span className={`${config.text} font-medium text-gray-900 dark:text-white truncate`}>
          {displayName}
        </span>
        
        {showTrustScore && trustScore !== undefined && (
          <span 
            className={`${config.badge} rounded-full font-semibold flex-shrink-0 ${getTrustScoreColor(trustScore)}`}
            title={`Trust Score: ${trustScore}/100`}
          >
            {trustScore}
          </span>
        )}
      </div>
    </Link>
  )
}

