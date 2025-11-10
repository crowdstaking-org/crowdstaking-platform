/**
 * Admin Edit Blog Post Page
 * Edit an existing blog post
 * 
 * Requires super-admin authentication
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { isSuperAdmin } from '@/lib/auth'
import { Layout } from '@/components/Layout'
import { BlogPostForm } from '@/components/blog/admin/BlogPostForm'
import { useUpdateBlogPost } from '@/hooks/useBlog'
import type { BlogPost, CreateBlogPostInput } from '@/types/blog'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const { wallet } = useAuth()
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean | null>(null)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const postId = params.id as string
  const updatePost = useUpdateBlogPost(postId)
  
  // Check super-admin access
  useEffect(() => {
    if (wallet) {
      isSuperAdmin(wallet).then(setHasAdminAccess)
    } else {
      setHasAdminAccess(false)
    }
  }, [wallet])
  
  // Fetch post data
  useEffect(() => {
    if (hasAdminAccess) {
      fetchPost()
    }
  }, [hasAdminAccess, postId])
  
  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/blog/admin/posts/${postId}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch post')
      }
      
      const data = await response.json()
      setPost(data.data)
    } catch (err: any) {
      console.error('Failed to fetch post:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (data: CreateBlogPostInput) => {
    try {
      await updatePost.mutateAsync(data)
      router.push('/admin/blog')
    } catch (err: any) {
      console.error('Failed to update post:', err)
      alert(`Fehler beim Aktualisieren: ${err.message}`)
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
  
  // Loading post
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Lade Post...</p>
          </div>
        </div>
      </Layout>
    )
  }
  
  // Error state
  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Fehler</h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || 'Post nicht gefunden'}
            </p>
            <button
              onClick={() => router.push('/admin/blog')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Zurück zur Übersicht
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
            Post bearbeiten
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bearbeite den Blog-Post: {post.title}
          </p>
        </div>
        
        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <BlogPostForm 
            initialData={post}
            onSubmit={handleSubmit}
            submitLabel="Änderungen speichern"
          />
        </div>
      </div>
    </Layout>
  )
}

