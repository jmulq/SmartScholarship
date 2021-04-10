require("@nomiclabs/hardhat-web3")
let { networkConfig, getNetworkId } = require('../../helper-hardhat-config')

task("create-scholarship", "Calls the createScholarship function in the ScholarshipFactory contract")
    .addParam("contract", "The address of the ScholarshipFactory contract that you want to call")
    // .addParam("nodeid", "The address of the chainlink node")
    .setAction(async taskArgs => {

        const contractAddr = taskArgs.contract
        let networkId = await getNetworkId(network.name)
        console.log("Calling ScholarshipFactory contract ", contractAddr, " on network ", network.name)
        const ScholarshipFactory = await ethers.getContractFactory("ScholarshipFactory")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to API Consumer Contract and call the createRequestTo function
        const factoryContract = new ethers.Contract(contractAddr, ScholarshipFactory.interface, signer)

        const scholarshipConfigParam = {
            scholarshipId: 'EMP2072',
            name: 'Empower Scholarship Scheme - 2021',
            description: 'Scholarship to encourage completion of lower secondary education  of female students in sub-Saharan Africa',
            targetStudentGroup: 'Female students in Ethopia',
            socialImpactOKR: 'Improve lower secondary education completion rate of female students by atleast 10%',
            maxApplicants: 10,
            fundingGoal: ethers.BigNumber.from(10).pow(18), // 10 ETH
        };
        
        const examConfigsParam = [
            {
                name: 'English',
                totalMarks: 100,
                passMarks: 50,
            },
            {
                name: 'Maths',
                totalMarks: 100,
                passMarks: 50,
            },
            {
                name: 'Science',
                totalMarks: 100,
                passMarks: 50,
            }
        ]; 

        var result = await factoryContract.createScholarship(
            scholarshipConfigParam,
            examConfigsParam
        ).then(function (transaction) {
            console.log('Contract ', contractAddr, ' createScholarship function successfully called. Transaction Hash: ', transaction.hash)
            console.log('To get scholarships run getScholarships contract function with command:')
            console.log('npx hardhat get-scholarships --contract ' + contractAddr + ' --network kovan')
            console.log('____________________________________________________________')
            console.log('To fund a scholarship run the fundScholarship function for that deployed scholarship with command:')
            console.log('npx hardhat fund-scholarship --contract <DEPLOYED-CONTRACT> --network kovan --amount <FUNDING-IN-WEI>');
        })
    })
module.exports = {}
