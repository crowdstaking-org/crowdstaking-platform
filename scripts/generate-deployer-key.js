#!/usr/bin/env node

/**
 * Script to generate a new deployer wallet and private key
 * 
 * Usage: node scripts/generate-deployer-key.js
 * 
 * This will:
 * 1. Generate a new random wallet
 * 2. Display the address and private key
 * 3. Show instructions for funding the wallet
 */

const { ethers } = require('ethers')

function main() {
  console.log('🔐 Generating new Deployer Wallet...\n')
  
  // Generate a new random wallet
  const wallet = ethers.Wallet.createRandom()
  
  console.log('✅ New Wallet Generated!\n')
  console.log('='.repeat(60))
  console.log('📋 WALLET INFORMATION')
  console.log('='.repeat(60))
  console.log('Address:     ', wallet.address)
  console.log('Private Key: ', wallet.privateKey)
  console.log('='.repeat(60))
  console.log('')
  
  console.log('⚠️  IMPORTANT SECURITY NOTES:')
  console.log('  1. NEVER commit the private key to Git!')
  console.log('  2. Store it securely (password manager, etc.)')
  console.log('  3. Only use this wallet for deployments')
  console.log('  4. Keep a backup of the private key')
  console.log('')
  
  console.log('📝 NEXT STEPS:')
  console.log('  1. Add to .env.local (NOT .env!):')
  console.log(`     DEPLOYER_PRIVATE_KEY=${wallet.privateKey}`)
  console.log('')
  console.log('  2. Fund the wallet with ETH on Base Sepolia:')
  console.log('     - Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet')
  console.log('     - Or: https://faucet.quicknode.com/base/sepolia')
  console.log('     - Send ETH to:', wallet.address)
  console.log('     - You need ~0.01-0.1 ETH for deployments')
  console.log('')
  console.log('  3. Verify balance:')
  console.log('     - Check on Basescan: https://sepolia.basescan.org/address/' + wallet.address)
  console.log('')
  
  console.log('🚀 After funding, you can deploy contracts with:')
  console.log('     npm run deploy:v4 -- --network baseSepolia')
  console.log('')
}

main()


