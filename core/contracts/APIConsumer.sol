pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "./libraries/Shared.sol";

contract APIConsumer is ChainlinkClient {
  
    address public successfulApplicant;
    
    address private oracle;
    bytes32 private getApplicantJobId;
    bytes32 private postScholarshipJobId;
    uint256 private fee;

    event ScholarshipCreationSuccess(string message);
    event ExamsIncomplete();
    event SuccessfulApplicant(address applicantAddress);
    
    /**
     * Network: Kovan
     * Oracle: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
     * Job ID: 29fa9aa13bf1468788b7cc4a500a45b8
     * Fee: 0.1 LINK
     */
    constructor() public {
        setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
        oracle = 0xC78b97167036a17e3Af73Fad48645a807e91e01c;
        getApplicantJobId = stringToBytes32('5aed4f93263441499a1f7f38f422960d');
        postScholarshipJobId = stringToBytes32('b09f641b286141398324b26c73ff454c');
        fee = 1000000000000000000;
    }

    function requestPostScholarship(string memory _scholarshipId, string memory _scholarshipName) public returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(postScholarshipJobId, address(this), this.requestPostScholarshipCallback.selector);
        
        request.add("action", "createScholarship");
        request.add("scholarshipId", _scholarshipId);
        request.add("scholarshipName", _scholarshipName);
        
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function requestPostScholarshipCallback(bytes32 _requestId, bytes32 _scholarshipId) public recordChainlinkFulfillment(_requestId)
    {
        emit ScholarshipCreationSuccess("Success");
    }

    
    function requestExamRecordData(string memory _scholarshipId) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(getApplicantJobId, address(this), this.requestExamRecordDataCallback.selector);
        
        request.add("action", "getScholar");
        request.add("scholarshipId", _scholarshipId);
        
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    function requestExamRecordDataCallback(bytes32 _requestId, bytes32 _successfulApplicant) public recordChainlinkFulfillment(_requestId)
    {
        string memory inputToString = bytes32ToString(_successfulApplicant);
        bool examsComplete = !hashCompareWithLengthCheck(inputToString, '-');
        if (examsComplete) {
        successfulApplicant = address(uint160(uint256(_successfulApplicant)));
        emit SuccessfulApplicant(successfulApplicant);
        } else if (!examsComplete) {
            emit ExamsIncomplete();
        }
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
    
    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
    
    function hashCompareWithLengthCheck(string memory a, string memory b) public pure returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }
    }
}
