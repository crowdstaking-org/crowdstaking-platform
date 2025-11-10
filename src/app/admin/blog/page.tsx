/**
 * Admin Blog Management Page
 * View and manage all blog posts (including drafts)
 * 
 * Requires super-admin authentication
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { isSuperAdmin } from '@/lib/auth'
import { Layout } from '@/components/Layout'
import { useAdminBlogPosts, useDeleteBlogPost } from '@/hooks/useBlog'
import type { BlogPost } from '@/types/blog'

export default function AdminBlogPage() {
  const router = useRouter()
  const { wallet } = useAuth()
  const [page, setPage] = useState(1)
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  const { posts, pagination, isLoading, error, refetch } = useAdminBlogPosts(page)
  
  // Check super-admin access
  useEffect(() => {
    if (wallet) {
      isSuperAdmin(wallet).then(setHasAdminAccess)
    } else {
      setHasAdminAccess(false)
    }
  }, [wallet])
  
  const handleDelete = (postId: string) => {
    setDeleteConfirm(postId)
  }
  
  const confirmDelete = async () => {
    if (!deleteConfirm) return
    
    const mutation = useDeleteBlogPost(deleteConfirm)
    try {
      await mutation.mutateAsync()
      setDeleteConfirm(null)
      refetch()
    } catch (err: any) {
      console.error('Failed to delete post:', err)
      alert(`Fehler beim Löschen: ${err.message}`)
    }
  }
  
  // Loading admin check
  if (hasAdminAccess === null) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Prüfe Zugriffsrechte...</p>
          </div>
        </div>
      </Layout>
    )
  }
  
  // Access denied
  if (!hasAdminAccess) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Zugriff verweigert</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Super-Admin-Zugriff erforderlich</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zurück zur Startseite
            </button>
          </div>
        </div>
      </Layout>
    )
  }
  
  // Error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Fehler</h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Verwalte alle Blog-Posts (inkl. Drafts)
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ✏️ Neuer Post
          </Link>
        </div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Lade Posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Noch keine Blog-Posts vorhanden.
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ersten Post erstellen
            </Link>
          </div>
        ) : (
          <>
            {/* Posts Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {posts.map((post: BlogPost) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          /blog/{post.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('de-DE')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {post.view_count}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Seite {pagination.page} von {pagination.totalPages} ({pagination.total} Posts)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Zurück
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Weiter
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Post löschen?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bist du sicher, dass du diesen Post löschen möchtest? Alle Kommentare werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

