import { Contract, JsonRpcProvider, Wallet, Interface, Log } from 'ethers'
import { getV4Config } from './config'

const FACTORY_ABI = [
  'event ProjectCreated(bytes32 indexed projectId, address indexed founder, address partnerRegister, address governanceModule, address profitVault, address capitalVault)',
  'function createProject(string slug, address founder) returns (bytes32)',
]

export interface DeployedContracts {
  projectId: string
  contracts: {
    partner_register: string
    governance_module: string
    profit_vault: string
    capital_vault: string
  }
  chainId: number
}

export async function deployProjectContracts(
  slug: string,
  founder: string
): Promise<DeployedContracts> {
  const { factoryAddress, deployerKey, rpcUrl, chainId } = getV4Config()
  const provider = new JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(deployerKey, provider)
  const factory = new Contract(factoryAddress, FACTORY_ABI, wallet)

  const tx = await factory.createProject(slug, founder)
  const receipt = await tx.wait()
  if (!receipt) {
    throw new Error('No receipt received for createProject')
  }

  const parsed = parseProjectCreatedLog(factory.interface, receipt.logs)
  if (!parsed) {
    throw new Error('ProjectCreated event not found in receipt')
  }

  return {
    projectId: parsed.projectId,
    contracts: {
      partner_register: parsed.partnerRegister,
      governance_module: parsed.governanceModule,
      profit_vault: parsed.profitVault,
      capital_vault: parsed.capitalVault,
    },
    chainId,
  }
}

function parseProjectCreatedLog(iface: Interface, logs: readonly Log[]) {
  for (const log of logs) {
    try {
      const parsed = iface.parseLog({
        topics: log.topics,
        data: log.data,
      })
      if (parsed && parsed.name === 'ProjectCreated') {
        const contractsTuple = parsed.args.contractsDeployed
        if (contractsTuple) {
          return {
            projectId: parsed.args.projectId as string,
            partnerRegister: contractsTuple.partnerRegister as string,
            governanceModule: contractsTuple.governanceModule as string,
            profitVault: contractsTuple.profitVault as string,
            capitalVault: contractsTuple.capitalVault as string,
          }
        }
        return {
          projectId: parsed.args.projectId as string,
          partnerRegister: parsed.args.partnerRegister as string,
          governanceModule: parsed.args.governanceModule as string,
          profitVault: parsed.args.profitVault as string,
          capitalVault: parsed.args.capitalVault as string,
        }
      }
    } catch (err) {
      continue
    }
  }
  return null
}

