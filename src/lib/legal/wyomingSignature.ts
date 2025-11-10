/**
 * Wyoming DAO LLC Legal Signature Service
 * Generates and handles legal incorporation signatures
 */

export interface LegalSignatureParams {
  projectName: string
  founderAddress: string
  tokenAddress: string
}

export interface LegalSignatureResult {
  message: string
  signature: string
  signedAt: string
}

/**
 * Generates the legal incorporation message for Wyoming DAO LLC
 * This message will be signed by the founder's wallet
 */
export function generateWyomingDAOMessage(params: LegalSignatureParams): string {
  const timestamp = new Date().toISOString()
  
  return `WYOMING DAO LLC INCORPORATION

Project Name: ${params.projectName}
Token Address: ${params.tokenAddress}
Founder Address: ${params.founderAddress}
Date: ${timestamp}

I, the holder of wallet ${params.founderAddress}, hereby incorporate 
"${params.projectName}" as a Wyoming DAO LLC under the CrowdStaking 
legal framework.

Terms & Acknowledgments:
1. 2% of project tokens are allocated to CrowdStaking DAO
2. I accept the CrowdStaking Terms of Service
3. I comply with Wyoming DAO LLC regulations (Wyoming Statute Title 17, Chapter 31)
4. This digital signature serves as legal proof of incorporation intent

Legal Framework: CrowdStaking Protocol v1.0
Jurisdiction: Wyoming, United States
Entity Type: Decentralized Autonomous Organization LLC

By signing this message, I confirm that I have read, understood, and agree 
to the above terms.`
}

/**
 * Request legal signature from founder's wallet
 * Uses ThirdWeb wallet.signMessage() - no private key exposure
 * 
 * @throws Error if user rejects signature or wallet not connected
 */
export async function requestLegalSignature(
  wallet: any, // ThirdWeb wallet instance
  params: LegalSignatureParams
): Promise<LegalSignatureResult> {
  if (!wallet) {
    throw new Error('Wallet not connected. Please connect your wallet first.')
  }
  
  if (!wallet.signMessage) {
    throw new Error('Wallet does not support message signing.')
  }
  
  // Generate legal message
  const message = generateWyomingDAOMessage(params)
  
  try {
    // Request signature via wallet (triggers MetaMask/wallet popup)
    const signature = await wallet.signMessage({ message })
    
    return {
      message,
      signature,
      signedAt: new Date().toISOString(),
    }
  } catch (error: any) {
    // Handle user rejection
    if (error.message?.includes('User rejected') || 
        error.message?.includes('user denied') ||
        error.code === 4001) {
      throw new Error('Legal signature was rejected. You must sign the incorporation message to continue.')
    }
    
    // Other errors
    throw new Error(`Failed to sign legal message: ${error.message || 'Unknown error'}`)
  }
}

/**
 * Verify a signature (optional - for future validation)
 * This would use ethers.verifyMessage() on the backend
 */
export function verifyLegalSignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  // TODO: Implement signature verification using ethers.verifyMessage()
  // For now, we trust the signature from the wallet
  return true
}

