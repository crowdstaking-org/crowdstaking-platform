/**
 * UserAvatarStack Component
 * 
 * Displays multiple user avatars in an overlapping stack.
 * Shows up to maxVisible avatars, with remaining count as "+X".
 * Each avatar is clickable and links to the user's profile.
 * 
 * Features:
 * - Overlapping avatars with border
 * - Hover effect on each avatar
 * - "+X" badge for remaining users
 * - Tooltip on hover showing names
 * - Responsive sizing
 * 
 * Usage:
 * ```tsx
 * <UserAvatarStack
 *   users={[
 *     { walletAddress: '0x...', displayName: 'Alice', avatarUrl: '...' },
 *     { walletAddress: '0x...', displayName: 'Bob', avatarUrl: '...' }
 *   ]}
 *   maxVisible={3}
 *   size="md"
 * />
 * ```
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface UserAvatarStackProps {
  users: Array<{
    walletAddress: string
    avatarUrl?: string
    displayName?: string
  }>
  maxVisible?: number            // Default: 3
  size?: 'sm' | 'md' | 'lg'     // Default: 'md'
  onClick?: (address: string) => void
}

export function UserAvatarStack({
  users,
  maxVisible = 3,
  size = 'md',
  onClick,
}: UserAvatarStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!users || users.length === 0) {
    return null
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      avatar: 'w-8 h-8',
      offset: '-ml-2',
      firstOffset: 'ml-0',
      text: 'text-xs',
      border: 'border-2',
    },
    md: {
      avatar: 'w-10 h-10',
      offset: '-ml-3',
      firstOffset: 'ml-0',
      text: 'text-sm',
      border: 'border-2',
    },
    lg: {
      avatar: 'w-12 h-12',
      offset: '-ml-4',
      firstOffset: 'ml-0',
      text: 'text-base',
      border: 'border-3',
    },
  }

  const config = sizeConfig[size]

  const visibleUsers = users.slice(0, maxVisible)
  const remainingCount = users.length - maxVisible

  const handleAvatarClick = (e: React.MouseEvent, address: string) => {
    if (onClick) {
      e.preventDefault()
      onClick(address)
    }
  }

  return (
    <div className="flex items-center">
      {visibleUsers.map((user, index) => {
        const isHovered = hoveredIndex === index

        return (
          <Link
            key={user.walletAddress}
            href={`/profiles/${user.walletAddress}`}
            onClick={(e) => handleAvatarClick(e, user.walletAddress)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              ${config.avatar} 
              ${index === 0 ? config.firstOffset : config.offset}
              rounded-full 
              overflow-hidden 
              ${config.border}
              border-white dark:border-gray-800
              hover:z-10 
              hover:scale-110 
              transition-all
              duration-200
              relative
              group
            `}
            title={user.displayName || `User ${user.walletAddress.substring(0, 6)}...`}
            style={{ zIndex: visibleUsers.length - index }}
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName || 'User'}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {(user.displayName || '?').charAt(0).toUpperCase()}
              </div>
            )}

            {/* Tooltip on hover */}
            {isHovered && user.displayName && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-20 pointer-events-none">
                {user.displayName}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700" />
              </div>
            )}
          </Link>
        )
      })}

      {/* Remaining count badge */}
      {remainingCount > 0 && (
        <div
          className={`
            ${config.avatar}
            ${config.offset}
            rounded-full
            ${config.border}
            border-white dark:border-gray-800
            bg-gray-200 dark:bg-gray-700
            flex items-center justify-center
            ${config.text}
            font-semibold
            text-gray-700 dark:text-gray-300
          `}
          title={`+${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

