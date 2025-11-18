import { ethers } from 'hardhat'
import { saveDeployment, loadDeployment } from './deployment-utils'

interface FactoryDeployParams {
  treasuryAddress?: string
  feeBps?: number
  payoutToken?: string
  capitalToken?: string
}

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying ProjectFactory with account:', deployer.address)
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH')

  // Get parameters from environment or use defaults
  const treasuryAddress =
    process.env.V4_TREASURY_ADDRESS ||
    (await loadDeployment('CrowdStakingTreasury'))?.address ||
    ethers.ZeroAddress

  const feeBps = Number(process.env.V4_FEE_BPS || '200') // 2%
  const payoutToken = process.env.V4_PAYOUT_TOKEN || ethers.ZeroAddress
  const capitalToken = process.env.V4_CAPITAL_TOKEN || ethers.ZeroAddress

  if (treasuryAddress === ethers.ZeroAddress) {
    throw new Error('Treasury address is required. Deploy treasury first or set V4_TREASURY_ADDRESS')
  }

  console.log('Factory parameters:')
  console.log('  Treasury:', treasuryAddress)
  console.log('  Fee BPS:', feeBps)
  console.log('  Payout Token:', payoutToken)
  console.log('  Capital Token:', capitalToken)

  const Factory = await ethers.getContractFactory('ProjectFactory')
  const factory = await Factory.deploy(treasuryAddress, feeBps, payoutToken, capitalToken)
  await factory.waitForDeployment()

  const address = await factory.getAddress()
  console.log('✅ ProjectFactory deployed to:', address)

  await saveDeployment('ProjectFactory', address, {
    treasury: treasuryAddress,
    feeBps,
    payoutToken,
    capitalToken,
    owner: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
  })

  return address
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


