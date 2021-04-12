import React, { useState, useEffect } from "react";
import { Body } from "../components";
import { fundScholarship, awardScholarship, getScholarshipContract, applyForScholarship, requestSuccessfulApplicant } from '../ethereum';
import { utils, constants } from "ethers";
import { withRouter } from "react-router-dom";
import { Box, Modal, ModalContent, Progress, ModalOverlay, ModalCloseButton, ModalFooter, ModalHeader, ModalBody, HStack, Button, Divider, Flex, Text, useColorModeValue as mode, NumberInput, NumberIn, NumberInputField } from '@chakra-ui/react'
import { Description } from '../components/Description';

const Scholarship = (props) => {
    const [funding, setFunding] = useState(null);
    const [contract, setContract] = useState(null);
    const [canAwardApplicant, setCanAwardApplicant] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { scholarshipAddress, scholarshipDetails } = props.location.state;
    const { info, maxApplicants, applicantCount, canAward, fundingGoal, currentFunding, isFundingComplete } = scholarshipDetails;
    const { scholarshipId, name, description, targetStudentGroup, socialImpactOKR } = info;

    const toString = (value) => {
        return value.toString();
    }

    const toEth = (value) => {
        const stringValue = value.toString();
        return utils.formatEther(stringValue);
    }

    const handleFundingChange = event => {
        setFunding(event.currentTarget.value);
    }

    const handleFund = async () => {
        await fundScholarship(funding, contract);
    }

    const handleApply = async () => {
        await applyForScholarship(contract);
    }

    const handleEvaluate = async () => {
        const res = await requestSuccessfulApplicant(contract);

        console.log('res', res);
        if (res == constants.AddressZero) {
            setShowModal(true);
            return;
        } else {
            setCanAwardApplicant(true);
        }
    }

    const handleAward = async () => {
        await awardScholarship();
    }

    const renderFundingProgress = () => {
        const progressValue = (+toEth(currentFunding) / +toEth(fundingGoal)) * 100;
        return <Progress borderRadius="2xl" marginBottom="5px" colorScheme="green" height="32px" value={progressValue} />
    }

    const renderModal = () => (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Unable to award scholarship</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>The scholarship cannot be completed until all applicants have recorded marks on each exam. Try again later.</Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

    useEffect(() => {
        const initScholContract = async (address) => {
            const res = await getScholarshipContract(address);
            setContract(res);
        }
        scholarshipAddress && initScholContract(scholarshipAddress);
    }, [])

    return (
        <div>
            <Body>
                <Box w="100%" h="100vh" bgGradient="linear(to-r,blue.200, blue.100)" display="flex" flexDirection="column" alignItems="center">
                    <Box marginBottom="100px" marginTop="150px" maxW={{ base: 'xl', md: '7xl' }} mx="auto" px={{ md: '8' }}>
                        {renderFundingProgress()}
                        <Box
                            maxW="3xl"
                            mx="auto"
                            rounded={{ md: 'lg' }}
                            bg={mode('white', 'gray.700')}
                            shadow="base"
                            overflow="hidden"
                        >
                            <Flex align="center" justify="space-between" px="6" py="4">
                                <Text color="black" fontSize="x-large" as="h3" fontWeight="bold" fontSize="lg">
                                    Scholarship Info
                                    </Text>
                            </Flex>
                            <Divider />
                            <Box>
                                <Description title="Name" value={name} />
                                <Description title="Scholarship ID" value={scholarshipId} />
                                <Description title="Description" value={description} />
                                <Description title="Target student group" value={targetStudentGroup} />
                                <Description title="Social impact OKR" value={socialImpactOKR} />
                                <Description title="Max applicants" value={toString(maxApplicants)} />
                                <Description title="Funding goal" value={`${toEth(fundingGoal)} ETH`} />
                                <Description title="Funding remaining" value={`${+toEth(fundingGoal) - +toEth(currentFunding)} ETH`} />
                            </Box>
                        </Box>
                    </Box>

                    <HStack marginTop="75px" marginBottom="75px" borderRadius="2xl" width="20%" justifyContent="center" bgColor="white" spacing="5px" marginTop="-60px">
                        <NumberInput marginTop="10px" width="70%" marginLeft="10px">
                            <NumberInputField id="fundingGoal" color="black" placeholder="Funding goal" onChange={handleFundingChange} />
                        </NumberInput>
                        <Button marginRight="10px" marginTop="20px" marginBottom="20px" bgColor="red.200" onClick={handleFund}>Fund</Button>
                    </HStack>
                    <HStack borderRadius="2xl" width="20%" justifyContent="center" bgColor="white" spacing="5px" marginTop="-60px">
                        <Button marginTop="20px" marginBottom="20px" bgColor="blue.200" onClick={handleApply}>Apply</Button>
                        <Button marginTop="20px" marginBottom="20px" bgColor="green.200" onClick={handleEvaluate}>Evaluate</Button>
                        <Button marginTop="20px" marginBottom="20px" bgColor="blue.200" disabled={!canAwardApplicant} onClick={handleAward}>Award</Button>
                    </HStack>
                    {setShowModal && renderModal()}
                </Box>
            </Body>


        </div>
    );
}



export default withRouter(Scholarship);