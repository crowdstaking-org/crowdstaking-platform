/**
 * VestingContract Interaction Service
 * Handles all blockchain interactions with the VestingContract
 */

import { ethers } from 'ethers';
import { VESTING_ABI } from './abi';
import { uuidToUint256 } from './utils';

/**
 * Agreement structure returned from smart contract
 */
export interface Agreement {
  contributor: string;
  amount: bigint;
  pioneerConfirmed: boolean;
  foundationConfirmed: boolean;
  exists: boolean;
}

/**
 * Service class for interacting with VestingContract
 */
export class VestingService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;
  private contractAddress: string;

  constructor() {
    // Load environment variables
    const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || process.env.BASE_MAINNET_RPC_URL;
    const contractAddress = process.env.VESTING_CONTRACT_ADDRESS_TESTNET || process.env.VESTING_CONTRACT_ADDRESS;
    const privateKey = process.env.FOUNDATION_WALLET_PRIVATE_KEY;

    // Validate required config
    if (!rpcUrl) {
      throw new Error('RPC URL not configured. Set BASE_SEPOLIA_RPC_URL or BASE_MAINNET_RPC_URL');
    }

    if (!contractAddress) {
      throw new Error('Contract address not configured. Set VESTING_CONTRACT_ADDRESS_TESTNET or VESTING_CONTRACT_ADDRESS');
    }

    if (!privateKey) {
      throw new Error('Foundation wallet private key not configured. Set FOUNDATION_WALLET_PRIVATE_KEY');
    }

    // Initialize provider and signer
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.contractAddress = contractAddress;

    // Initialize contract instance
    this.contract = new ethers.Contract(
      contractAddress,
      VESTING_ABI,
      this.signer
    );

    console.log('[VestingService] Initialized', {
      contractAddress,
      foundationWallet: this.signer.address,
      rpcUrl: rpcUrl.replace(/\/\/.*@/, '//*****@'), // Hide sensitive data in logs
    });
  }

  /**
   * Creates a new vesting agreement on the blockchain
   * 
   * @param proposalId - UUID of the proposal
   * @param contributorAddress - Wallet address of the pioneer
   * @param amount - Amount of tokens in wei
   * @returns Transaction hash
   * 
   * @throws Error if transaction fails or is reverted
   */
  async createAgreement(
    proposalId: string,
    contributorAddress: string,
    amount: bigint
  ): Promise<string> {
    try {
      console.log('[VestingService] Creating agreement', {
        proposalId,
        contributorAddress,
        amount: amount.toString(),
      });

      // Convert UUID to uint256
      const proposalIdUint = uuidToUint256(proposalId);

      // Estimate gas to catch errors early
      const gasEstimate = await this.contract.createAgreement.estimateGas(
        proposalIdUint,
        contributorAddress,
        amount
      );

      console.log('[VestingService] Gas estimate:', gasEstimate.toString());

      // Call contract function
      const tx = await this.contract.createAgreement(
        proposalIdUint,
        contributorAddress,
        amount,
        {
          gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
        }
      );

      console.log('[VestingService] Transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }

      console.log('[VestingService] Agreement created successfully', {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      });

      return receipt.hash;
    } catch (error: any) {
      console.error('[VestingService] Create agreement failed:', error);
      
      // Parse common errors
      if (error.message?.includes('Agreement already exists')) {
        throw new Error('Agreement already exists for this proposal');
      }
      if (error.message?.includes('insufficient allowance')) {
        throw new Error('Foundation must approve contract to spend tokens first');
      }
      if (error.message?.includes('insufficient funds')) {
        throw new Error('Foundation wallet has insufficient balance');
      }
      
      throw new Error(`Failed to create agreement: ${error.message}`);
    }
  }

  /**
   * Releases tokens to contributor after verification
   * 
   * @param proposalId - UUID of the proposal
   * @returns Transaction hash
   * 
   * @throws Error if transaction fails or is reverted
   */
  async releaseAgreement(proposalId: string): Promise<string> {
    try {
      console.log('[VestingService] Releasing agreement', { proposalId });

      // Convert UUID to uint256
      const proposalIdUint = uuidToUint256(proposalId);

      // Estimate gas
      const gasEstimate = await this.contract.releaseAgreement.estimateGas(
        proposalIdUint
      );

      // Call contract function
      const tx = await this.contract.releaseAgreement(
        proposalIdUint,
        {
          gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
        }
      );

      console.log('[VestingService] Transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }

      console.log('[VestingService] Agreement released successfully', {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      });

      return receipt.hash;
    } catch (error: any) {
      console.error('[VestingService] Release agreement failed:', error);
      
      // Parse common errors
      if (error.message?.includes('Agreement does not exist')) {
        throw new Error('No agreement found for this proposal');
      }
      if (error.message?.includes('Pioneer has not confirmed')) {
        throw new Error('Pioneer must confirm work completion first');
      }
      if (error.message?.includes('Already released')) {
        throw new Error('Agreement has already been released');
      }
      
      throw new Error(`Failed to release agreement: ${error.message}`);
    }
  }

  /**
   * Cancels an agreement before pioneer confirms
   * 
   * @param proposalId - UUID of the proposal
   * @returns Transaction hash
   */
  async cancelAgreement(proposalId: string): Promise<string> {
    try {
      console.log('[VestingService] Cancelling agreement', { proposalId });

      const proposalIdUint = uuidToUint256(proposalId);

      const gasEstimate = await this.contract.cancelAgreement.estimateGas(
        proposalIdUint
      );

      const tx = await this.contract.cancelAgreement(
        proposalIdUint,
        {
          gasLimit: gasEstimate * 120n / 100n,
        }
      );

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }

      console.log('[VestingService] Agreement cancelled successfully');

      return receipt.hash;
    } catch (error: any) {
      console.error('[VestingService] Cancel agreement failed:', error);
      throw new Error(`Failed to cancel agreement: ${error.message}`);
    }
  }

  /**
   * Gets agreement details from blockchain
   * 
   * @param proposalId - UUID of the proposal
   * @returns Agreement details or null if doesn't exist
   */
  async getAgreement(proposalId: string): Promise<Agreement | null> {
    try {
      const proposalIdUint = uuidToUint256(proposalId);
      
      const result = await this.contract.getAgreement(proposalIdUint);
      
      // Contract returns struct with all fields
      const agreement: Agreement = {
        contributor: result.contributor,
        amount: result.amount,
        pioneerConfirmed: result.pioneerConfirmed,
        foundationConfirmed: result.foundationConfirmed,
        exists: result.exists,
      };

      // Return null if agreement doesn't exist
      if (!agreement.exists) {
        return null;
      }

      return agreement;
    } catch (error: any) {
      console.error('[VestingService] Get agreement failed:', error);
      throw new Error(`Failed to get agreement: ${error.message}`);
    }
  }

  /**
   * Gets the foundation wallet address
   */
  getFoundationAddress(): string {
    return this.signer.address;
  }

  /**
   * Gets the contract address
   */
  getContractAddress(): string {
    return this.contractAddress;
  }

  /**
   * Checks if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.BASE_SEPOLIA_RPC_URL ||
      process.env.BASE_MAINNET_RPC_URL
    ) && !!(
      process.env.VESTING_CONTRACT_ADDRESS_TESTNET ||
      process.env.VESTING_CONTRACT_ADDRESS
    ) && !!process.env.FOUNDATION_WALLET_PRIVATE_KEY;
  }
}

// Singleton instance
let vestingServiceInstance: VestingService | null = null;

/**
 * Gets the singleton VestingService instance
 * Only initializes if properly configured
 */
export function getVestingService(): VestingService {
  if (!vestingServiceInstance) {
    vestingServiceInstance = new VestingService();
  }
  return vestingServiceInstance;
}

/**
 * Checks if vesting service is available
 */
export function isVestingServiceAvailable(): boolean {
  try {
    const service = new VestingService();
    return service.isConfigured();
  } catch {
    return false;
  }
}

