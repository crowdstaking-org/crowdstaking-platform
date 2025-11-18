import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProjectFactory", () => {
  async function deployFixture() {
    const [owner, treasury, founder] = await ethers.getSigners();
    const MockToken = await ethers.getContractFactory("MockERC20");
    const payoutToken = await MockToken.deploy();
    await payoutToken.waitForDeployment();
    const capitalToken = await MockToken.deploy();
    await capitalToken.waitForDeployment();

    const Factory = await ethers.getContractFactory("ProjectFactory");
    const factory = await Factory.deploy(
      treasury.address,
      200,
      await payoutToken.getAddress(),
      await capitalToken.getAddress()
    );
    await factory.waitForDeployment();

    return { owner, treasury, founder, payoutToken, capitalToken, factory };
  }

  it("deploys per-project contracts and registers founder", async () => {
    const { founder, factory, treasury } = await deployFixture();
    const slug = "alpha";

    const factoryAddress = await factory.getAddress();
    const tx = await factory.createProject(slug, founder.address);
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error("No receipt");
    }
    const eventLog = receipt.logs.find((log) => log.address === factoryAddress);
    if (!eventLog) {
      throw new Error("ProjectCreated event not found");
    }
    const parsed = factory.interface.parseLog(eventLog);
    const projectId = parsed.args.projectId as string;

    const stored = await factory.projects(projectId);
    expect(stored.partnerRegister).to.properAddress;
    expect(stored.governanceModule).to.properAddress;
    expect(stored.profitVault).to.properAddress;
    expect(stored.capitalVault).to.properAddress;

    const register = await ethers.getContractAt("PartnerRegister", stored.partnerRegister);
    expect(await register.controller()).to.equal(stored.governanceModule);
    // Founder should still hold 100% initially
    expect(await register.totalShareBps()).to.equal(10_000);
    expect(await register.partnerTokenId(founder.address)).to.equal(1n);
    expect(await register.balanceOf(founder.address)).to.equal(1n);

    // Ensure fee treasury matches factory config via public values
    expect(await factory.treasury()).to.equal(treasury.address);
  });
});

