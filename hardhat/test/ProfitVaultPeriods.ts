import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProfitVault – Multiple periods and share changes", () => {
  async function deployFixture() {
    const [owner, treasury, partnerA, partnerB, controller, governance] = await ethers.getSigners();

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

    // initial shares 50/50
    await partnerRegister.connect(owner).setController(controller.address);
    await partnerRegister.connect(controller).addPartner(partnerA.address, 5000);
    await partnerRegister.connect(controller).addPartner(partnerB.address, 5000);
    // Controller ist owner bereits (gesetzt in deployFixture), daher direkt Änderungen vornehmen

    const ProfitVault = await ethers.getContractFactory("ProfitVault");
    const vault = await ProfitVault.deploy(
      await payoutToken.getAddress(),
      treasury.address,
      200,
      governance.address,
      await partnerRegister.getAddress()
    );
    await vault.waitForDeployment();

    return { owner, treasury, partnerA, partnerB, controller, governance, payoutToken, partnerRegister, vault };
  }

  it("distributes over two periods and reflects share changes", async () => {
    const { owner, controller, partnerA, partnerB, payoutToken, vault, partnerRegister } = await deployFixture();
    const period1 = ethers.encodeBytes32String("P1");
    const period2 = ethers.encodeBytes32String("P2");

    // Period 1: deposit 1000 → fee 2% = 20 → distributable 980 → each 490
    await payoutToken.connect(owner).approve(await vault.getAddress(), ethers.parseEther("1000"));
    await vault.connect(owner).deposit(ethers.parseEther("1000"));
    await vault.connect(owner).ownerStartDistribution(period1);
    await vault.connect(partnerA).claim(period1);
    await vault.connect(partnerB).claim(period1);

    // Adjust shares to 80/20 (controller path)
    await partnerRegister.connect(owner).setController(owner.address);
    await partnerRegister.connect(owner).reducePartnerShare(partnerB.address, 3000); // partnerB 2000
    await partnerRegister.connect(owner).addPartner(partnerA.address, 3000); // partnerA 8000
    // keep controller as owner for remainder of test

    // Period 2: deposit 1000 → fee 20 → distributable 980 → 80% = 784, 20% = 196
    await payoutToken.connect(owner).approve(await vault.getAddress(), ethers.parseEther("1000"));
    await vault.connect(owner).deposit(ethers.parseEther("1000"));
    await vault.connect(owner).ownerStartDistribution(period2);

    const aBefore = await payoutToken.balanceOf(partnerA.address);
    await vault.connect(partnerA).claim(period2);
    const aAfter = await payoutToken.balanceOf(partnerA.address);
    expect(aAfter - aBefore).to.equal(ethers.parseEther("784"));

    const bBefore = await payoutToken.balanceOf(partnerB.address);
    await vault.connect(partnerB).claim(period2);
    const bAfter = await payoutToken.balanceOf(partnerB.address);
    expect(bAfter - bBefore).to.equal(ethers.parseEther("196"));
  });

  it("prevents claim if partner renounced before claim", async () => {
    const { owner, controller, partnerA, payoutToken, vault, partnerRegister } = await deployFixture();
    const period = ethers.encodeBytes32String("RENOUNCE");
    await payoutToken.connect(owner).approve(await vault.getAddress(), ethers.parseEther("100"));
    await vault.connect(owner).deposit(ethers.parseEther("100"));
    await vault.connect(owner).ownerStartDistribution(period);

    // Partner A renounces partnership before claiming
    await partnerRegister.connect(partnerA).renouncePartnership();
    await expect(vault.connect(partnerA).claim(period)).to.be.revertedWith("No share");
  });
});

