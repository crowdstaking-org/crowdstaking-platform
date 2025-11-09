// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title VestingContract
 * @notice Manages token escrow for CrowdStaking agreements
 * @dev Implements a double-confirmation mechanism: pioneer confirms work, foundation releases tokens
 */
contract VestingContract {
    /// @notice Structure representing a vesting agreement
    struct Agreement {
        address contributor;        // Pioneer's wallet address
        uint256 amount;            // Amount of tokens locked in escrow
        bool pioneerConfirmed;     // Whether pioneer confirmed work completion
        bool foundationConfirmed;  // Whether foundation verified and released tokens
        bool exists;               // Whether this agreement exists
    }
    
    /// @notice Mapping from proposal ID to agreement details
    mapping(uint256 => Agreement) public agreements;
    
    /// @notice The $CSTAKE token contract
    IERC20 public immutable cstakeToken;
    
    /// @notice The foundation wallet that can create and release agreements
    address public foundationWallet;
    
    /// @notice Emitted when a new agreement is created and tokens are locked
    event AgreementCreated(
        uint256 indexed proposalId, 
        address indexed contributor, 
        uint256 amount
    );
    
    /// @notice Emitted when pioneer confirms work completion
    event PioneerConfirmed(uint256 indexed proposalId);
    
    /// @notice Emitted when tokens are released to contributor
    event AgreementReleased(
        uint256 indexed proposalId, 
        address indexed contributor, 
        uint256 amount
    );
    
    /// @notice Emitted when foundation wallet is updated
    event FoundationWalletUpdated(address indexed oldWallet, address indexed newWallet);
    
    /**
     * @notice Contract constructor
     * @param _cstakeToken Address of the $CSTAKE ERC20 token
     * @param _foundationWallet Address of the foundation wallet
     */
    constructor(address _cstakeToken, address _foundationWallet) {
        require(_cstakeToken != address(0), "Invalid token address");
        require(_foundationWallet != address(0), "Invalid foundation wallet");
        
        cstakeToken = IERC20(_cstakeToken);
        foundationWallet = _foundationWallet;
    }
    
    /// @notice Restricts function access to foundation wallet only
    modifier onlyFoundation() {
        require(msg.sender == foundationWallet, "Not foundation");
        _;
    }
    
    /**
     * @notice Creates a new vesting agreement and locks tokens in escrow
     * @param _proposalId Unique identifier for the proposal
     * @param _contributor Address of the pioneer who will receive tokens
     * @param _amount Amount of tokens to lock in escrow
     * @dev Foundation must have approved this contract to spend tokens before calling
     */
    function createAgreement(
        uint256 _proposalId, 
        address _contributor, 
        uint256 _amount
    ) 
        external 
        onlyFoundation 
    {
        require(!agreements[_proposalId].exists, "Agreement already exists");
        require(_contributor != address(0), "Invalid contributor address");
        require(_amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from foundation to this contract
        require(
            cstakeToken.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );
        
        // Create agreement
        agreements[_proposalId] = Agreement({
            contributor: _contributor,
            amount: _amount,
            pioneerConfirmed: false,
            foundationConfirmed: false,
            exists: true
        });
        
        emit AgreementCreated(_proposalId, _contributor, _amount);
    }
    
    /**
     * @notice Allows pioneer to confirm work completion
     * @param _proposalId The proposal ID to confirm
     * @dev Can only be called by the contributor assigned to this agreement
     */
    function confirmWorkDone(uint256 _proposalId) external {
        Agreement storage agreement = agreements[_proposalId];
        
        require(agreement.exists, "Agreement does not exist");
        require(msg.sender == agreement.contributor, "Not the contributor");
        require(!agreement.pioneerConfirmed, "Already confirmed by pioneer");
        require(!agreement.foundationConfirmed, "Agreement already released");
        
        agreement.pioneerConfirmed = true;
        emit PioneerConfirmed(_proposalId);
    }
    
    /**
     * @notice Releases tokens to contributor after foundation verification
     * @param _proposalId The proposal ID to release tokens for
     * @dev Requires pioneer to have confirmed work first
     */
    function releaseAgreement(uint256 _proposalId) external onlyFoundation {
        Agreement storage agreement = agreements[_proposalId];
        
        require(agreement.exists, "Agreement does not exist");
        require(agreement.pioneerConfirmed, "Pioneer has not confirmed work");
        require(!agreement.foundationConfirmed, "Agreement already released");
        
        agreement.foundationConfirmed = true;
        uint256 amount = agreement.amount;
        address contributor = agreement.contributor;
        
        // Transfer tokens to contributor
        require(
            cstakeToken.transfer(contributor, amount),
            "Token transfer failed"
        );
        
        emit AgreementReleased(_proposalId, contributor, amount);
        
        // Clean up storage to save gas
        delete agreements[_proposalId];
    }
    
    /**
     * @notice Returns agreement details for a given proposal ID
     * @param _proposalId The proposal ID to query
     * @return Agreement struct with all details
     */
    function getAgreement(uint256 _proposalId) 
        external 
        view 
        returns (Agreement memory) 
    {
        return agreements[_proposalId];
    }
    
    /**
     * @notice Updates the foundation wallet address
     * @param _newFoundationWallet The new foundation wallet address
     * @dev Can only be called by current foundation wallet
     */
    function updateFoundationWallet(address _newFoundationWallet) 
        external 
        onlyFoundation 
    {
        require(_newFoundationWallet != address(0), "Invalid address");
        
        address oldWallet = foundationWallet;
        foundationWallet = _newFoundationWallet;
        
        emit FoundationWalletUpdated(oldWallet, _newFoundationWallet);
    }
    
    /**
     * @notice Emergency function to cancel an agreement before pioneer confirms
     * @param _proposalId The proposal ID to cancel
     * @dev Can only cancel if pioneer hasn't confirmed yet. Returns tokens to foundation.
     */
    function cancelAgreement(uint256 _proposalId) external onlyFoundation {
        Agreement storage agreement = agreements[_proposalId];
        
        require(agreement.exists, "Agreement does not exist");
        require(!agreement.pioneerConfirmed, "Cannot cancel after pioneer confirmation");
        require(!agreement.foundationConfirmed, "Agreement already released");
        
        uint256 amount = agreement.amount;
        
        // Return tokens to foundation
        require(
            cstakeToken.transfer(foundationWallet, amount),
            "Token transfer failed"
        );
        
        delete agreements[_proposalId];
    }
}

