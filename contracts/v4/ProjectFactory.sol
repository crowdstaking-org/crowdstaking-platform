// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

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
        ProjectContracts contractsDeployed
    );

    constructor(
        address _treasury,
        uint16 _feeBps,
        address _payoutToken,
        address _capitalToken
    ) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");
        require(_feeBps <= 1000, "Fee too high");
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
        require(founder != address(0), "Invalid founder");
        bytes32 projectId = keccak256(abi.encodePacked(blockhash(block.number - 1), slug, founder));
        require(projects[projectId].partnerRegister == address(0), "Project exists");

        PartnerRegister register = new PartnerRegister(
            projectId,
            string.concat("Partner ", slug),
            string.concat("SBT-", slug),
            founder
        );
        GovernanceModule governance = new GovernanceModule(address(register));
        register.setController(address(governance));
        register.transferOwnership(owner());

        ProfitVault profitVault = new ProfitVault(
            payoutToken,
            treasury,
            feeBps,
            address(governance),
            address(register)
        );
        profitVault.transferOwnership(owner());

        CapitalVault capitalVault = new CapitalVault(capitalToken, address(governance));
        capitalVault.transferOwnership(owner());

        projects[projectId] = ProjectContracts({
            partnerRegister: address(register),
            governanceModule: address(governance),
            profitVault: address(profitVault),
            capitalVault: address(capitalVault)
        });

        emit ProjectCreated(projectId, founder, projects[projectId]);
        return projectId;
    }
}

