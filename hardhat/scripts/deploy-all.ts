import { ethers } from 'hardhat'
import { saveDeployment, loadDeployment } from './deployment-utils'

/**
 * Main deployment script that deploys all v4 contracts in the correct order:
 * 1. CrowdStakingTreasury
 * 2. MockERC20 tokens (if on testnet/local)
 * 3. ProjectFactory
 */
async function main() {
  const [deployer] = await ethers.getSigners()
  const network = await ethers.provider.getNetwork()
  const chainId = Number(network.chainId)

  console.log('🚀 Starting v4 Contract Deployment')
  console.log('Network:', network.name, `(Chain ID: ${chainId})`)
  console.log('Deployer:', deployer.address)
  console.log('Balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH')
  console.log('')

  const deployments: Record<string, string> = {}

  // Step 1: Deploy Treasury
  console.log('📦 Step 1: Deploying CrowdStakingTreasury...')
  const existingTreasury = await loadDeployment('CrowdStakingTreasury')
  let treasuryAddress: string

  if (existingTreasury?.address && existingTreasury.chainId === chainId) {
    console.log('  ⏭️  Treasury already deployed at:', existingTreasury.address)
    treasuryAddress = existingTreasury.address
  } else {
    const Treasury = await ethers.getContractFactory('CrowdStakingTreasury')
    const treasury = await Treasury.deploy(deployer.address)
    await treasury.waitForDeployment()
    treasuryAddress = await treasury.getAddress()
    console.log('  ✅ Treasury deployed to:', treasuryAddress)

    await saveDeployment('CrowdStakingTreasury', treasuryAddress, {
      owner: deployer.address,
      network: network.name,
      chainId,
    })
  }
  deployments.treasury = treasuryAddress

  // Step 2: Deploy Mock Tokens (only if not provided via env)
  const payoutToken = process.env.V4_PAYOUT_TOKEN
  const capitalToken = process.env.V4_CAPITAL_TOKEN

  if (!payoutToken || !capitalToken || payoutToken === ethers.ZeroAddress || capitalToken === ethers.ZeroAddress) {
    console.log('\n📦 Step 2: Deploying MockERC20 tokens...')
    const MockERC20 = await ethers.getContractFactory('MockERC20')

    const payoutTokenContract = await MockERC20.deploy()
    await payoutTokenContract.waitForDeployment()
    const payoutAddress = await payoutTokenContract.getAddress()
    console.log('  ✅ Payout Token deployed to:', payoutAddress)

    const capitalTokenContract = await MockERC20.deploy()
    await capitalTokenContract.waitForDeployment()
    const capitalAddress = await capitalTokenContract.getAddress()
    console.log('  ✅ Capital Token deployed to:', capitalAddress)

    await saveDeployment('MockERC20_Payout', payoutAddress, {
      type: 'payout',
      network: network.name,
      chainId,
    })

    await saveDeployment('MockERC20_Capital', capitalAddress, {
      type: 'capital',
      network: network.name,
      chainId,
    })

    deployments.payoutToken = payoutAddress
    deployments.capitalToken = capitalAddress
  } else {
    console.log('\n📦 Step 2: Using existing tokens from environment')
    console.log('  Payout Token:', payoutToken)
    console.log('  Capital Token:', capitalToken)
    deployments.payoutToken = payoutToken
    deployments.capitalToken = capitalToken
  }

  // Step 3: Deploy Factory
  console.log('\n📦 Step 3: Deploying ProjectFactory...')
  const feeBps = Number(process.env.V4_FEE_BPS || '200') // 2%

  const existingFactory = await loadDeployment('ProjectFactory')
  let factoryAddress: string

  if (existingFactory?.address && existingFactory.chainId === chainId) {
    console.log('  ⏭️  Factory already deployed at:', existingFactory.address)
    factoryAddress = existingFactory.address
  } else {
    const Factory = await ethers.getContractFactory('ProjectFactory')
    const factory = await Factory.deploy(
      treasuryAddress,
      feeBps,
      deployments.payoutToken,
      deployments.capitalToken
    )
    await factory.waitForDeployment()
    factoryAddress = await factory.getAddress()
    console.log('  ✅ Factory deployed to:', factoryAddress)

    await saveDeployment('ProjectFactory', factoryAddress, {
      treasury: treasuryAddress,
      feeBps,
      payoutToken: deployments.payoutToken,
      capitalToken: deployments.capitalToken,
      owner: deployer.address,
      network: network.name,
      chainId,
    })
  }
  deployments.factory = factoryAddress

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('✅ Deployment Complete!')
  console.log('='.repeat(60))
  console.log('\n📋 Contract Addresses:')
  console.log('  CrowdStakingTreasury:', deployments.treasury)
  console.log('  Payout Token:        ', deployments.payoutToken)
  console.log('  Capital Token:       ', deployments.capitalToken)
  console.log('  ProjectFactory:      ', deployments.factory)
  console.log('\n💡 Update your .env.local with:')
  console.log(`  V4_TREASURY_ADDRESS=${deployments.treasury}`)
  console.log(`  V4_PAYOUT_TOKEN=${deployments.payoutToken}`)
  console.log(`  V4_CAPITAL_TOKEN=${deployments.capitalToken}`)
  console.log(`  V4_FACTORY_ADDRESS=${deployments.factory}`)
  console.log(`  V4_FEE_BPS=${feeBps}`)
  console.log('')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

