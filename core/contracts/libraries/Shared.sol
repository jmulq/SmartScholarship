pragma solidity ^0.6.6;

library Shared {
    struct ScholarshipConfig {
        string scholarshipId;
        string name;
        string description;
        string targetStudentGroup;
        string socialImpactOKR;
        uint maxApplicants;
        uint fundingGoal;
    }
    struct ExamConfig {
        string name;
        uint256 totalMarks;
        uint256 passMarks;
    }
}
