let { networkConfig } = require('../helper-hardhat-config')

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    
    let chainId = await getChainId()

    console.log("----------------------------------------------------")
    console.log('Deploying ScholarshipFactory')

    const scholarshipFactory = await deploy('ScholarshipFactory', {
        from: deployer,
        log: true
    })
    console.log("ScholarshipFactory deployed to: ", scholarshipFactory.address)
    console.log("Run the following command to fund contract with LINK:")
    console.log("npx hardhat fund-link --contract " + scholarshipFactory.address + " --network " + networkConfig[chainId]['name'])
    console.log("Run createScholarship contract function with command:")
    console.log("npx hardhat create-scholarship --contract " + scholarshipFactory.address + " --network " + networkConfig[chainId]['name'])
}
module.exports.tags = ['PriceConsumerV3']
