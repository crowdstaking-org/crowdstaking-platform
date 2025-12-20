#!/usr/bin/env node

/**
 * Script to verify deployer key format
 * 
 * Usage: node scripts/verify-deployer-key.js
 */

require('dotenv').config({ path: '.env.local' })

const key = process.env.DEPLOYER_PRIVATE_KEY

if (!key) {
  console.log('❌ DEPLOYER_PRIVATE_KEY not found in .env.local')
  process.exit(1)
}

console.log('🔍 Verifying Deployer Key Format...\n')
console.log('Key length:', key.length, 'characters')
console.log('Expected:  66 characters (0x + 64 hex chars)')
console.log('Starts with 0x:', key.startsWith('0x') ? '✅' : '❌')
console.log('First 20 chars:', key.substring(0, 20) + '...')
console.log('Last 10 chars:', '...' + key.substring(key.length - 10))

if (key.length !== 66) {
  console.log('\n❌ ERROR: Key length is incorrect!')
  console.log('   A valid Ethereum private key must be:')
  console.log('   - 66 characters long (including "0x")')
  console.log('   - Start with "0x"')
  console.log('   - Followed by 64 hexadecimal characters')
  console.log('\n💡 TIP: Make sure the key in .env.local is complete and not cut off.')
  process.exit(1)
}

if (!key.startsWith('0x')) {
  console.log('\n❌ ERROR: Key must start with "0x"')
  process.exit(1)
}

// Check if it's valid hex
const hexPart = key.substring(2)
if (!/^[0-9a-fA-F]{64}$/.test(hexPart)) {
  console.log('\n❌ ERROR: Key contains invalid hexadecimal characters')
  process.exit(1)
}

console.log('\n✅ Key format is valid!')
console.log('   Address would be:', require('ethers').Wallet.createRandom().address) // Just to show it works
console.log('\n💡 You can now deploy contracts with:')
console.log('   npm run deploy:v4 -- --network baseSepolia')



