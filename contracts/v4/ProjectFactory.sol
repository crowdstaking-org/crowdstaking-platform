// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./PartnerRegister.sol";
import "./GovernanceModule.sol";
import "./ProfitVault.sol";
import "./CapitalVault.sol";

/**
 * @title ProjectFactory
 * @dev Deploys per-project contract suites and tracks their addresses.
 */
contract ProjectFactory is Ownable {
    struct ProjectContracts {
        address partnerRegister;
        address governanceModule;
        address profitVault;
        address capitalVault;
    }

    mapping(bytes32 => ProjectContracts) public projects;
    address public immutable treasury;
    uint16 public immutable feeBps;
    address public payoutToken;
    address public capitalToken;

    event ProjectCreated(
        bytes32 indexed projectId,
        address indexed founder,
        address partnerRegister,
        address governanceModule,
        address profitVault,
        address capitalVault
    );

    constructor(
        address _treasury,
        uint16 _feeBps,
        address _payoutToken,
        address _capitalToken
    ) Ownable(msg.sender) {
        require(_treasury != address(0));
        require(_feeBps <= 1000);
        treasury = _treasury;
        feeBps = _feeBps;
        payoutToken = _payoutToken;
        capitalToken = _capitalToken;
    }

    function setTokens(address _payoutToken, address _capitalToken) external onlyOwner {
        payoutToken = _payoutToken;
        capitalToken = _capitalToken;
    }

    function createProject(
        string calldata slug,
        address founder
    ) external onlyOwner returns (bytes32) {
        require(founder != address(0));
        bytes32 projectId = keccak256(abi.encodePacked(blockhash(block.number - 1), slug, founder));
        require(projects[projectId].partnerRegister == address(0));

        address reg;
        address gov;
        address profit;
        address capital;
        address ownerAddr = owner();

        PartnerRegister register = new PartnerRegister(
            projectId,
            string.concat("Partner ", slug),
            string.concat("SBT-", slug),
            founder
        );
        reg = address(register);
        
        GovernanceModule governance = new GovernanceModule(reg);
        gov = address(governance);
        register.setController(gov);
        register.transferOwnership(ownerAddr);

        ProfitVault profitVault = new ProfitVault(
            payoutToken,
            treasury,
            feeBps,
            gov,
            reg
        );
        profit = address(profitVault);
        profitVault.transferOwnership(ownerAddr);

        CapitalVault capitalVault = new CapitalVault(capitalToken, gov);
        capital = address(capitalVault);
        capitalVault.transferOwnership(ownerAddr);

        projects[projectId] = ProjectContracts({
            partnerRegister: reg,
            governanceModule: gov,
            profitVault: profit,
            capitalVault: capital
        });

        emit ProjectCreated(projectId, founder, reg, gov, profit, capital);
        return projectId;
    }
}

