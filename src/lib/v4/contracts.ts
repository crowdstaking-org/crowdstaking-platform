import { supabaseAdmin } from './supabaseAdmin'
import type { V4ProjectContract, V4Project } from '@/types/v4'

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from<V4Project>('projects_v4')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getProjectContracts(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from<V4ProjectContract>('project_contracts')
    .select('*')
    .eq('project_id', projectId)
  if (error) throw error
  return data
}

export async function upsertProjectContract(
  projectId: string,
  contract: Omit<V4ProjectContract, 'id' | 'project_id' | 'deployed_at'>
) {
  const { data, error } = await supabaseAdmin
    .from<V4ProjectContract>('project_contracts')
    .upsert({
      ...contract,
      project_id: projectId
    })
    .select('*')
    .single()
  if (error) throw error
  return data
}

