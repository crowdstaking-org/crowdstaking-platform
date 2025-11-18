import { expect } from "chai";
import { ethers } from "hardhat";

const PERIOD_ID = ethers.encodeBytes32String("Q1-2025");

describe("ProfitVault", () => {
  async function deployFixture() {
    const [owner, treasury, partnerA, partnerB, governance] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const payoutToken = await MockToken.deploy();
    await payoutToken.waitForDeployment();
    await payoutToken.mint(owner.address, ethers.parseEther("10000"));

    const PartnerRegister = await ethers.getContractFactory("PartnerRegister");
    const partnerRegister = await PartnerRegister.deploy(
      ethers.encodeBytes32String("project"),
      "Partner Token",
      "SBT-P",
      ethers.ZeroAddress
    );
    await partnerRegister.waitForDeployment();

    await partnerRegister.connect(owner).setController(owner.address);
    await partnerRegister.connect(owner).addPartner(partnerA.address, 6000);
    await partnerRegister.connect(owner).addPartner(partnerB.address, 4000);

    const ProfitVault = await ethers.getContractFactory("ProfitVault");
    const vault = await ProfitVault.deploy(
      await payoutToken.getAddress(),
      treasury.address,
      200,
      governance.address,
      await partnerRegister.getAddress()
    );
    await vault.waitForDeployment();

    return {
      owner,
      treasury,
      partnerA,
      partnerB,
      governance,
      payoutToken,
      partnerRegister,
      vault,
    };
  }

  it("distributes earnings with 2% fee and proportional claims", async () => {
    const {
      owner,
      treasury,
      partnerA,
      partnerB,
      governance,
      payoutToken,
      vault,
    } = await deployFixture();

    const depositAmount = ethers.parseEther("1000");
    await payoutToken.connect(owner).approve(await vault.getAddress(), depositAmount);
    await expect(vault.connect(owner).deposit(depositAmount))
      .to.emit(vault, "Deposit")
      .withArgs(owner.address, depositAmount);

    await expect(vault.connect(governance).startDistribution(PERIOD_ID))
      .to.emit(vault, "DistributionStarted")
      .withArgs(PERIOD_ID, ethers.parseEther("980"), ethers.parseEther("20"));

    const treasuryBalance = await payoutToken.balanceOf(treasury.address);
    expect(treasuryBalance).to.equal(ethers.parseEther("20"));

    await expect(vault.connect(partnerA).claim(PERIOD_ID))
      .to.emit(vault, "Claimed")
      .withArgs(PERIOD_ID, partnerA.address, ethers.parseEther("588"));
    await expect(vault.connect(partnerB).claim(PERIOD_ID))
      .to.emit(vault, "Claimed")
      .withArgs(PERIOD_ID, partnerB.address, ethers.parseEther("392"));

    await expect(vault.connect(partnerA).claim(PERIOD_ID)).to.be.revertedWith("Already claimed");
  });

  it("prevents starting distribution twice and requires funds", async () => {
    const { owner, governance, payoutToken, vault } = await deployFixture();
    // No funds
    await expect(vault.connect(governance).startDistribution(PERIOD_ID)).to.be.revertedWith("No funds");
    // Deposit funds then start
    await payoutToken.connect(owner).approve(await vault.getAddress(), ethers.parseEther("10"));
    await vault.connect(owner).deposit(ethers.parseEther("10"));
    await vault.connect(governance).startDistribution(PERIOD_ID);
    // Second start prevented
    await expect(vault.connect(governance).startDistribution(PERIOD_ID)).to.be.revertedWith("Already started");
  });
});

