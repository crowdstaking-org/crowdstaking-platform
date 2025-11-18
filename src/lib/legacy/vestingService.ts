/**
 * VestingContract Interaction Service (Legacy)
 * Handles blockchain interactions with the old $CSTAKE VestingContract
 */

import { ethers } from 'ethers'
import { VESTING_ABI } from '../contracts/abi'
import { uuidToUint256 } from '../contracts/utils'

export interface Agreement {
  contributor: string
  amount: bigint
  pioneerConfirmed: boolean
  foundationConfirmed: boolean
  exists: boolean
}

export class VestingService {
  private provider: ethers.JsonRpcProvider
  private signer: ethers.Wallet
  private contract: ethers.Contract
  private contractAddress: string

  constructor() {
    const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || process.env.BASE_MAINNET_RPC_URL
    const contractAddress =
      process.env.VESTING_CONTRACT_ADDRESS_TESTNET || process.env.VESTING_CONTRACT_ADDRESS
    const privateKey = process.env.FOUNDATION_WALLET_PRIVATE_KEY

    if (!rpcUrl) {
      throw new Error('RPC URL not configured. Set BASE_SEPOLIA_RPC_URL or BASE_MAINNET_RPC_URL')
    }

    if (!contractAddress) {
      throw new Error(
        'Contract address not configured. Set VESTING_CONTRACT_ADDRESS_TESTNET or VESTING_CONTRACT_ADDRESS'
      )
    }

    if (!privateKey) {
      throw new Error('Foundation wallet private key not configured. Set FOUNDATION_WALLET_PRIVATE_KEY')
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.signer = new ethers.Wallet(privateKey, this.provider)
    this.contractAddress = contractAddress

    this.contract = new ethers.Contract(contractAddress, VESTING_ABI, this.signer)

    console.log('[Legacy VestingService] Initialized', {
      contractAddress,
      foundationWallet: this.signer.address,
      rpcUrl: rpcUrl.replace(/\/\/.*@/, '//*****@'),
    })
  }

  async createAgreement(proposalId: string, contributorAddress: string, amount: bigint) {
    const proposalIdUint = uuidToUint256(proposalId)
    const gasEstimate = await this.contract.createAgreement.estimateGas(
      proposalIdUint,
      contributorAddress,
      amount
    )
    const tx = await this.contract.createAgreement(proposalIdUint, contributorAddress, amount, {
      gasLimit: (gasEstimate * 120n) / 100n,
    })
    const receipt = await tx.wait()
    if (receipt.status === 0) {
      throw new Error('Transaction failed')
    }
    return receipt.hash
  }

  async releaseAgreement(proposalId: string) {
    const proposalIdUint = uuidToUint256(proposalId)
    const gasEstimate = await this.contract.releaseAgreement.estimateGas(proposalIdUint)
    const tx = await this.contract.releaseAgreement(proposalIdUint, {
      gasLimit: (gasEstimate * 120n) / 100n,
    })
    const receipt = await tx.wait()
    if (receipt.status === 0) {
      throw new Error('Transaction failed')
    }
    return receipt.hash
  }

  async cancelAgreement(proposalId: string) {
    const proposalIdUint = uuidToUint256(proposalId)
    const gasEstimate = await this.contract.cancelAgreement.estimateGas(proposalIdUint)
    const tx = await this.contract.cancelAgreement(proposalIdUint, {
      gasLimit: (gasEstimate * 120n) / 100n,
    })
    const receipt = await tx.wait()
    if (receipt.status === 0) {
      throw new Error('Transaction failed')
    }
    return receipt.hash
  }

  async getAgreement(proposalId: string): Promise<Agreement | null> {
    const proposalIdUint = uuidToUint256(proposalId)
    const result = await this.contract.getAgreement(proposalIdUint)
    const agreement: Agreement = {
      contributor: result.contributor,
      amount: result.amount,
      pioneerConfirmed: result.pioneerConfirmed,
      foundationConfirmed: result.foundationConfirmed,
      exists: result.exists,
    }
    return agreement.exists ? agreement : null
  }

  getFoundationAddress(): string {
    return this.signer.address
  }

  getContractAddress(): string {
    return this.contractAddress
  }

  isConfigured(): boolean {
    return !!(
      (process.env.BASE_SEPOLIA_RPC_URL || process.env.BASE_MAINNET_RPC_URL) &&
      (process.env.VESTING_CONTRACT_ADDRESS_TESTNET || process.env.VESTING_CONTRACT_ADDRESS) &&
      process.env.FOUNDATION_WALLET_PRIVATE_KEY
    )
  }
}

let vestingServiceInstance: VestingService | null = null

export function getLegacyVestingService(): VestingService {
  if (!vestingServiceInstance) {
    vestingServiceInstance = new VestingService()
  }
  return vestingServiceInstance
}

export function isLegacyVestingServiceAvailable(): boolean {
  try {
    const service = new VestingService()
    return service.isConfigured()
  } catch {
    return false
  }
}

// Backwards compatibility exports for legacy routes
export const getVestingService = getLegacyVestingService
export const isVestingServiceAvailable = isLegacyVestingServiceAvailable

