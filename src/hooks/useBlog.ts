/**
 * useBlog Hooks
 * React Query hooks for fetching and managing blog posts and comments
 * Provides automatic refetching, caching, and invalidation
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import type { BlogPost, BlogComment, CreateBlogPostInput, UpdateBlogPostInput, CreateCommentInput } from '@/types/blog'

/**
 * Hook to fetch all blog posts for admin (including drafts)
 * Requires super-admin authentication
 */
export function useAdminBlogPosts(page: number = 1) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blog', 'admin', 'posts', page],
    queryFn: async () => {
      const response = await fetch(`/api/blog/admin/posts?page=${page}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch blog posts')
      }
      
      return response.json()
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  })

  return {
    posts: data?.data?.posts || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to fetch published blog posts (public)
 */
export function useBlogPosts(page: number = 1, tag?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blog', 'posts', page, tag],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString() })
      if (tag) params.append('tag', tag)
      
      const response = await fetch(`/api/blog/posts?${params}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch blog posts')
      }
      
      return response.json()
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
  })

  return {
    posts: data?.data?.posts || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to fetch a single blog post by slug (public)
 */
export function useBlogPost(slug: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch blog post')
      }
      
      return response.json()
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    enabled: !!slug, // Only fetch if slug is provided
  })

  return {
    post: data?.data as BlogPost | undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to create a new blog post
 * Requires super-admin authentication
 */
export function useCreateBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateBlogPostInput) => {
      const response = await fetch('/api/blog/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create blog post')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate admin posts list to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['blog', 'admin', 'posts'] })
      // Also invalidate public posts list
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] })
    },
  })
}

/**
 * Hook to update a blog post
 * Requires super-admin authentication
 */
export function useUpdateBlogPost(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateBlogPostInput) => {
      const response = await fetch(`/api/blog/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update blog post')
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Invalidate admin posts list
      queryClient.invalidateQueries({ queryKey: ['blog', 'admin', 'posts'] })
      // Invalidate public posts list
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] })
      // Invalidate specific post by slug
      if (data?.data?.slug) {
        queryClient.invalidateQueries({ queryKey: ['blog', 'post', data.data.slug] })
      }
    },
  })
}

/**
 * Hook to delete a blog post
 * Requires super-admin authentication
 */
export function useDeleteBlogPost(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/blog/admin/posts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete blog post')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate all blog post queries
      queryClient.invalidateQueries({ queryKey: ['blog'] })
    },
  })
}

/**
 * Hook to fetch comments for a blog post (public)
 */
export function useBlogComments(slug: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blog', 'comments', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}/comments`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch comments')
      }
      
      return response.json()
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    enabled: !!slug, // Only fetch if slug is provided
  })

  return {
    comments: data?.data?.comments || [],
    count: data?.data?.count || 0,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to create a new comment
 * Requires authentication
 */
export function useCreateComment(slug: string) {
  const queryClient = useQueryClient()
  const { wallet } = useAuth()

  return useMutation({
    mutationFn: async (input: CreateCommentInput) => {
      if (!wallet) {
        throw new Error('Wallet not connected')
      }

      const response = await fetch(`/api/blog/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-wallet-address': wallet, // Send wallet address for auth
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create comment')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: ['blog', 'comments', slug] })
    },
  })
}

/**
 * Hook to delete a comment
 * Requires authentication and ownership
 */
export function useDeleteComment(commentId: string, slug: string) {
  const queryClient = useQueryClient()
  const { wallet } = useAuth()

  return useMutation({
    mutationFn: async () => {
      if (!wallet) {
        throw new Error('Wallet not connected')
      }

      const response = await fetch(`/api/blog/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'x-wallet-address': wallet, // Send wallet address for auth
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete comment')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate comments for the post
      queryClient.invalidateQueries({ queryKey: ['blog', 'comments', slug] })
    },
  })
}

