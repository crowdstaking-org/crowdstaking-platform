/**
 * Blog Post Detail Page
 * Public page displaying a single blog post with comments
 * 
 * Features:
 * - Full blog post content
 * - Comment section
 * - 404 handling
 */

'use client'

import { useParams } from 'next/navigation'
import { Layout } from '@/components/Layout'
import { BlogPostDetail } from '@/components/blog/BlogPostDetail'
import { CommentSection } from '@/components/blog/CommentSection'
import { useBlogPost } from '@/hooks/useBlog'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const { post, isLoading, error } = useBlogPost(slug)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Lade Post...</p>
          </div>
        ) : error || !post ? (
          /* Error / 404 State */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Post nicht gefunden
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error?.message || 'Dieser Blog-Post existiert nicht oder wurde entfernt.'}
            </p>
            <a
              href="/blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Zurück zum Blog
            </a>
          </div>
        ) : (
          <>
            {/* Blog Post Content */}
            <BlogPostDetail post={post} />

            {/* Comment Section */}
            <CommentSection slug={post.slug} />
          </>
        )}
      </div>
    </Layout>
  )
}

