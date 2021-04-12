import { ethers, Contract, BigNumber, utils } from 'ethers';
import ScholarshipFactory from './abis/ScholarshipFactory.json';
import Scholarship from './abis/Scholarship.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const getBlockchain = () =>
    new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            if (window.ethereum) {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const signerAddress = await signer.getAddress();
                const scholarshipFactory = new Contract(
                    ScholarshipFactory.address,
                    ScholarshipFactory.abi,
                    signer
                );

                resolve({ signerAddress, scholarshipFactory });
            }
            resolve({ signerAddress: undefined, scholarshipFactory: undefined });
        });
    });

const getScholarshipContracts = async (scholarshipAddresses) => {
    const contracts = scholarshipAddresses.map((address, index) => {
        const scholarship = new Contract(
            address,
            Scholarship.abi,
            signer
        );
        return scholarship;
    })
    return contracts;
}

const getScholarshipContract = async (scholarshipAddress) => {
    const scholarship = new Contract(
        scholarshipAddress,
        Scholarship.abi,
        signer
    );
    return scholarship;
}

const getAllScholarshipDetails = async (scholarshipContracts) => {
    return Promise.all(scholarshipContracts.map(contract => getScholarshipDetails(contract)));
}

const getScholarshipDetails = async (scholarshipContract) => {
    const info = await scholarshipContract.info();
    const maxApplicants = await scholarshipContract.maxApplicants();
    const applicantCount = await scholarshipContract.applicantCount();
    const canAward = await scholarshipContract.canAward();
    const fundingGoal = await scholarshipContract.fundingGoal();
    const currentFunding = await scholarshipContract.currentFunding();
    const isFundingComplete = await scholarshipContract.isFundingComplete();

    return {
        info,
        maxApplicants,
        applicantCount,
        canAward,
        fundingGoal,
        currentFunding,
        isFundingComplete
    }
}

const fundScholarship = async (amount, scholarshipContract) => {
    await window.ethereum.enable();
    const amountInWei = utils.parseUnits(amount);
    await scholarshipContract.fundScholarship(amountInWei, { value: amountInWei });
};

const applyForScholarship = async (scholarshipContract) => {
    await window.ethereum.enable();
    await scholarshipContract.applyForScholarship();
}

const requestSuccessfulApplicant = async (scholarshipContract, scholarshipId) => {
    await window.ethereum.enable();
    await scholarshipContract.requestExamRecordData(scholarshipId);
    const successfulApplicant = await scholarshipContract.readSuccessfulApplicant();
    return successfulApplicant;
}

const awardScholarship = async (scholarshipContract) => {
    await window.ethereum.enable();
    await scholarshipContract.awardScholarship();
}

const createScholarship = async (scholarshipConfig, examConfig) => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const scholarshipFactory = new Contract(
        ScholarshipFactory.address,
        ScholarshipFactory.abi,
        signer
    );
    const transformedScholarshipConfig = {
        ...scholarshipConfig,
        maxApplicants: BigNumber.from(scholarshipConfig.maxApplicants),
        fundingGoal: utils.parseUnits(scholarshipConfig.fundingGoal)
    }
    const transformedExamConfig = examConfig.map(exam => {
        return {
            ...exam,
            totalMarks: BigNumber.from(exam.totalMarks),
            passMarks: BigNumber.from(exam.passMarks)
        }
    });
    await scholarshipFactory.createScholarship(transformedScholarshipConfig, transformedExamConfig);
};

export {
    getBlockchain,
    getScholarshipContracts,
    getScholarshipContract,
    getScholarshipDetails,
    getAllScholarshipDetails,
    createScholarship,
    fundScholarship,
    applyForScholarship,
    requestSuccessfulApplicant,
    awardScholarship
};