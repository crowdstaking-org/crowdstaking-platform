/**
 * useProject Hook
 * Manages project data fetching and state
 */

import { useState, useEffect } from 'react'
import type { Project, ProjectStats } from '@/types/project'

/**
 * Fetch projects from API
 */
export async function fetchProjects(founderAddress?: string): Promise<Project[]> {
  const url = founderAddress 
    ? `/api/projects?founder=${founderAddress}`
    : '/api/projects'
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`)
  }
  
  const result = await response.json()
  // API returns { success: true, data: { projects: [...], count: N } }
  return result.data?.projects || []
}

/**
 * Fetch single project by ID
 */
export async function fetchProject(projectId: string): Promise<Project | null> {
  const response = await fetch(`/api/projects/${projectId}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch project: ${response.statusText}`)
  }
  
  const result = await response.json()
  // API returns { success: true, data: { project: {...} } }
  return result.data?.project || null
}

/**
 * Fetch project stats
 */
export async function fetchProjectStats(projectId: string): Promise<ProjectStats | null> {
  const response = await fetch(`/api/projects/${projectId}/stats`)
  
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch project stats: ${response.statusText}`)
  }
  
  const result = await response.json()
  // API returns { success: true, data: { stats: {...} } }
  return result.data?.stats || null
}

/**
 * Hook to load projects for a founder
 */
export function useFounderProjects(founderAddress?: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!founderAddress) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    fetchProjects(founderAddress)
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching projects:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [founderAddress])

  return { projects, loading, error }
}

/**
 * Hook to load all projects (public access, no authentication required)
 */
export function useProjects(projectId?: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Fetch all projects without authentication
    fetchProjects()
      .then((data) => {
        setProjects(data)
        
        // If projectId is provided, find and set that specific project
        if (projectId && data.length > 0) {
          const foundProject = data.find(p => p.id === projectId)
          setProject(foundProject || null)
        } else if (data.length > 0) {
          // If no projectId, set first project as fallback
          setProject(data[0])
        }
        
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching projects:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [projectId])

  return { projects, project, loading, error }
}

/**
 * Hook to load a single project with stats
 */
export function useProject(projectId?: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    Promise.all([
      fetchProject(projectId),
      fetchProjectStats(projectId)
    ])
      .then(([projectData, statsData]) => {
        setProject(projectData)
        setStats(statsData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching project:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [projectId])

  return { project, stats, loading, error, refetch: () => {
    if (projectId) {
      setLoading(true)
      Promise.all([
        fetchProject(projectId),
        fetchProjectStats(projectId)
      ])
        .then(([projectData, statsData]) => {
          setProject(projectData)
          setStats(statsData)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error refetching project:', err)
          setError(err.message)
          setLoading(false)
        })
    }
  }}
}

