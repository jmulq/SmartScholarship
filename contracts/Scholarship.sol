pragma solidity >=0.4.22 <0.9.0;

struct ExamConfig {
    string name;
    uint256 totalMarks;
    uint256 passMarks;
}

contract ScholarshipFactory {
    Scholarship[] public scholarships;
    uint256 public scholarshipCount = 0;

    event NewScholarship(address scholarshipAddress, string name);


    function createScholarship(
        string memory name,
        uint256 maxApplicants,
        uint256 fundingGoal,
        ExamConfig[] memory examConfigs
    ) public {
        Scholarship scholarship = new Scholarship (
            msg.sender, name, maxApplicants, fundingGoal, examConfigs
        );
        scholarships.push(scholarship);
        scholarshipCount += 1;
        emit NewScholarship(address(scholarship), name);
    }

    function getScholarships() public view returns (Scholarship[] memory) {
        return scholarships;
    }
}

contract Scholarship {
    address creator;
    string public name;

    uint256 public maxApplicants;
    uint256 public applicantCount;
    mapping(address => Applicant) public applicants;

    uint256 public fundingGoal;
    uint256 public currentFunding;
    uint256 public numFunders;
    mapping(address => bool) public funders;
    bool public isFundingComplete;

    struct Exam {
    uint256 id;
    string name;
    uint256 totalMarks;
    uint256 passMarks;
    }

    struct ExamRecord {
        uint256 mark;
        bool isPass;
    }

    struct Applicant {
        mapping(uint256 => ExamRecord) examRecords;
        bool isApplicant;
    }    
    
    mapping(uint256 => Exam) public exams;
    uint256[] public examList;

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
            exams[examId].id = examId;
            exams[examId].name = _examConfigs[index].name;
            exams[examId].totalMarks = _examConfigs[index].totalMarks;
            exams[examId].passMarks = _examConfigs[index].passMarks;
            examList.push(examId);
        }
    }

    function getExamCount() public view returns (uint256 examCount) {
        return examList.length;
    }

    function fundScholarship() public payable {
        require(!isFundingComplete, "Funding goal has already been reached.");
        require(msg.value <= (fundingGoal - currentFunding), "Cannot fund more than remaining amount.");

        currentFunding += msg.value;
        if (!isFunder(msg.sender)) {
            funders[msg.sender] = true;
            numFunders++;
        }
        if (currentFunding == fundingGoal) {
            isFundingComplete = true;
        }
    }

    function isFunder(address funder) internal view returns (bool) {
        return funders[funder];
    }

    function submitApplicantsForScholarship(address[] memory _applicants) public {
        for (uint256 index = 0; index < _applicants.length; index++) {
            applyForScholarship(_applicants[index]);
        }
    }

    function applyForScholarship(address applicantAddress) public {
        require(!isApplicant(applicantAddress), "You have already applied for this Scholarship.");
        require(canTakeApplicant(), "This Scholarship is taking no more applications.");

        applicants[applicantAddress].isApplicant = true;
        for (uint256 index = 0; index < examList.length; index++) {
            ExamRecord memory examRecord = ExamRecord(0, false);
            applicants[applicantAddress].examRecords[examList[index]] = examRecord;
        }
        applicantCount++;
    }

    function isApplicant(address applicant) internal view returns (bool) {
        return applicants[applicant];
    }

    function canTakeApplicant() internal view returns (bool) {
        return applicantCount < maxApplicants;
    }
}
