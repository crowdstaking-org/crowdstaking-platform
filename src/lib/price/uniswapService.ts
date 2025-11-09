/**
 * Uniswap Price Service
 * Phase 6: Fetches $CSTAKE token price from Uniswap pool
 * For MVP: Uses fallback pricing if pool not available (testnet)
 */

import { ethers } from 'ethers'

// RPC URL for Base Sepolia
const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

// Uniswap V2 Pool address (optional - for when liquidity is added)
const UNISWAP_POOL_ADDRESS = process.env.CSTAKE_UNISWAP_POOL_ADDRESS

// Token addresses
const CSTAKE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS || '0xa746381E05aE069846726Eb053788D4879B458DA'

// Manual price override for testnet/development (in USD)
const MANUAL_PRICE = process.env.CSTAKE_MANUAL_PRICE ? parseFloat(process.env.CSTAKE_MANUAL_PRICE) : null

// Minimal Uniswap V2 Pool ABI
const POOL_ABI = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
]

/**
 * Uniswap Price Service Class
 * Handles fetching token price from Uniswap or fallback sources
 */
export class UniswapPriceService {
  private provider: ethers.JsonRpcProvider
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL)
  }
  
  /**
   * Get current $CSTAKE price in USD
   * Priority:
   * 1. Manual price override (for testing)
   * 2. Uniswap pool (if configured and available)
   * 3. Fallback testnet price ($0.10)
   */
  async getPrice(): Promise<number> {
    try {
      // Priority 1: Manual price override
      if (MANUAL_PRICE !== null) {
        console.log('Using manual price override:', MANUAL_PRICE)
        return MANUAL_PRICE
      }
      
      // Priority 2: Uniswap pool
      if (UNISWAP_POOL_ADDRESS) {
        try {
          const poolPrice = await this.fetchFromUniswap()
          if (poolPrice > 0) {
            console.log('Using Uniswap pool price:', poolPrice)
            return poolPrice
          }
        } catch (error) {
          console.warn('Failed to fetch from Uniswap pool:', error)
          // Continue to fallback
        }
      }
      
      // Priority 3: Fallback testnet price
      const fallbackPrice = 0.10 // $0.10 for testnet
      console.log('Using fallback testnet price:', fallbackPrice)
      return fallbackPrice
      
    } catch (error) {
      console.error('Failed to fetch price:', error)
      return 0.10 // Safe fallback
    }
  }
  
  /**
   * Fetch price from Uniswap V2 pool
   * Assumes pool is paired with USDC or similar stablecoin
   */
  private async fetchFromUniswap(): Promise<number> {
    if (!UNISWAP_POOL_ADDRESS) {
      throw new Error('No Uniswap pool configured')
    }
    
    const poolContract = new ethers.Contract(
      UNISWAP_POOL_ADDRESS,
      POOL_ABI,
      this.provider
    )
    
    // Get reserves
    const reserves = await poolContract.getReserves()
    const reserve0 = reserves.reserve0
    const reserve1 = reserves.reserve1
    
    // Get token addresses to determine order
    const token0 = await poolContract.token0()
    const token1 = await poolContract.token1()
    
    let price: number
    
    // Determine which reserve is $CSTAKE and which is the quote currency (USDC)
    if (token0.toLowerCase() === CSTAKE_TOKEN_ADDRESS.toLowerCase()) {
      // $CSTAKE is token0, quote currency is token1
      // Price = reserve1 / reserve0
      const reserve0Number = Number(ethers.formatUnits(reserve0, 18)) // $CSTAKE has 18 decimals
      const reserve1Number = Number(ethers.formatUnits(reserve1, 6))  // USDC has 6 decimals
      price = reserve1Number / reserve0Number
    } else {
      // $CSTAKE is token1, quote currency is token0
      // Price = reserve0 / reserve1
      const reserve0Number = Number(ethers.formatUnits(reserve0, 6))  // USDC has 6 decimals
      const reserve1Number = Number(ethers.formatUnits(reserve1, 18)) // $CSTAKE has 18 decimals
      price = reserve0Number / reserve1Number
    }
    
    // Sanity check: price should be reasonable (between $0.001 and $1000)
    if (price < 0.001 || price > 1000) {
      throw new Error(`Unreasonable price detected: ${price}`)
    }
    
    return price
  }
}

// Singleton instance
export const uniswapPriceService = new UniswapPriceService()

