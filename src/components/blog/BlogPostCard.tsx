/**
 * Blog Post Card Component
 * Displays a blog post preview card for the blog overview page
 * 
 * Features:
 * - Title and excerpt
 * - Author info with avatar
 * - Published date
 * - Tags
 * - View count
 * - Link to full post
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { generateExcerpt } from '@/types/blog'
import type { BlogPost } from '@/types/blog'

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const excerpt = generateExcerpt(post.content)
  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Author */}
          <div className="flex items-center gap-3">
            {post.author?.avatar_url ? (
              <Image
                src={post.author.avatar_url}
                alt={post.author.display_name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {post.author?.display_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="text-sm">
              <div className="font-medium text-gray-900 dark:text-white">
                {post.author?.display_name || 'Anonymous'}
              </div>
              {publishedDate && (
                <div className="text-gray-500 dark:text-gray-400">
                  {publishedDate}
                </div>
              )}
            </div>
          </div>

          {/* View Count */}
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post.view_count}</span>
          </div>
        </div>
      </div>

      {/* Read More Indicator */}
      <div className="px-6 pb-4">
        <div className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Weiterlesen
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

