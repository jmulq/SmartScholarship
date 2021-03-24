pragma solidity >=0.4.22 <0.9.0;

struct ExamConfig {
    string name;
    uint256 totalMarks;
    uint256 passMarks;
}

struct Exam {
    uint256 id;
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
        ExamConfig[] memory examConfigs
    ) public {
        Scholarship scholarship =
            new Scholarship(
                msg.sender,
                name,
                maxApplicants,
                fundingGoal,
                examConfigs
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
        ExamConfig[] memory _examsConfigs
    ) public {
        name = _name;
        creator = _creator;
        maxApplicants = _maxApplicants;
        fundingGoal = _fundingGoal;

        createExams(_examsConfigs);
    }

    function createExams(ExamConfig[] memory _examConfigs) internal {
        for (uint256 index = 0; index < _examConfigs.length; index++) {
            uint256 examId = examList.length + 1;
            Exam memory exam =
                Exam({
                    id: examId,
                    name: _examConfigs[index].name,
                    totalMarks: _examConfigs[index].totalMarks,
                    passMarks: _examConfigs[index].passMarks
                });
            exams[examId].id = examId;
            exams[examId].name = _examConfigs[index].name;
            exams[examId].totalMarks = _examConfigs[index].totalMarks;
            exams[examId].passMarks = _examConfigs[index].passMarks;
            examList.push(exam);
        }
    }

    function getExamCount() public view returns (uint256 examCount) {
        return examList.length;
    }
}
