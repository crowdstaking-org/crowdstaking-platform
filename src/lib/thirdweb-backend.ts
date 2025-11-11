/**
 * ThirdWeb Backend Helpers
 * Direct HTTP API calls (no MCP) with Hybrid Gas Payment
 * 
 * Supports two gas payment modes:
 * - server-wallet: Uses ThirdWeb server wallet (needs ETH balance)
 * - sponsored: Uses ThirdWeb sponsorship (needs credits)
 */

const THIRDWEB_API_BASE = 'https://api.thirdweb.com'

/**
 * Call ThirdWeb HTTP API with authentication
 */
async function callThirdWebAPI(endpoint: string, options: RequestInit = {}) {
  const secretKey = process.env.THIRDWEB_SECRET_KEY
  
  if (!secretKey) {
    throw new Error('THIRDWEB_SECRET_KEY not configured in environment')
  }
  
  const response = await fetch(`${THIRDWEB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-secret-key': secretKey,
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = 'ThirdWeb API error'
    
    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.message || errorData.error || errorMessage
    } catch {
      errorMessage = errorText || errorMessage
    }
    
    throw new Error(`${errorMessage} (Status: ${response.status})`)
  }
  
  return response.json()
}

/**
 * Wait for transaction confirmation on blockchain
 * Polls ThirdWeb API until transaction is confirmed or fails
 */
export async function waitForTransactionConfirmation(
  transactionId: string,
  maxAttempts: number = 30,
  interval: number = 2000
): Promise<void> {
  console.log(`Waiting for transaction ${transactionId}...`)
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await callThirdWebAPI(`/v1/transaction/status/${transactionId}`, {
        method: 'GET',
      })
      
      console.log(`TX ${transactionId} status:`, result.status)
      
      if (result.status === 'mined' || result.status === 'completed') {
        console.log(`Transaction ${transactionId} confirmed!`)
        return
      }
      
      if (result.status === 'errored' || result.status === 'failed') {
        throw new Error(`Transaction failed: ${result.errorMessage || 'Unknown error'}`)
      }
      
      // Still pending, wait and retry
      await new Promise(resolve => setTimeout(resolve, interval))
      
    } catch (error: any) {
      // If this is a final error (not just pending), throw it
      if (error.message?.includes('failed') || error.message?.includes('errored')) {
        throw error
      }
      
      // Otherwise continue polling
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }
  
  throw new Error(`Transaction confirmation timeout after ${maxAttempts * interval / 1000} seconds`)
}

/**
 * Transfer ERC20 tokens using ThirdWeb API
 * Supports both gas payment modes
 */
export async function transferTokens(params: {
  tokenAddress: string
  to: string
  amount: string
  chainId?: number
  gasMode?: 'server-wallet' | 'sponsored'
}): Promise<{ transactionId: string }> {
  const {
    tokenAddress,
    to,
    amount,
    chainId = 84532, // Base Sepolia default
    gasMode = process.env.THIRDWEB_GAS_MODE || 'server-wallet',
  } = params
  
  const payload: any = {
    chain_id: chainId,
    token_address: tokenAddress,
    to_address: to,
    amount,
  }
  
  // Add gas mode if sponsored
  if (gasMode === 'sponsored') {
    payload.tx_mode = 'sponsored'
  }
  
  console.log(`Transferring ${amount} tokens to ${to} (gas: ${gasMode})`)
  
  const result = await callThirdWebAPI('/v1/token/transfer', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  
  return {
    transactionId: result.queueId || result.transactionId,
  }
}

/**
 * Get current gas payment mode from environment
 */
export function getGasMode(): 'server-wallet' | 'sponsored' {
  const mode = process.env.THIRDWEB_GAS_MODE
  
  if (mode === 'sponsored') {
    return 'sponsored'
  }
  
  return 'server-wallet' // Default
}

