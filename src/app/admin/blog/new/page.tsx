/**
 * Admin Create Blog Post Page
 * Create a new blog post
 * 
 * Requires super-admin authentication
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { isSuperAdmin } from '@/lib/auth'
import { Layout } from '@/components/Layout'
import { BlogPostForm } from '@/components/blog/admin/BlogPostForm'
import { useCreateBlogPost } from '@/hooks/useBlog'
import type { CreateBlogPostInput } from '@/types/blog'

export default function NewBlogPostPage() {
  const router = useRouter()
  const { wallet } = useAuth()
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean | null>(null)
  const createPost = useCreateBlogPost()
  
  // Check super-admin access
  useEffect(() => {
    if (wallet) {
      isSuperAdmin(wallet).then(setHasAdminAccess)
    } else {
      setHasAdminAccess(false)
    }
  }, [wallet])
  
  const handleSubmit = async (data: CreateBlogPostInput) => {
    try {
      await createPost.mutateAsync(data)
      router.push('/admin/blog')
    } catch (err: any) {
      console.error('Failed to create post:', err)
      alert(`Fehler beim Erstellen: ${err.message}`)
      throw err
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
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 inline-flex items-center gap-2"
          >
            ← Zurück
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Neuer Blog Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Erstelle einen neuen Blog-Post für die CrowdStaking-Community
          </p>
        </div>
        
        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <BlogPostForm 
            onSubmit={handleSubmit}
            submitLabel="Post erstellen"
          />
        </div>
      </div>
    </Layout>
  )
}

