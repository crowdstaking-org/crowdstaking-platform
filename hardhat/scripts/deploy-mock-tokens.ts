import { ethers } from 'hardhat'
import { saveDeployment } from './deployment-utils'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying MockERC20 tokens with account:', deployer.address)
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH')

  const MockERC20 = await ethers.getContractFactory('MockERC20')

  // Deploy Payout Token
  console.log('\n📦 Deploying Payout Token (MockERC20)...')
  const payoutToken = await MockERC20.deploy()
  await payoutToken.waitForDeployment()
  const payoutAddress = await payoutToken.getAddress()
  console.log('✅ Payout Token deployed to:', payoutAddress)

  // Deploy Capital Token
  console.log('\n📦 Deploying Capital Token (MockERC20)...')
  const capitalToken = await MockERC20.deploy()
  await capitalToken.waitForDeployment()
  const capitalAddress = await capitalToken.getAddress()
  console.log('✅ Capital Token deployed to:', capitalAddress)

  await saveDeployment('MockERC20_Payout', payoutAddress, {
    type: 'payout',
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
  })

  await saveDeployment('MockERC20_Capital', capitalAddress, {
    type: 'capital',
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
  })

  console.log('\n📋 Deployment Summary:')
  console.log('  Payout Token:', payoutAddress)
  console.log('  Capital Token:', capitalAddress)

  return { payoutAddress, capitalAddress }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


