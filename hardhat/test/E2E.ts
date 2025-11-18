import { expect } from "chai";
import { ethers } from "hardhat";

describe("E2E – Factory → Vault Distribution → Claims", () => {
  it("runs a minimal happy path", async () => {
    const [owner, treasury, founder, partnerB] = await ethers.getSigners();

    // Tokens
    const MockToken = await ethers.getContractFactory("MockERC20");
    const payout = await MockToken.deploy();
    await payout.waitForDeployment();
    await payout.mint(owner.address, ethers.parseEther("1000"));

    const capital = await MockToken.deploy();
    await capital.waitForDeployment();

    // Factory suite
    const Factory = await ethers.getContractFactory("ProjectFactory");
    const factory = await Factory.deploy(
      treasury.address,
      200, // 2%
      await payout.getAddress(),
      await capital.getAddress()
    );
    await factory.waitForDeployment();

    const slug = "demo-e2e";
    const tx = await factory.createProject(slug, founder.address);
    const receipt = await tx.wait();
    let contractsDeployed: any = null;
    for (const log of receipt!.logs) {
      try {
        const parsed = factory.interface.parseLog({ topics: log.topics, data: log.data });
        if (parsed && parsed.name === "ProjectCreated") {
          const tuple = parsed.args[2] as any;
          contractsDeployed = {
            partnerRegister: tuple.partnerRegister as string,
            governanceModule: tuple.governanceModule as string,
            profitVault: tuple.profitVault as string,
            capitalVault: tuple.capitalVault as string,
          };
          break;
        }
      } catch {
        // skip non-matching logs
      }
    }
    if (!contractsDeployed) {
      throw new Error("ProjectCreated event not found");
    }

    const register = await ethers.getContractAt("PartnerRegister", contractsDeployed.partnerRegister);
    const vault = await ethers.getContractAt("ProfitVault", contractsDeployed.profitVault);
    const governance = await ethers.getContractAt("GovernanceModule", contractsDeployed.governanceModule);

    // Adjust shares: set controller to owner, reduce founder by 40%, add partnerB 40%, then restore controller
    await register.connect(owner).setController(owner.address);
    await register.connect(owner).reducePartnerShare(founder.address, 4000);
    await register.connect(owner).addPartner(partnerB.address, 4000);
    await register.connect(owner).setController(await governance.getAddress());

    // Deposit earnings and start distribution (owner path)
    await payout.connect(owner).approve(await vault.getAddress(), ethers.parseEther("1000"));
    await vault.connect(owner).deposit(ethers.parseEther("1000"));
    const periodId = ethers.encodeBytes32String("E2E-P1");
    await expect(vault.connect(owner).ownerStartDistribution(periodId))
      .to.emit(vault, "DistributionStarted");

    // Claims: founder 60%, partnerB 40%
    const founderBalBefore = await payout.balanceOf(founder.address);
    await vault.connect(founder).claim(periodId);
    const founderBalAfter = await payout.balanceOf(founder.address);
    expect(founderBalAfter - founderBalBefore).to.equal(ethers.parseEther("588"));

    const partnerBBalBefore = await payout.balanceOf(partnerB.address);
    await vault.connect(partnerB).claim(periodId);
    const partnerBBalAfter = await payout.balanceOf(partnerB.address);
    expect(partnerBBalAfter - partnerBBalBefore).to.equal(ethers.parseEther("392"));
  });
});

