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
  
  // Check if Factory is deployed
  if (!factoryAddress || factoryAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('V4_FACTORY_ADDRESS not set - Factory contract is not deployed yet. Please deploy the Factory contract first.')
  }
  
  const provider = new JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(deployerKey, provider)
  const factory = new Contract(factoryAddress, FACTORY_ABI, wallet)

  // Create Interface explicitly to ensure it's properly initialized
  const iface = new Interface(FACTORY_ABI)
  
  // Validate interface
  if (!iface || !iface.fragments || !Array.isArray(iface.fragments)) {
    throw new Error('Failed to create Interface from ABI')
  }
  
  console.log(`[deployProjectContracts] Interface created with ${iface.fragments.length} fragments`)

  const tx = await factory.createProject(slug, founder)
  const receipt = await tx.wait()
  if (!receipt) {
    throw new Error('No receipt received for createProject')
  }

  if (!receipt.logs || !Array.isArray(receipt.logs) || receipt.logs.length === 0) {
    console.error('Receipt logs:', receipt.logs)
    throw new Error('No logs found in transaction receipt')
  }

  console.log(`[deployProjectContracts] Transaction hash: ${receipt.hash}`)
  console.log(`[deployProjectContracts] Logs count: ${receipt.logs.length}`)
  
  const parsed = parseProjectCreatedLog(iface, receipt.logs)
  if (!parsed) {
    console.error('Failed to parse ProjectCreated event.')
    console.error('Receipt logs structure:', receipt.logs.map((log: any) => ({
      address: log.address,
      topicsCount: log.topics?.length || 0,
      hasData: !!log.data,
      topics: log.topics?.slice(0, 3) // First 3 topics for debugging
    })))
    throw new Error('ProjectCreated event not found in receipt. Check transaction logs.')
  }
  
  console.log('[deployProjectContracts] Successfully parsed ProjectCreated event:', parsed)

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

function parseProjectCreatedLog(iface: Interface, logs: readonly Log[] | undefined) {
  if (!logs || logs.length === 0) {
    return null
  }

  // Validate interface before parsing
  if (!iface) {
    console.error('Interface is undefined or null')
    return null
  }

  // Check if interface has the required methods
  if (typeof iface.parseLog !== 'function') {
    console.error('Interface.parseLog is not a function', { iface })
    return null
  }

  for (const log of logs) {
    try {
      // Validate log structure before parsing to prevent undefined errors
      if (!log || !log.topics || !Array.isArray(log.topics) || log.topics.length === 0) {
        continue
      }
      
      // Ensure data exists (can be empty string but not undefined)
      if (log.data === undefined || log.data === null) {
        continue
      }

      // Validate topics array - first topic should be event signature hash
      if (!log.topics[0] || typeof log.topics[0] !== 'string') {
        continue
      }

      // Try to parse the log - parseLog may throw or return null if log doesn't match
      let parsed
      try {
        // Ensure parseLog is called with valid structure
        parsed = iface.parseLog({
          topics: log.topics,
          data: log.data || '0x',
        })
      } catch (parseError: any) {
        // parseLog throws if log doesn't match any event in the interface
        // This is expected for logs from other contracts
        // Log the error for debugging but continue
        if (parseError?.message?.includes('find')) {
          console.error('parseLog find error:', parseError.message, {
            topicsCount: log.topics?.length,
            firstTopic: log.topics?.[0]?.substring(0, 20),
            hasData: !!log.data,
            interfaceFragments: iface.fragments?.length || 0
          })
        }
        continue
      }
      
      if (!parsed || parsed.name !== 'ProjectCreated') {
        continue
      }

      // Event has individual parameters (not a tuple)
      // Event signature: ProjectCreated(bytes32 indexed projectId, address indexed founder, address partnerRegister, address governanceModule, address profitVault, address capitalVault)
      // parsed.args is an array: [projectId, founder, partnerRegister, governanceModule, profitVault, capitalVault]
      // Or can be accessed by name (ethers v6 supports both)
      const args = parsed.args as any
      
      if (!args || (typeof args !== 'object' && !Array.isArray(args))) {
        console.error('Invalid args structure:', args)
        continue
      }
      
      // Access by name (ethers v6) or by index (fallback)
      // Indexed params: [0]=projectId, [1]=founder
      // Non-indexed params: [2]=partnerRegister, [3]=governanceModule, [4]=profitVault, [5]=capitalVault
      const projectId = args.projectId ?? args[0]
      const partnerRegister = args.partnerRegister ?? args[2]
      const governanceModule = args.governanceModule ?? args[3]
      const profitVault = args.profitVault ?? args[4]
      const capitalVault = args.capitalVault ?? args[5]

      if (!projectId || !partnerRegister || !governanceModule || !profitVault || !capitalVault) {
        console.error('Missing event arguments:', { 
          args: parsed.args,
          projectId, 
          partnerRegister, 
          governanceModule, 
          profitVault, 
          capitalVault 
        })
        continue
      }

      return {
        projectId: projectId.toString(),
        partnerRegister: partnerRegister.toString(),
        governanceModule: governanceModule.toString(),
        profitVault: profitVault.toString(),
        capitalVault: capitalVault.toString(),
      }
    } catch (err: any) {
      // Log error for debugging but continue
      console.error('Error parsing log:', err?.message || err, {
        log: log ? { 
          address: log.address,
          topicsCount: log.topics?.length || 0, 
          hasData: log.data !== undefined && log.data !== null 
        } : 'null'
      })
      continue
    }
  }
  return null
}

