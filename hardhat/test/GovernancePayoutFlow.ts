import { expect } from "chai";
import { ethers } from "hardhat";

describe("Governance → PAYOUT Proposal → Distribution Flow", () => {
  it("creates PAYOUT proposal, executes via governance, starts distribution", async () => {
    const [owner, treasury, founder, partnerA] = await ethers.getSigners();

    // Deploy tokens
    const MockToken = await ethers.getContractFactory("MockERC20");
    const payout = await MockToken.deploy();
    await payout.waitForDeployment();
    await payout.mint(owner.address, ethers.parseEther("5000"));

    const capital = await MockToken.deploy();
    await capital.waitForDeployment();

    // Deploy factory
    const Factory = await ethers.getContractFactory("ProjectFactory");
    const factory = await Factory.deploy(
      treasury.address,
      200, // 2%
      await payout.getAddress(),
      await capital.getAddress()
    );
    await factory.waitForDeployment();

    // Create project
    const slug = "gov-payout-test";
    const tx = await factory.createProject(slug, founder.address);
    const receipt = await tx.wait();
    let contracts: any = null;
    for (const log of receipt!.logs) {
      try {
        const parsed = factory.interface.parseLog({ topics: log.topics, data: log.data });
        if (parsed && parsed.name === "ProjectCreated") {
          const tuple = parsed.args[2] as any;
          contracts = {
            partnerRegister: tuple.partnerRegister as string,
            governanceModule: tuple.governanceModule as string,
            profitVault: tuple.profitVault as string,
            capitalVault: tuple.capitalVault as string,
          };
          break;
        }
      } catch {
        // skip
      }
    }
    if (!contracts) throw new Error("ProjectCreated event not found");

    const register = await ethers.getContractAt("PartnerRegister", contracts.partnerRegister);
    const vault = await ethers.getContractAt("ProfitVault", contracts.profitVault);
    const governance = await ethers.getContractAt("GovernanceModule", contracts.governanceModule);

    // Add partnerA with 30% share
    await register.connect(owner).setController(owner.address);
    await register.connect(owner).reducePartnerShare(founder.address, 3000);
    await register.connect(owner).addPartner(partnerA.address, 3000);
    await register.connect(owner).setController(await governance.getAddress());

    // Deposit earnings
    await payout.connect(owner).approve(await vault.getAddress(), ethers.parseEther("5000"));
    await vault.connect(owner).deposit(ethers.parseEther("5000"));

    // Create PAYOUT proposal via governance (uses default 3-day voting period)
    const periodId = ethers.encodeBytes32String("Q1-2024");
    const proposalPayload = ethers.AbiCoder.defaultAbiCoder().encode(
      ["bytes32"],
      [periodId]
    );

    const createTx = await governance.connect(founder).createProposal(3, proposalPayload); // 3 = PAYOUT
    const createReceipt = await createTx.wait();
    let proposalId: bigint | null = null;
    if (createReceipt?.logs) {
      for (const log of createReceipt.logs) {
        try {
          const parsed = governance.interface.parseLog({ topics: log.topics, data: log.data });
          if (parsed && parsed.name === "ProposalCreated") {
            proposalId = parsed.args[0] as bigint;
            break;
          }
        } catch {
          // skip non-matching logs
        }
      }
    }
    // Fallback: get proposalId from return value
    if (proposalId === null) {
      const proposalCount = await governance.proposalCount();
      proposalId = proposalCount - 1n;
    }

    // Founder votes YES (100% share = 100% voting power)
    await governance.connect(founder).castVote(proposalId, true);

    // Fast-forward time to pass voting period (default is 3 days)
    await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60 + 1]);
    await ethers.provider.send("evm_mine", []);

    // Execute proposal (emits ProposalExecuted event; off-chain orchestration triggers startDistribution)
    await expect(governance.connect(founder).execute(proposalId))
      .to.emit(governance, "ProposalExecuted")
      .withArgs(proposalId);

    // Simulate off-chain orchestration: owner starts distribution after proposal execution
    await expect(vault.connect(owner).ownerStartDistribution(periodId))
      .to.emit(vault, "DistributionStarted")
      .withArgs(periodId, ethers.parseEther("4900"), ethers.parseEther("100"));

    // Verify distribution started
    const period = await vault.periods(periodId);
    expect(period.totalAmount).to.equal(ethers.parseEther("4900"));
    expect(period.feeAmount).to.equal(ethers.parseEther("100"));
    expect(period.claimable).to.be.true;

    // Verify treasury received fee
    const treasuryBal = await payout.balanceOf(treasury.address);
    expect(treasuryBal).to.equal(ethers.parseEther("100"));

    // Partners can claim
    const founderBalBefore = await payout.balanceOf(founder.address);
    await vault.connect(founder).claim(periodId);
    const founderBalAfter = await payout.balanceOf(founder.address);
    expect(founderBalAfter - founderBalBefore).to.equal(ethers.parseEther("3430")); // 70% of 4900

    const partnerABalBefore = await payout.balanceOf(partnerA.address);
    await vault.connect(partnerA).claim(periodId);
    const partnerABalAfter = await payout.balanceOf(partnerA.address);
    expect(partnerABalAfter - partnerABalBefore).to.equal(ethers.parseEther("1470")); // 30% of 4900
  });

  it("ownerStartDistribution is idempotent (second call fails)", async () => {
    const [owner, treasury, founder] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const payout = await MockToken.deploy();
    await payout.waitForDeployment();
    await payout.mint(owner.address, ethers.parseEther("1000"));

    const capital = await MockToken.deploy();
    await capital.waitForDeployment();

    const Factory = await ethers.getContractFactory("ProjectFactory");
    const factory = await Factory.deploy(
      treasury.address,
      200,
      await payout.getAddress(),
      await capital.getAddress()
    );
    await factory.waitForDeployment();

    const tx = await factory.createProject("idempotent-test", founder.address);
    const receipt = await tx.wait();
    let contracts: any = null;
    for (const log of receipt!.logs) {
      try {
        const parsed = factory.interface.parseLog({ topics: log.topics, data: log.data });
        if (parsed && parsed.name === "ProjectCreated") {
          contracts = {
            profitVault: (parsed.args[2] as any).profitVault as string,
          };
          break;
        }
      } catch {
        // skip
      }
    }
    if (!contracts) throw new Error("ProjectCreated event not found");

    const vault = await ethers.getContractAt("ProfitVault", contracts.profitVault);

    await payout.connect(owner).approve(await vault.getAddress(), ethers.parseEther("1000"));
    await vault.connect(owner).deposit(ethers.parseEther("1000"));

    const periodId = ethers.encodeBytes32String("TEST-PERIOD");

    // First call succeeds
    await expect(vault.connect(owner).ownerStartDistribution(periodId))
      .to.emit(vault, "DistributionStarted");

    // Second call fails with "Already started"
    await expect(vault.connect(owner).ownerStartDistribution(periodId))
      .to.be.revertedWith("Already started");
  });
});

