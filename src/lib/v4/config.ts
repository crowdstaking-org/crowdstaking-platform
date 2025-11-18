export interface V4Config {
  factoryAddress: string
  deployerKey: string
  rpcUrl: string
  chainId: number
}

export function getV4Config(): V4Config {
  const factoryAddress = process.env.V4_FACTORY_ADDRESS
  const deployerKey = process.env.V4_DEPLOYER_KEY
  const rpcUrl = process.env.V4_DEPLOY_RPC_URL
  const chainIdRaw = process.env.V4_CHAIN_ID

  if (!factoryAddress) {
    throw new Error('V4_FACTORY_ADDRESS is not set')
  }
  if (!deployerKey) {
    throw new Error('V4_DEPLOYER_KEY is not set')
  }
  if (!rpcUrl) {
    throw new Error('V4_DEPLOY_RPC_URL is not set')
  }
  const chainId = Number(chainIdRaw ?? '0')
  if (!chainId) {
    throw new Error('V4_CHAIN_ID is not set or invalid')
  }

  return {
    factoryAddress,
    deployerKey,
    rpcUrl,
    chainId,
  }
}

