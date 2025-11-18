// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CrowdStakingTreasury
 * @dev Aggregates the 2% fees from project profit vaults and lets the platform
 *      foundation redistribute capital to $CROWDSTAKING-SBT holders (handled off-chain).
 */
contract CrowdStakingTreasury is Ownable {
    event FeeReceived(address indexed token, address indexed from, uint256 amount);
    event DistributionExecuted(address indexed token, address indexed recipient, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Records a fee payment. Token must be approved for transfer beforehand.
     */
    function recordFee(address token, uint256 amount) external {
        require(token != address(0), "Invalid token");
        require(amount > 0, "Amount = 0");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit FeeReceived(token, msg.sender, amount);
    }

    /**
     * @notice Distributes funds to a recipient (e.g. platform SBT vault).
     * @dev Only callable by owner (CrowdStaking foundation multisig).
     */
    function distribute(
        address token,
        address recipient,
        uint256 amount
    ) external onlyOwner {
        require(token != address(0) && recipient != address(0), "Invalid address");
        require(amount > 0, "Amount = 0");
        require(IERC20(token).transfer(recipient, amount), "Transfer failed");
        emit DistributionExecuted(token, recipient, amount);
    }
}

