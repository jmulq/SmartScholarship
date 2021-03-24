pragma solidity >=0.4.22 <0.9.0;

struct Exam {
    string name;
    uint256 totalMarks;
    uint256 passMarks;
}

contract ScholarshipFactory {
    event NewScholarship(uint256 scholarshipId, string name);

    Scholarship[] public scholarships;
    uint256 public scholarshipCount = 0;

    function createScholarship(
        string memory name,
        uint256 maxApplicants,
        uint256 fundingGoal,
        Exam[] memory exams
    ) public {
        Scholarship scholarship =
            new Scholarship(
                msg.sender,
                name,
                maxApplicants,
                fundingGoal,
                exams
            );
        scholarships.push(scholarship);
        scholarshipCount += 1;
        emit NewScholarship(scholarshipCount, name);
    }

    function getScholarships() public view returns (Scholarship[] memory) {
        return scholarships;
    }
}

contract Scholarship {
    string public name;
    uint256 public maxApplicants;
    uint256 public fundingGoal;
    uint256 public currentFunding;
    uint256 public numFunders;
    address[] funders;
    address[] applicants;
    address creator;

    mapping(uint256 => Exam) public exams;
    Exam[] public examList;

    constructor(
        address _creator,
        string memory _name,
        uint256 _maxApplicants,
        uint256 _fundingGoal,
        Exam[] memory _exams
    ) public {
        name = _name;
        creator = _creator;
        maxApplicants = _maxApplicants;
        fundingGoal = _fundingGoal;

        createExams(_exams);
    }

    function createExams(Exam[] memory _exams) internal {
        for (uint256 index = 0; index < exams.length; index++) {
            Exam memory exam =
                Exam({
                    name: _exams[index].name,
                    totalMarks: _exams[index].totalMarks,
                    passMarks: _exams[index].passMarks
                });
            exams.push(exam);
        }
    }

    function getExams() public view returns (Exam[] memory) {
        return exams;
    }
}
