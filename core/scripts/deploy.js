const { ethers } = require('ethers');
const fs = require('fs');
const { networkConfig, getNetworkId } = require('../helper-hardhat-config');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const ScholarshipFactory = await ethers.getContractFactory('ScholarshipFactory');
    const scholarshipFactory = await ScholarshipFactory.deploy();
    console.log(`ScholarshipFactory address: ${scholarshipFactory.address}`);

    const scholarshipFactoryData = {
        address: scholarshipFactory.address,
        abi: JSON.parse(scholarshipFactory.interface.format('json'))
    };

    let networkId = await getNetworkId(network.name);
    let linkTokenAddress = networkConfig[networkId];
    const LinkToken = await ethers.getContractFactory("LinkToken")

    const amount = web3.utils.toHex(10e18)
    const linkTokenContract = new ethers.Contract(linkTokenAddres, LinkToken.interface, deployer.address);
    await linkTokenContract.transfer(contractAddr, amount);

    // const scholarshipConfigParam = {
    //     scholarshipId: 'EMP2072',
    //     name: 'Empower Scholarship Scheme - 2021',
    //     description: 'Scholarship to encourage completion of lower secondary education  of female students in sub-Saharan Africa',
    //     targetStudentGroup: 'Female students in Ethopia',
    //     socialImpactOKR: 'Improve lower secondary education completion rate of female students by atleast 10%',
    //     maxApplicants: 10,
    //     fundingGoal: ethers.BigNumber.from(10).pow(18), // 10 ETH
    // };

    // const examConfigsParam = [
    //     {
    //         name: 'English',
    //         totalMarks: 100,
    //         passMarks: 50,
    //     },
    //     {
    //         name: 'Maths',
    //         totalMarks: 100,
    //         passMarks: 50,
    //     },
    //     {
    //         name: 'Science',
    //         totalMarks: 100,
    //         passMarks: 50,
    //     }
    // ];

    // const Scholarship = await ethers.getContractFactory('Scholarship');
    // const scholarship1 = await Scholarship.deploy(deployer.address, scholarshipConfigParam, examConfigsParam);
    // console.log(`Scholarship 1 address: ${scholarship1.address}`);

    // const scholarship1Data = {
    //     address: scholarship1.address,
    //     abi: JSON.parse(scholarship1.interface.format('json'))
    // }

    // Write to data folder for use in the front-end
    // fs.writeFileSync('data/APIConsumer.json', JSON.stringify(apiConsumerData));
    // fs.writeFileSync('../web/packages/react-app/src/abis/Scholarship1.json', JSON.stringify(scholarship1Data));
    fs.writeFileSync('../web/packages/react-app/src/abis/ScholarshipFactory.json', JSON.stringify(scholarshipFactoryData));


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    })