/**
 * Comment Section Component
 * Displays comments and comment form for blog posts
 * 
 * Features:
 * - List of comments with author info
 * - Delete button for own comments (when authenticated)
 * - Comment form (when authenticated)
 * - Login prompt (when not authenticated)
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserProfileLink } from '@/components/profile/UserProfileLink'
import { useAuth } from '@/hooks/useAuth'
import { useBlogComments, useCreateComment, useDeleteComment } from '@/hooks/useBlog'
import { commentSchema } from '@/types/blog'
import type { CreateCommentInput } from '@/types/blog'

interface CommentSectionProps {
  slug: string
}

export function CommentSection({ slug }: CommentSectionProps) {
  const { wallet } = useAuth()
  const { comments, count, isLoading, refetch } = useBlogComments(slug)
  const createComment = useCreateComment(slug)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (data: CreateCommentInput) => {
    try {
      await createComment.mutateAsync(data)
      reset()
      refetch()
    } catch (err: any) {
      console.error('Failed to create comment:', err)
      alert(`Fehler beim Kommentieren: ${err.message}`)
    }
  }

  const handleDelete = async (commentId: string) => {
    const mutation = useDeleteComment(commentId, slug)
    try {
      await mutation.mutateAsync()
      setDeleteConfirm(null)
      refetch()
    } catch (err: any) {
      console.error('Failed to delete comment:', err)
      alert(`Fehler beim Löschen: ${err.message}`)
    }
  }

  return (
    <section className="max-w-4xl mx-auto mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Kommentare {count > 0 && `(${count})`}
      </h2>

      {/* Comment Form */}
      {wallet ? (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Kommentar schreiben
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              {...register('content')}
              placeholder="Schreibe deinen Kommentar hier..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              disabled={createComment.isPending}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.content.message}
              </p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={createComment.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createComment.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wird gesendet...
                  </>
                ) : (
                  'Kommentar absenden'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Bitte verbinde dein Wallet, um einen Kommentar zu schreiben.
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Lade Kommentare...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            Noch keine Kommentare. Sei der Erste, der kommentiert!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment: any) => {
            const commentDate = new Date(comment.created_at).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            const isOwn = wallet && comment.author_wallet_address.toLowerCase() === wallet.toLowerCase()

            return (
              <div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <UserProfileLink
                      walletAddress={comment.author_wallet_address}
                      displayName={comment.author?.display_name}
                      avatarUrl={comment.author?.avatar_url}
                      size="sm"
                      showAvatar={true}
                    />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {commentDate}
                    </div>
                  </div>

                  {/* Delete Button (own comments only) */}
                  {isOwn && (
                    <button
                      onClick={() => setDeleteConfirm(comment.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm transition-colors"
                    >
                      Löschen
                    </button>
                  )}
                </div>

                {/* Comment Content */}
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Kommentar löschen?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bist du sicher, dass du diesen Kommentar löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

