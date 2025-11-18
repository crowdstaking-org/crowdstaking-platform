// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title PartnerRegister
 * @dev Tracks partner share percentages and mints non-transferable SBTs per project.
 */
contract PartnerRegister is ERC721, Ownable {
    struct PartnerInfo {
        uint256 shareBps;
        bool exists;
    }

    bytes32 public immutable projectId;
    address public controller; // governance module
    uint256 public totalShareBps;
    uint256 private _tokenIdTracker;

    mapping(address => PartnerInfo) public partners;
    mapping(address => uint256) public partnerTokenId;

    event ControllerUpdated(address indexed newController);
    event PartnerUpdated(address indexed account, uint256 shareBps);
    event PartnerRevoked(address indexed account);

    constructor(
        bytes32 _projectId,
        string memory projectName,
        string memory projectSymbol,
        address founder
    ) ERC721(projectName, projectSymbol) Ownable(msg.sender) {
        projectId = _projectId;
        if (founder != address(0)) {
            partners[founder] = PartnerInfo({shareBps: 10_000, exists: true});
            totalShareBps = 10_000;
            _mintSBT(founder);
            emit PartnerUpdated(founder, 10_000);
        }
    }

    modifier onlyController() {
        require(msg.sender == controller, "Not controller");
        _;
    }

    function setController(address _controller) external onlyOwner {
        require(_controller != address(0), "Invalid controller");
        controller = _controller;
        emit ControllerUpdated(_controller);
    }

    function getShareBps(address account) external view returns (uint256) {
        return partners[account].shareBps;
    }

    function addPartner(address account, uint256 shareBps) external onlyController {
        require(account != address(0), "Invalid account");
        require(shareBps > 0, "Share = 0");
        require(totalShareBps + shareBps <= 10_000, "Exceeds 100%");
        totalShareBps += shareBps;
        if (!partners[account].exists) {
            partners[account] = PartnerInfo({shareBps: shareBps, exists: true});
            _mintSBT(account);
        } else {
            partners[account].shareBps += shareBps;
        }
        emit PartnerUpdated(account, partners[account].shareBps);
    }

    function reducePartnerShare(address account, uint256 shareBps) external onlyController {
        PartnerInfo storage info = partners[account];
        require(info.exists, "Partner missing");
        require(shareBps > 0 && shareBps <= info.shareBps, "Invalid share");
        info.shareBps -= shareBps;
        totalShareBps -= shareBps;
        if (info.shareBps == 0) {
            _revokePartner(account);
        } else {
            emit PartnerUpdated(account, info.shareBps);
        }
    }

    function renouncePartnership() external {
        require(partners[msg.sender].shareBps > 0, "No share");
        uint256 share = partners[msg.sender].shareBps;
        partners[msg.sender].shareBps = 0;
        partners[msg.sender].exists = false;
        totalShareBps -= share;
        _burnPartner(msg.sender);
        emit PartnerRevoked(msg.sender);
    }

    function revokePartner(address account) external onlyController {
        _revokePartner(account);
    }

    function _revokePartner(address account) internal {
        PartnerInfo storage info = partners[account];
        require(info.exists, "Partner missing");
        uint256 share = info.shareBps;
        totalShareBps -= share;
        info.shareBps = 0;
        info.exists = false;
        _burnPartner(account);
        emit PartnerRevoked(account);
    }

    function _mintSBT(address to) internal {
        uint256 tokenId = ++_tokenIdTracker;
        partnerTokenId[to] = tokenId;
        _safeMint(to, tokenId);
    }

    function _burnPartner(address account) internal {
        uint256 tokenId = partnerTokenId[account];
        if (tokenId != 0 && _ownerOf(tokenId) != address(0)) {
            _burn(tokenId);
        }
        delete partnerTokenId[account];
    }

    // Soulbound: block transfers except mint/burn
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0) && from != to) {
            revert("SBT non-transferable");
        }
        return super._update(to, tokenId, auth);
    }
}

