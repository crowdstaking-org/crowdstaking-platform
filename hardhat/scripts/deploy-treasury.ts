import { ethers } from 'hardhat'
import { saveDeployment } from './deployment-utils'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying CrowdStakingTreasury with account:', deployer.address)
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH')

  const Treasury = await ethers.getContractFactory('CrowdStakingTreasury')
  const treasury = await Treasury.deploy(deployer.address)
  await treasury.waitForDeployment()

  const address = await treasury.getAddress()
  console.log('✅ CrowdStakingTreasury deployed to:', address)

  await saveDeployment('CrowdStakingTreasury', address, {
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


