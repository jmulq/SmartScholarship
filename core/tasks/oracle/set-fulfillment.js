require("@nomiclabs/hardhat-web3")
let { networkConfig, getNetworkId } = require('../../helper-hardhat-config')

task("set-fulfillment", "Calls an Oracle contract to set the fulfillment permissions of that oracle")
    .addParam("contract", "The address of the Oracle contract that you want to call")
    .addParam("nodeid", "The address of the chainlink node")
    .setAction(async taskArgs => {

        const contractAddr = taskArgs.contract
        let networkId = await getNetworkId(network.name)
        console.log("Calling Oracle contract ", contractAddr, " on network ", network.name)
        const Oracle = await ethers.getContractFactory("Oracle")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to API Consumer Contract and call the createRequestTo function
        const oracleContract = new ethers.Contract(contractAddr, Oracle.interface, signer)
        var result = await oracleContract.setFulfillmentPermission(taskArgs.nodeid, true).then(function (transaction) {
            console.log('Contract ', contractAddr, ' setFulfillmentPermission successfully called. Transaction Hash: ', transaction.hash)
        })
    })
module.exports = {}
