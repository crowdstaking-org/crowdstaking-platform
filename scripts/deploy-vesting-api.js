const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function deployVestingContract() {
  console.log('🚀 Starting VestingContract deployment via ThirdWeb HTTP API...\n');

  // Load compiled contract
  const compiledPath = path.resolve(__dirname, '../contracts/compiled/VestingContract.json');
  const compiled = JSON.parse(fs.readFileSync(compiledPath, 'utf8'));

  // Configuration
  const TOKEN_ADDRESS = '0xa746381E05aE069846726Eb053788D4879B458DA';
  const FOUNDATION_WALLET = '0x252825B2DD9d4ea3489070C09Be63ea18879E5ab';
  const CHAIN_ID = 84532; // Base Sepolia
  // Try to get secret key from environment
  const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

  if (!SECRET_KEY) {
    throw new Error('THIRDWEB_SECRET_KEY or NEXT_PUBLIC_THIRDWEB_CLIENT_ID not found in environment');
  }

  console.log('📋 Contract Configuration:');
  console.log('  Token Address:', TOKEN_ADDRESS);
  console.log('  Foundation Wallet:', FOUNDATION_WALLET);
  console.log('  Chain ID:', CHAIN_ID, '(Base Sepolia)');
  console.log('  Bytecode size:', compiled.bytecode.length / 2, 'bytes\n');

  // Prepare API request
  const requestBody = {
    chainId: CHAIN_ID,
    from: FOUNDATION_WALLET,
    bytecode: compiled.bytecode,
    abi: compiled.abi,
    constructorParams: {
      _cstakeToken: TOKEN_ADDRESS,
      _foundationWallet: FOUNDATION_WALLET,
    },
  };

  console.log('📤 Sending deployment request to ThirdWeb API...');

  try {
    const response = await fetch('https://api.thirdweb.com/v1/contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': SECRET_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Deployment failed:');
      console.error('Status:', response.status);
      console.error('Error:', data);
      throw new Error(`API request failed: ${JSON.stringify(data)}`);
    }

    console.log('\n✅ Deployment successful!');
    console.log('\n📍 Contract Details:');
    console.log('  Address:', data.result.address);
    console.log('  Chain ID:', data.result.chainId);
    console.log('  Transaction ID:', data.result.transactionId);
    console.log('\n🔗 View on Basescan:');
    console.log('  https://sepolia.basescan.org/address/' + data.result.address);

    // Save deployment info
    const deploymentInfo = {
      contractName: 'VestingContract',
      address: data.result.address,
      chainId: data.result.chainId,
      network: 'Base Sepolia',
      transactionId: data.result.transactionId,
      constructorParams: {
        cstakeToken: TOKEN_ADDRESS,
        foundationWallet: FOUNDATION_WALLET,
      },
      deployedAt: new Date().toISOString(),
    };

    const deploymentPath = path.resolve(__dirname, '../contracts/deployed/VestingContract-testnet.json');
    const deployedDir = path.dirname(deploymentPath);
    if (!fs.existsSync(deployedDir)) {
      fs.mkdirSync(deployedDir, { recursive: true });
    }
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log('\n💾 Deployment info saved to:');
    console.log('  contracts/deployed/VestingContract-testnet.json');

    console.log('\n📝 Next Steps:');
    console.log('  1. Update .env.local with:');
    console.log(`     VESTING_CONTRACT_ADDRESS_TESTNET=${data.result.address}`);
    console.log('  2. Approve VestingContract to spend tokens');
    console.log('  3. Test the complete flow');

    return data.result;
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    throw error;
  }
}

// Run deployment
if (require.main === module) {
  deployVestingContract()
    .then(() => {
      console.log('\n🎉 Deployment complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { deployVestingContract };

