import { expect } from "chai";
import { ethers } from "hardhat";

enum ProposalType {
  WORK = 0,
  BOUNTY = 1,
  CAPITAL = 2,
  PAYOUT = 3,
  REVOKE = 4,
}

describe("GovernanceModule", () => {
  async function deployGovernanceFixture() {
    const [owner, partnerA, partnerB] = await ethers.getSigners();

    const PartnerRegister = await ethers.getContractFactory("PartnerRegister");
    const register = await PartnerRegister.deploy(
      ethers.ZeroHash,
      "Partner Token",
      "SBT-P",
      ethers.ZeroAddress
    );
    await register.waitForDeployment();

    // Temporarily set controller to owner to seed partners
    await register.connect(owner).setController(owner.address);
    await register.connect(owner).addPartner(partnerA.address, 6000);
    await register.connect(owner).addPartner(partnerB.address, 4000);

    const GovernanceModule = await ethers.getContractFactory("GovernanceModule");
    const governance = await GovernanceModule.deploy(await register.getAddress());
    await governance.waitForDeployment();

    // set controller to governance contract
    await register.connect(owner).setController(await governance.getAddress());
    await governance.connect(owner).setVotingParams(24 * 60 * 60, 5000, 6600); // 1 day voting period

    return { owner, partnerA, partnerB, register, governance };
  }

  async function advanceTime(seconds: number) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
  }

  it("executes work proposal once quorum is met", async () => {
    const { partnerA, governance } = await deployGovernanceFixture();

    const proposalIdTx = await governance.connect(partnerA).createProposal(ProposalType.WORK, "0x");
    const receipt = await proposalIdTx.wait();
    const proposalId = receipt?.logs[0]?.args?.id ?? 0n;

    await governance.connect(partnerA).castVote(Number(proposalId), true);
    await advanceTime(24 * 60 * 60 + 1);

    await expect(governance.execute(Number(proposalId)))
      .to.emit(governance, "ProposalExecuted")
      .withArgs(Number(proposalId));

    const proposal = await governance.proposals(Number(proposalId));
    expect(proposal.executed).to.equal(true);
  });

  it("enforces capital threshold for capital proposals", async () => {
    const { partnerA, partnerB, governance } = await deployGovernanceFixture();
    const tx = await governance.connect(partnerA).createProposal(ProposalType.CAPITAL, "0x");
    const receipt = await tx.wait();
    const proposalId = receipt?.logs[0]?.args?.id ?? 0n;

    await governance.connect(partnerA).castVote(Number(proposalId), true);
    await governance.connect(partnerB).castVote(Number(proposalId), false);
    await advanceTime(24 * 60 * 60 + 1);

    await expect(governance.execute(Number(proposalId))).to.be.revertedWith(
      "Capital threshold not met"
    );
  });
});

