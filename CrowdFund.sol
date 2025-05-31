// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CrowdFund {
    address public owner;
    uint256 public goal;
    uint256 public deadline;
    uint256 public amountRaised;
    uint256 public contributorCount;
    uint256 public constant MINIMUM_CONTRIBUTION = 0.01 ether;
    bool public goalReached;
    bool public fundingClosed;

    mapping(address => uint256) public contributions;
    address[] public contributors;

    event FundReceived(address indexed contributor, uint256 amount, uint256 timestamp);
    event GoalReached(uint256 totalAmount, uint256 timestamp);
    event Refunded(address indexed contributor, uint256 amount, uint256 timestamp);
    event FundsWithdrawn(address indexed owner, uint256 amount, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline has passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline has not passed yet");
        _;
    }

    modifier goalNotReached() {
        require(!goalReached, "Goal has already been reached");
        _;
    }

    modifier validContribution() {
        require(msg.value >= MINIMUM_CONTRIBUTION, "Contribution must be at least 0.01 ETH");
        _;
    }

    constructor(uint256 _goal, uint256 _durationInMinutes) {
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInMinutes > 0, "Duration must be greater than 0");

        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
        amountRaised = 0;
        contributorCount = 0;
        goalReached = false;
        fundingClosed = false;
    }

    function contribute() external payable beforeDeadline validContribution {
        require(!fundingClosed, "Funding is closed");

        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
            contributorCount++;
        }

        contributions[msg.sender] += msg.value;
        amountRaised += msg.value;

        if (amountRaised >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(amountRaised, block.timestamp);
        }

        emit FundReceived(msg.sender, msg.value, block.timestamp);
    }

    function checkBalance() external view returns (uint256) {
        return amountRaised;
    }

    function withdraw() external onlyOwner {
        require(goalReached, "Goal not reached");
        require(amountRaised > 0, "No funds to withdraw");

        uint256 amount = amountRaised;
        amountRaised = 0;
        fundingClosed = true;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(owner, amount, block.timestamp);
    }

    function refund() external afterDeadline goalNotReached {
        require(contributions[msg.sender] > 0, "No contribution found");

        uint256 contributionAmount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        amountRaised -= contributionAmount;

        (bool success, ) = payable(msg.sender).call{value: contributionAmount}("");
        require(success, "Refund transfer failed");

        emit Refunded(msg.sender, contributionAmount, block.timestamp);
    }

    function getDetails()
        external
        view
        returns (
            uint256 _goal,
            uint256 _deadline,
            uint256 _amountRaised,
            uint256 _contributorCount,
            bool _goalReached,
            uint256 _timeLeft
        )
    {
        _timeLeft = block.timestamp < deadline ? deadline - block.timestamp : 0;

        return (
            goal,
            deadline,
            amountRaised,
            contributorCount,
            goalReached,
            _timeLeft
        );
    }

    function getContribution(address contributor) external view returns (uint256) {
        return contributions[contributor];
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function isOwner() external view returns (bool) {
        return msg.sender == owner;
    }

    function getContributors() external view returns (address[] memory) {
        return contributors;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}