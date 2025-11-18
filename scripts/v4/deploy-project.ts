import { ethers } from 'ethers'
import fs from 'node:fs'
import path from 'node:path'
import { supabaseAdmin } from '../../src/lib/v4/supabaseAdmin'

const RPC_URL = process.env.V4_DEPLOY_RPC_URL!
const PRIVATE_KEY = process.env.V4_DEPLOYER_KEY!
const FACTORY_ADDRESS = process.env.V4_FACTORY_ADDRESS!

async function main() {
  const [slug, founder] = process.argv.slice(2)
  if (!slug || !founder) {
    throw new Error('Usage: tsx scripts/v4/deploy-project.ts <slug> <founderAddress>')
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  const artifactPath = path.join(process.cwd(), 'contracts', 'compiled', 'ProjectFactory.json')
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
  const factory = new ethers.Contract(FACTORY_ADDRESS, artifact.abi, wallet)

  const tx = await factory.createProject(slug, founder)
  const receipt = await tx.wait()
  const event = receipt?.logs?.find((log: any) => log.fragment?.name === 'ProjectCreated')
  if (!event) {
    throw new Error('ProjectCreated event not found')
  }
  const projectId = event.args[0]
  const contracts = {
    partner_register: event.args[1],
    governance_module: event.args[2],
    profit_vault: event.args[3],
    capital_vault: event.args[4],
  }

  const { data: project } = await supabaseAdmin
    .from('projects_v4')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (!project) {
    throw new Error('Project record not found in database')
  }

  await supabaseAdmin.from('project_contracts').insert(
    Object.entries(contracts).map(([type, address]) => ({
      project_id: project.id,
      contract_type: type,
      address,
      chain_id: await provider.getNetwork().then((n) => Number(n.chainId)),
    }))
  )

  console.log('Project deployed', projectId, contracts)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

