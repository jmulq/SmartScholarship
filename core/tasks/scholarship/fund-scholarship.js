require("@nomiclabs/hardhat-web3")
let { networkConfig, getNetworkId } = require('../../helper-hardhat-config')

task("fund-scholarship", "Calls the fundScholarship function in the ScholarshipFactory contract")
    .addParam("contract", "The address of the ScholarshipFactory contract that you want to call")
    .addParam("amount", "The amount to fund the scholarship with")
    .setAction(async taskArgs => {

        const contractAddr = taskArgs.contract
        let networkId = await getNetworkId(network.name)
        console.log("Calling Scholarship contract ", contractAddr, " on network ", network.name)
        const Scholarship = await ethers.getContractFactory("Scholarship")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to API Consumer Contract and call the createRequestTo function
        const scholarshipContract = new ethers.Contract(contractAddr, Scholarship.interface, signer)
        var result = await scholarshipContract.fundScholarship().then(transaction => {
            console.log('Contract ', contractAddr, ' fundScholarship successfully called. Transaction Hash: ', transaction.hash)
        })
        console.log('Data is: ', result);
    })
module.exports = {}
