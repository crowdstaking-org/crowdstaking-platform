import { supabaseAdmin } from './supabaseAdmin'
import type { V4Project, V4ProjectContract, V4ProjectStatus } from '@/types/v4'

interface CreateProjectInput {
  name: string
  slug: string
  mission?: string | null
  createdBy?: string | null
  founderWallet: string
}

export async function createV4Project(input: CreateProjectInput) {
  const slug = input.slug.trim().toLowerCase()
  const { data: existing } = await supabaseAdmin
    .from('projects_v4')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    throw new Error('Slug already exists')
  }

  const { data, error } = await supabaseAdmin
    .from('projects_v4')
    .insert({
      name: input.name,
      slug,
      mission: input.mission ?? null,
      created_by: input.createdBy ?? null,
      status: 'draft'
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function saveProjectContracts(
  projectId: string,
  contracts: Omit<V4ProjectContract, 'id' | 'project_id' | 'deployed_at'>[]
) {
  if (!contracts.length) return []

  const payload = contracts.map((contract) => ({
    ...contract,
    project_id: projectId
  }))

  const { data, error } = await supabaseAdmin
    .from('project_contracts')
    .insert(payload)
    .select('*')

  if (error) {
    throw error
  }

  return data
}

export async function deleteV4Project(projectId: string) {
  await supabaseAdmin.from('projects_v4').delete().eq('id', projectId)
}

export async function updateV4ProjectStatus(projectId: string, status: V4ProjectStatus) {
  const { error } = await supabaseAdmin
    .from('projects_v4')
    .update({ status })
    .eq('id', projectId)
  if (error) throw error
}

