import fs from 'fs'
import path from 'path'

interface DeploymentInfo {
  address: string
  chainId: number
  network: string
  [key: string]: any
}

const DEPLOYMENTS_DIR = path.join(process.cwd(), 'hardhat', 'deployments')
const DEPLOYMENTS_FILE = path.join(DEPLOYMENTS_DIR, 'deployments.json')

function ensureDeploymentsDir() {
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true })
  }
}

function loadDeployments(): Record<string, DeploymentInfo> {
  ensureDeploymentsDir()
  if (!fs.existsSync(DEPLOYMENTS_FILE)) {
    return {}
  }
  try {
    const content = fs.readFileSync(DEPLOYMENTS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.warn('Failed to load deployments file:', error)
    return {}
  }
}

function saveDeployments(deployments: Record<string, DeploymentInfo>) {
  ensureDeploymentsDir()
  fs.writeFileSync(DEPLOYMENTS_FILE, JSON.stringify(deployments, null, 2))
}

export async function saveDeployment(
  name: string,
  address: string,
  metadata: Record<string, any> = {}
) {
  const deployments = loadDeployments()
  const { ethers } = await import('hardhat')
  const network = await ethers.provider.getNetwork()
  
  deployments[name] = {
    address,
    chainId: Number(network.chainId),
    network: network.name,
    deployedAt: new Date().toISOString(),
    ...metadata,
  }

  saveDeployments(deployments)
  console.log(`  💾 Saved deployment: ${name} -> ${address}`)
}

export function loadDeployment(name: string): DeploymentInfo | null {
  const deployments = loadDeployments()
  return deployments[name] || null
}

export function getAllDeployments(): Record<string, DeploymentInfo> {
  return loadDeployments()
}

