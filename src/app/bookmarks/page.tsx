/**
 * Bookmarks Page
 * 
 * Shows all bookmarked user profiles
 * 
 * Authentication required
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/Layout'
import { UserProfileLink } from '@/components/profile/UserProfileLink'
import { Bookmark, Trash2 } from 'lucide-react'
import { showToast } from '@/lib/toast'

interface BookmarkedUser {
  bookmarked_address: string
  notes?: string
  created_at: string
  profiles: {
    wallet_address: string
    display_name: string
    avatar_url?: string
    bio?: string
    trust_score?: number
  }
}

export default function BookmarksPage() {
  const { wallet, isAuthenticated } = useAuth()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<BookmarkedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
    fetchBookmarks()
  }, [wallet, isAuthenticated])

  async function fetchBookmarks() {
    if (!wallet) return

    try {
      setLoading(true)
      const response = await fetch('/api/social/bookmarks', {
        headers: {
          'x-wallet-address': wallet,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks')
      }

      const data = await response.json()
      setBookmarks(data.bookmarks || [])
    } catch (err: any) {
      console.error('Failed to fetch bookmarks:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function removeBookmark(address: string) {
    if (!wallet) return

    try {
      const response = await fetch(`/api/social/bookmark?address=${address}`, {
        method: 'DELETE',
        headers: {
          'x-wallet-address': wallet,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to remove bookmark')
      }

      showToast('Bookmark removed', 'success')
      fetchBookmarks() // Refresh list
    } catch (err: any) {
      showToast(err.message || 'Error removing bookmark', 'error')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Bookmark className="w-10 h-10 text-yellow-500" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                My Bookmarks
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your saved profiles for quick access
            </p>
          </div>

          {/* Content */}
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchBookmarks}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No bookmarks yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start bookmarking profiles to save them for later
              </p>
              <a
                href="/leaderboards"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore profiles
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.bookmarked_address}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <UserProfileLink
                        walletAddress={bookmark.bookmarked_address}
                        displayName={bookmark.profiles.display_name}
                        avatarUrl={bookmark.profiles.avatar_url}
                        trustScore={bookmark.profiles.trust_score}
                        showTrustScore={true}
                        size="lg"
                        showAvatar={true}
                        referrer="bookmarks"
                      />
                      
                      {bookmark.profiles.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-14">
                          {bookmark.profiles.bio}
                        </p>
                      )}

                      {bookmark.notes && (
                        <div className="mt-3 ml-14 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Note:</span> {bookmark.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeBookmark(bookmark.bookmarked_address)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-3 ml-14 text-xs text-gray-500 dark:text-gray-500">
                    Bookmarked on {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

