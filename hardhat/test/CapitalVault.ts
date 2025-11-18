import { expect } from "chai";
import { ethers } from "hardhat";

describe("CapitalVault", () => {
  async function deployFixture() {
    const [owner, governance, contributor, recipient] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const capitalToken = await MockToken.deploy();
    await capitalToken.waitForDeployment();
    await capitalToken.mint(contributor.address, ethers.parseEther("1000"));

    const CapitalVault = await ethers.getContractFactory("CapitalVault");
    const vault = await CapitalVault.deploy(await capitalToken.getAddress(), governance.address);
    await vault.waitForDeployment();

    return { owner, governance, contributor, recipient, capitalToken, vault };
  }

  it("handles capital deposit, confirmation and withdrawal", async () => {
    const { governance, contributor, recipient, capitalToken, vault } = await deployFixture();

    const depositId = ethers.encodeBytes32String("seed-001");
    const amount = ethers.parseEther("250");

    await capitalToken.connect(contributor).approve(await vault.getAddress(), amount);
    await expect(vault.connect(contributor).depositCapital(depositId, amount, "ipfs://meta"))
      .to.emit(vault, "DepositInitiated")
      .withArgs(depositId, contributor.address, amount);

    await expect(vault.connect(governance).confirmDeposit(depositId, "proof:abc"))
      .to.emit(vault, "DepositConfirmed")
      .withArgs(depositId, governance.address, "proof:abc");
    // double confirm blocked
    await expect(vault.connect(governance).confirmDeposit(depositId, "again")).to.be.revertedWith("Already confirmed");

    const balBefore = await capitalToken.balanceOf(recipient.address);
    await vault.connect(governance).withdrawConfirmedCapital(recipient.address, amount);
    const balAfter = await capitalToken.balanceOf(recipient.address);
    expect(balAfter - balBefore).to.equal(amount);
  });
});

