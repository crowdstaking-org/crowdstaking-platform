import { NextResponse } from 'next/server'
import {
  createV4Project,
  saveProjectContracts,
  deleteV4Project,
  updateV4ProjectStatus,
} from '@/lib/v4/projects'
import { deployProjectContracts } from '@/lib/v4/factory'
import type { V4ContractType } from '@/types/v4'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

export async function POST(request: Request) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  let project: Awaited<ReturnType<typeof createV4Project>> | null = null
  try {
    const body = await request.json()
    const { name, slug, mission, founderWallet } = body ?? {}
    if (!name || !slug || !founderWallet) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    project = await createV4Project({
      name,
      slug,
      mission: mission ?? null,
      founderWallet
    })

    const deployment = await deployProjectContracts(slug, founderWallet)

    const contractEntries = Object.entries(deployment.contracts) as [V4ContractType, string][]

    await saveProjectContracts(
      project.id,
      contractEntries.map(([contract_type, address]) => ({
        contract_type,
        address,
        chain_id: deployment.chainId,
      }))
    )

    await updateV4ProjectStatus(project.id, 'active')
    project.status = 'active'

    return NextResponse.json({ project, contracts: deployment.contracts }, { status: 201 })
  } catch (error: any) {
    if (project) {
      await deleteV4Project(project.id)
    }
    console.error('[POST /api/v4/projects]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

