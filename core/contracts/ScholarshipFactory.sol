pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "./libraries/Shared.sol";
import "./Scholarship.sol";

// Todo remove before submit
import "hardhat/console.sol";

contract ScholarshipFactory is APIConsumer() {
    Scholarship[] public scholarships;
    uint256 public scholarshipCount = 0;

    event NewScholarship(address scholarshipAddress, string name);

    function createScholarship(
        Shared.ScholarshipConfig memory scholarshipConfig,
        Shared.ExamConfig[] memory examConfigs
    ) public {
        Scholarship scholarship = new Scholarship(msg.sender, scholarshipConfig, examConfigs);
        scholarships.push(scholarship);
        scholarshipCount += 1;
        emit NewScholarship(address(scholarship), scholarshipConfig.name);

        // POST scholarship to external API
        requestPostScholarship(scholarshipConfig.scholarshipId, scholarshipConfig.name);
    }

    function getScholarships() public view returns (Scholarship[] memory) {
        return scholarships;
    }
}