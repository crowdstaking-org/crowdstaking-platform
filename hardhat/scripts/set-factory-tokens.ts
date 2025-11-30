import { ethers } from 'hardhat'
import { loadDeployment } from './deployment-utils'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Setting Factory tokens with account:', deployer.address)

  // Load Factory deployment
  const factoryDeployment = await loadDeployment('ProjectFactory')
  if (!factoryDeployment?.address) {
    throw new Error('ProjectFactory not deployed. Deploy factory first.')
  }

  // Load token deployments
  const payoutToken = await loadDeployment('MockERC20_Payout')
  const capitalToken = await loadDeployment('MockERC20_Capital')

  if (!payoutToken?.address || !capitalToken?.address) {
    throw new Error('Token contracts not deployed. Deploy tokens first.')
  }

  console.log('Factory address:', factoryDeployment.address)
  console.log('Payout Token:', payoutToken.address)
  console.log('Capital Token:', capitalToken.address)

  const Factory = await ethers.getContractFactory('ProjectFactory')
  const factory = Factory.attach(factoryDeployment.address)

  // Check current tokens
  const currentPayout = await factory.payoutToken()
  const currentCapital = await factory.capitalToken()

  console.log('\nCurrent tokens:')
  console.log('  Payout:', currentPayout)
  console.log('  Capital:', currentCapital)

  if (currentPayout === payoutToken.address && currentCapital === capitalToken.address) {
    console.log('\n✅ Tokens already set correctly!')
    return
  }

  console.log('\nSetting tokens...')
  const tx = await factory.setTokens(payoutToken.address, capitalToken.address)
  await tx.wait()

  console.log('✅ Tokens set successfully!')
  console.log('  Transaction:', tx.hash)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


