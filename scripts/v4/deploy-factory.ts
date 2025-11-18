import { ethers } from 'ethers'
import fs from 'node:fs'
import path from 'node:path'

const RPC_URL = process.env.V4_DEPLOY_RPC_URL!
const PRIVATE_KEY = process.env.V4_DEPLOYER_KEY!
const TREASURY = process.env.PARTNER_SBT_TREASURY_ADDRESS!
const PAYOUT_TOKEN = process.env.V4_PAYOUT_TOKEN_ADDRESS!
const CAPITAL_TOKEN = process.env.V4_CAPITAL_TOKEN_ADDRESS!
const FEE_BPS = Number(process.env.V4_FEE_BPS ?? '200')

async function main() {
  if (!RPC_URL || !PRIVATE_KEY) {
    throw new Error('Missing RPC or deployer key')
  }
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  const artifactPath = path.join(process.cwd(), 'contracts', 'compiled', 'ProjectFactory.json')
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
  const Factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet)
  console.log('Deploying ProjectFactory...')
  const contract = await Factory.deploy(TREASURY, FEE_BPS, PAYOUT_TOKEN, CAPITAL_TOKEN)
  await contract.deploymentTransaction()?.wait()
  console.log('ProjectFactory deployed at', await contract.getAddress())
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

