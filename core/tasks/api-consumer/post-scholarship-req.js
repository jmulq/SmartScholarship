require("@nomiclabs/hardhat-web3")
let { networkConfig, getNetworkId } = require('../../helper-hardhat-config')

task("post-schol-req", "Calls an API Consumer Contract to post new scholarship to external API")
    .addParam("contract", "The address of the API Consumer contract that you want to call")
    .addParam("id", "The scholarship ID for the exam records that are required")
    .addParam("name", "The scholarship name for the exam records that are required")
    .setAction(async taskArgs => {

        const contractAddr = taskArgs.contract
        let networkId = await getNetworkId(network.name)
        console.log("Calling API Consumer contract ", contractAddr, " on network ", network.name)
        const APIConsumer = await ethers.getContractFactory("APIConsumer")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to API Consumer Contract and call the createRequestTo function
        const apiConsumerContract = new ethers.Contract(contractAddr, APIConsumer.interface, signer)
        var result = await apiConsumerContract.requestPostScholarship(taskArgs.id, taskArgs.name).then(function (transaction) {
            console.log('Contract ', contractAddr, ' external post request successfully called. Transaction Hash: ', transaction.hash)
        })
    })
module.exports = {}
