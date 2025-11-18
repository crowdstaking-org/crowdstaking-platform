// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPartnerRegister {
    function getShareBps(address account) external view returns (uint256);
}

/**
 * @title ProfitVault
 * @dev Holds project earnings (ERC20) and manages distribution cycles with automatic 2% fee forwarding.
 */
contract ProfitVault is Ownable {
    struct DistributionPeriod {
        uint256 totalAmount;
        uint256 feeAmount;
        bool claimable;
    }

    IERC20 public immutable payoutToken;
    address public immutable treasury;
    uint16 public immutable feeBps;
    address public governanceModule;
    IPartnerRegister public partnerRegister;

    // periodId => info
    mapping(bytes32 => DistributionPeriod) public periods;
    // periodId => account => claimed
    mapping(bytes32 => mapping(address => bool)) public hasClaimed;

    event Deposit(address indexed from, uint256 amount);
    event DistributionStarted(bytes32 indexed periodId, uint256 amount, uint256 fee);
    event Claimed(bytes32 indexed periodId, address indexed account, uint256 amount);

    constructor(
        address _payoutToken,
        address _treasury,
        uint16 _feeBps,
        address _governance,
        address _partnerRegister
    ) Ownable(msg.sender) {
        require(_payoutToken != address(0) && _treasury != address(0), "Invalid address");
        require(_feeBps <= 1000, "Fee too high"); // max 10%
        payoutToken = IERC20(_payoutToken);
        treasury = _treasury;
        feeBps = _feeBps;
        governanceModule = _governance;
        partnerRegister = IPartnerRegister(_partnerRegister);
    }

    modifier onlyGovernance() {
        require(msg.sender == governanceModule, "Not governance");
        _;
    }

    function setGovernance(address _gov) external onlyOwner {
        require(_gov != address(0), "Invalid governance");
        governanceModule = _gov;
    }

    function setPartnerRegister(address _register) external onlyOwner {
        partnerRegister = IPartnerRegister(_register);
    }

    /**
     * @notice Deposit earnings (pull pattern)
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount = 0");
        require(payoutToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Deposit(msg.sender, amount);
    }

    /**
     * @notice Starts a distribution period and forwards the 2% fee.
     */
    function startDistribution(bytes32 periodId) external onlyGovernance {
        DistributionPeriod storage period = periods[periodId];
        require(period.totalAmount == 0, "Already started");
        uint256 balance = payoutToken.balanceOf(address(this));
        require(balance > 0, "No funds");
        uint256 fee = (balance * feeBps) / 10_000;
        if (fee > 0) {
            require(payoutToken.transfer(treasury, fee), "Fee transfer failed");
        }
        period.totalAmount = balance - fee;
        period.feeAmount = fee;
        period.claimable = true;
        emit DistributionStarted(periodId, period.totalAmount, fee);
    }

    /**
     * @notice Emergency/ops path: Owner may start distribution directly.
     * This mirrors startDistribution logic for operational control.
     */
    function ownerStartDistribution(bytes32 periodId) external onlyOwner {
        DistributionPeriod storage period = periods[periodId];
        require(period.totalAmount == 0, "Already started");
        uint256 balance = payoutToken.balanceOf(address(this));
        require(balance > 0, "No funds");
        uint256 fee = (balance * feeBps) / 10_000;
        if (fee > 0) {
            require(payoutToken.transfer(treasury, fee), "Fee transfer failed");
        }
        period.totalAmount = balance - fee;
        period.feeAmount = fee;
        period.claimable = true;
        emit DistributionStarted(periodId, period.totalAmount, fee);
    }

    /**
     * @notice Partners call this to receive their share for the current period.
     */
    function claim(bytes32 periodId) external {
        DistributionPeriod storage period = periods[periodId];
        require(period.claimable, "Not claimable");
        require(!hasClaimed[periodId][msg.sender], "Already claimed");
        uint256 shareBps = partnerRegister.getShareBps(msg.sender);
        require(shareBps > 0, "No share");
        uint256 amount = (period.totalAmount * shareBps) / 10_000;
        require(amount > 0, "Zero payout");
        hasClaimed[periodId][msg.sender] = true;
        require(payoutToken.transfer(msg.sender, amount), "Transfer failed");
        emit Claimed(periodId, msg.sender, amount);
    }
}

