require("@nomiclabs/hardhat-web3")
let { networkConfig, getNetworkId } = require('../../helper-hardhat-config')

task("get-scholarships", "Calls the getScholarships function in the ScholarshipFactory contract")
    .addParam("contract", "The address of the ScholarshipFactory contract that you want to call")
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
        var result = await factoryContract.getScholarships()
        console.log('Data is: ', result)
    })
module.exports = {}
