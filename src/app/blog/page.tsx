/**
 * Blog Overview Page
 * Public page displaying all published blog posts
 * 
 * Features:
 * - Grid of blog post cards
 * - Pagination
 * - Hero section
 */

'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { useBlogPosts } from '@/hooks/useBlog'

export default function BlogPage() {
  const [page, setPage] = useState(1)
  const { posts, pagination, isLoading, error } = useBlogPosts(page)

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            CrowdStaking Blog
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Insights, Updates und Neuigkeiten aus der Welt des dezentralen Crowdfundings
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Lade Posts...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Fehler</h2>
            <p className="text-red-600 dark:text-red-400">{error.message}</p>
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Noch keine Blog-Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Schau bald wieder vorbei für neue Inhalte!
            </p>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post: any) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  ← Zurück
                </button>
                
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  Seite {pagination.page} von {pagination.totalPages}
                </div>
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Weiter →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

