pragma solidity >=0.4.22 <0.9.0;

contract ScholarshipFactory {
    event NewScholarship(uint256 scholarshipId, string name);

    Scholarship[] public scholarships;
    uint256 public scholarshipCount = 0;

    function createScholarship(
        string memory name,
        uint256 maxApplicants,
        uint256 fundingGoal
    ) public {
        Scholarship scholarship =
            new Scholarship(name, msg.sender, maxApplicants, fundingGoal);
        scholarships.push(scholarship);
        scholarshipCount += 1;
        emit NewScholarship(scholarshipCount, name);
    }

    function getScholarships() public view returns (Scholarship[] memory) {
        return scholarships;
    }
}

contract Scholarship {
    string name;
    uint256 maxApplicants;
    uint256 fundingGoal;
    uint256 currentFunding;
    uint256 numFunders;
    address[] funders;
    address[] applicants;
    address creator;

    constructor(
        string memory _name,
        address _creator,
        uint256 _maxApplicants,
        uint256 _fundingGoal
    ) public {
        name = _name;
        creator = _creator;
        maxApplicants = _maxApplicants;
        fundingGoal = _fundingGoal;
    }
}
