// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CapitalVault
 * @dev Receives purpose-bound capital deposits from investors. Governance + Oracle mark deposits.
 */
contract CapitalVault is Ownable {
    struct DepositRecord {
        address contributor;
        uint256 amount;
        bool confirmed;
        string metadataURI; // optional: off-chain purpose docs
    }

    IERC20 public immutable capitalToken;
    address public governanceModule;

    mapping(bytes32 => DepositRecord) public deposits;

    event DepositInitiated(bytes32 indexed depositId, address indexed contributor, uint256 amount);
    event DepositConfirmed(bytes32 indexed depositId, address oracle, string proofRef);

    constructor(address _capitalToken, address _governance) Ownable(msg.sender) {
        require(_capitalToken != address(0), "Invalid token");
        capitalToken = IERC20(_capitalToken);
        governanceModule = _governance;
    }

    modifier onlyGovernance() {
        require(msg.sender == governanceModule || msg.sender == owner(), "Not authorized");
        _;
    }

    function setGovernance(address gov) external onlyOwner {
        governanceModule = gov;
    }

    /**
     * @notice Capital partner deposits funds into escrow.
     */
    function depositCapital(
        bytes32 depositId,
        uint256 amount,
        string calldata metadataURI
    ) external {
        require(deposits[depositId].contributor == address(0), "Deposit exists");
        require(amount > 0, "Amount = 0");
        require(capitalToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        deposits[depositId] = DepositRecord({
            contributor: msg.sender,
            amount: amount,
            confirmed: false,
            metadataURI: metadataURI
        });

        emit DepositInitiated(depositId, msg.sender, amount);
    }

    /**
     * @notice Oracle / governance confirms deposit for use. Off-chain proofs referenced via `proofRef`.
     */
    function confirmDeposit(bytes32 depositId, string calldata proofRef) external onlyGovernance {
        DepositRecord storage record = deposits[depositId];
        require(record.contributor != address(0), "Unknown deposit");
        require(!record.confirmed, "Already confirmed");
        record.confirmed = true;
        emit DepositConfirmed(depositId, msg.sender, proofRef);
    }

    /**
     * @notice Foundation can withdraw confirmed capital to spend on the defined purpose.
     */
    function withdrawConfirmedCapital(address recipient, uint256 amount) external onlyGovernance {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount = 0");
        require(capitalToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(capitalToken.transfer(recipient, amount), "Transfer failed");
    }
}

