import { Contract, JsonRpcProvider, Wallet } from 'ethers'
import { getV4Config } from './config'

export function getProvider() {
  const { rpcUrl } = getV4Config()
  return new JsonRpcProvider(rpcUrl)
}

export function getServerWallet() {
  const { deployerKey } = getV4Config()
  return new Wallet(deployerKey, getProvider())
}

export function getContract<T = Contract>(address: string, abi: string[]) {
  const wallet = getServerWallet()
  return new Contract(address, abi, wallet) as unknown as T
}

