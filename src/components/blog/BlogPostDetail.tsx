/**
 * Blog Post Detail Component
 * Displays full blog post content with metadata
 * 
 * Features:
 * - Full post title and content (rendered markdown)
 * - Author info with avatar
 * - Published date
 * - Tags
 * - View count
 * - Back to blog link
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { UserProfileLink } from '@/components/profile/UserProfileLink'
import type { BlogPost } from '@/types/blog'

interface BlogPostDetailProps {
  post: BlogPost
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Zurück zum Blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Author */}
          <UserProfileLink
            walletAddress={post.author_wallet_address}
            displayName={post.author?.display_name}
            avatarUrl={post.author?.avatar_url}
            size="md"
            showAvatar={true}
          />
          
          {publishedDate && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {publishedDate}
            </div>
          )}

          {/* View Count */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post.view_count} Views</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none mb-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück zur Übersicht
        </Link>
      </footer>
    </article>
  )
}

