pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "./APIConsumer.sol";
import "./libraries/Shared.sol";

contract Scholarship is APIConsumer {
    address public admin;

    struct ScholarshipInfo {
        string scholarshipId;
        string name;
        string description;
        string targetStudentGroup;
        string socialImpactOKR;
    }

    ScholarshipInfo public info;

    uint public maxApplicants;
    uint public applicantCount = 0;
    mapping(address => bool) public applicants;
    bool public canAward = false;
    
    uint public fundingGoal;
    uint public numFunders = 0;
    uint public currentFunding = 0;
    bool public isFundingComplete = false;
    mapping(address => bool) public funders;

    struct Exam {
        uint256 id;
        string name;
        uint256 totalMarks;
        uint256 passMarks;
    }

    mapping(uint256 => Exam) public exams;
    uint256[] public examList;

    event ScholarshipFunded(address scholarshipAddress, string name);

    constructor(
        address _admin,
        Shared.ScholarshipConfig memory _scholarshipConfig,
        Shared.ExamConfig[] memory _examConfigs
    ) APIConsumer() public {
        // Todo refactor into seperate func
        admin = _admin;
        info.scholarshipId = _scholarshipConfig.scholarshipId;
        info.name = _scholarshipConfig.name;
        info.description = _scholarshipConfig.description;
        info.targetStudentGroup = _scholarshipConfig.targetStudentGroup;
        info.socialImpactOKR = _scholarshipConfig.socialImpactOKR;
        maxApplicants = _scholarshipConfig.maxApplicants;
        fundingGoal = _scholarshipConfig.fundingGoal;
        createExams(_examConfigs);
    }

    function createExams(Shared.ExamConfig[] memory _examConfigs) internal {
        for (uint256 index = 0; index < _examConfigs.length; index++) {
            uint256 examId = examList.length + 1;
            exams[examId].id = examId;
            exams[examId].name = _examConfigs[index].name;
            exams[examId].totalMarks = _examConfigs[index].totalMarks;
            exams[examId].passMarks = _examConfigs[index].passMarks;
            examList.push(examId);
        }
    }

    function fundScholarship(uint256 amount) payable public {
        require(msg.value == amount);
        require(amount <= (fundingGoal - currentFunding), 'Cannot fund more than remaining amount.');
        require(!isFundingComplete, 'Funding goal has already been reached.');

        currentFunding += amount;
        if (!isFunder(msg.sender)) {
            funders[msg.sender] = true;
            numFunders++;
        }
        if (currentFunding == fundingGoal) {
            isFundingComplete = true;
        }
        emit ScholarshipFunded(address(this), info.name);
    }

    function getCurrentFunding() public view returns (uint256) {
        return address(this).balance;
    }

    function isFunder(address funder) internal view returns (bool) {
        return funders[funder];
    }


    function applyForScholarship() public {
        require(!isApplicant(msg.sender), 'You have already applied for this Scholarship.');
        require(canTakeApplicant(), 'This Scholarship is taking no more applications.');

        applicants[msg.sender] = true;
        applicantCount++;
    }

    function isApplicant(address applicant) internal view returns (bool) {
        return applicants[applicant];
    }

    function canTakeApplicant() internal view returns (bool) {
        return applicantCount < maxApplicants;
    }

    function requestSuccessfulApplicant() public {
        requestExamRecordData(info.scholarshipId);
    }

    function readSuccessfulApplicant() public returns (address) {
        // Todo refactor this
        if (address(0) == successfulApplicant) {
            return successfulApplicant;
        }
        canAward = true;
        return successfulApplicant;
    }

    // todo make this only owner when working
    function awardScholarship() public {
        require(canAward, 'Successful applicant has not been confirmed yet');
        
        payable(successfulApplicant).transfer(address(this).balance);
    }
}
