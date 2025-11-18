// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IPartnerRegisterGov {
    function getShareBps(address account) external view returns (uint256);
    function addPartner(address account, uint256 shareBps) external;
    function reducePartnerShare(address account, uint256 shareBps) external;
    function revokePartner(address account) external;
}

/**
 * @title GovernanceModule
 * @dev Lightweight on-chain voting module. Off-chain services listen to events to trigger complex actions.
 */
contract GovernanceModule is Ownable {
    enum ProposalType {
        WORK,
        BOUNTY,
        CAPITAL,
        PAYOUT,
        REVOKE
    }

    struct Proposal {
        ProposalType proposalType;
        address proposer;
        bytes data;
        uint64 deadline;
        bool executed;
        uint256 forVotes;
        uint256 againstVotes;
    }

    IPartnerRegisterGov public partnerRegister;
    uint64 public votingPeriod = 3 days;
    uint16 public quorumBps = 5000; // 50%
    uint16 public capitalThresholdBps = 6600; // 66%

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, ProposalType indexed proposalType, address proposer);
    event VoteCast(uint256 indexed id, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id);

    constructor(address _partnerRegister) Ownable(msg.sender) {
        partnerRegister = IPartnerRegisterGov(_partnerRegister);
    }

    function setPartnerRegister(address register) external onlyOwner {
        partnerRegister = IPartnerRegisterGov(register);
    }

    function setVotingParams(uint64 _period, uint16 _quorum, uint16 _capitalThreshold) external onlyOwner {
        require(_period >= 1 days, "Period too short");
        require(_quorum <= 10_000, "Invalid quorum");
        votingPeriod = _period;
        quorumBps = _quorum;
        capitalThresholdBps = _capitalThreshold;
    }

    function proposalCount() external view returns (uint256) {
        return proposals.length;
    }

    function createProposal(ProposalType proposalType, bytes calldata data) external returns (uint256) {
        uint256 votingPower = partnerRegister.getShareBps(msg.sender);
        require(votingPower > 0, "Not partner");
        Proposal memory proposal = Proposal({
            proposalType: proposalType,
            proposer: msg.sender,
            data: data,
            deadline: uint64(block.timestamp + votingPeriod),
            executed: false,
            forVotes: 0,
            againstVotes: 0
        });
        proposals.push(proposal);
        uint256 id = proposals.length - 1;
        emit ProposalCreated(id, proposalType, msg.sender);
        return id;
    }

    function castVote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.deadline, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        uint256 votingPower = partnerRegister.getShareBps(msg.sender);
        require(votingPower > 0, "No voting power");
        hasVoted[proposalId][msg.sender] = true;
        if (support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }
        emit VoteCast(proposalId, msg.sender, support, votingPower);
    }

    function execute(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.deadline, "Voting active");
        require(!proposal.executed, "Executed");
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        require(totalVotes >= quorumBps, "Quorum not met");

        if (proposal.proposalType == ProposalType.CAPITAL) {
            require(proposal.forVotes * 10_000 >= capitalThresholdBps * totalVotes, "Capital threshold not met");
        } else {
            require(proposal.forVotes > proposal.againstVotes, "Not approved");
        }

        proposal.executed = true;
        emit ProposalExecuted(proposalId);
        // Off-chain automation listens to this event and triggers register/vault actions depending on proposal type.
    }
}

