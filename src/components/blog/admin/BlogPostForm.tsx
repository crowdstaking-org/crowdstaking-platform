/**
 * Blog Post Form Component
 * Form for creating and editing blog posts
 * 
 * Features:
 * - React Hook Form with Zod validation
 * - Markdown editor for content
 * - Tag input (comma-separated)
 * - Status selection (draft/published)
 * - Slug preview (auto-generated)
 * - Preview modal
 * - Loading states
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MarkdownEditor } from '@/components/forms/MarkdownEditor'
import { blogPostSchema, generateSlug, generateExcerpt } from '@/types/blog'
import type { BlogPost, CreateBlogPostInput } from '@/types/blog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogPostFormProps {
  initialData?: BlogPost
  onSubmit: (data: CreateBlogPostInput) => Promise<void>
  submitLabel?: string
}

export function BlogPostForm({ 
  initialData, 
  onSubmit,
  submitLabel = 'Publish Post'
}: BlogPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      content: initialData.content,
      tags: initialData.tags,
      status: initialData.status,
    } : {
      title: '',
      content: '',
      tags: [],
      status: 'draft',
    },
  })

  const title = watch('title')
  const content = watch('content')
  const tags = watch('tags')
  const status = watch('status')
  
  const slug = title ? generateSlug(title) : ''
  const excerpt = content ? generateExcerpt(content) : ''

  const handleFormSubmit = async (data: CreateBlogPostInput) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const tagsArray = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    setValue('tags', tagsArray)
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter post title..."
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
        </div>

        {/* Slug Preview */}
        {slug && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
              URL Slug (auto-generated):
            </div>
            <div className="text-sm text-blue-900 dark:text-blue-100 font-mono">
              /blog/{slug}
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content * (Markdown)
          </label>
          <MarkdownEditor
            value={content || ''}
            onChange={(value) => setValue('content', value)}
            placeholder="Write your blog post content in Markdown..."
            maxLength={50000}
            minRows={12}
            error={errors.content?.message}
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            defaultValue={tags?.join(', ')}
            onChange={handleTagsChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter tags separated by commas (e.g., Web3, DeFi, CrowdStaking)"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Separate multiple tags with commas
          </p>
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status *
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {status === 'draft' 
              ? 'Draft posts are only visible to admins'
              : 'Published posts are visible to everyone'}
          </p>
        </div>

        {/* Excerpt Preview */}
        {excerpt && (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-700 dark:text-gray-300 font-medium mb-2">
              Auto-generated Excerpt:
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {excerpt}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={!content || isSubmitting}
            className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            👁️ Preview
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPreview(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Preview
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {title || 'Untitled Post'}
              </h1>
              
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">
                    No content to preview yet.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

