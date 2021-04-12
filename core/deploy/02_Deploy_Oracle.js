let { networkConfig } = require('../helper-hardhat-config')

require('dotenv').config()

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    
    let chainId = await getChainId()
    const linkTokenAddress = networkConfig[chainId].linkToken
    
    console.log("----------------------------------------------------")
    console.log('Deploying Oracle')

    const oracle = await deploy('Oracle', {
        from: deployer,
        args: [linkTokenAddress],
        log: true
    })
    console.log("Oracle deployed to: ", oracle.address)
    console.log("Run setFulfillmentPermission contract function with command:")
    console.log("npx hardhat set-fulfillment --contract " + oracle.address + " --network " + networkConfig[chainId]['name'] + " --nodeid YOUR_NODE_ADDRESS")
}
module.exports.tags = ['PriceConsumerV3']
