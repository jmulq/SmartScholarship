import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { createScholarship } from '../ethereum';
import { AddIcon } from "@chakra-ui/icons"
import { Box, Text, Input, NumberInput, Button, Textarea, HStack, VStack, NumberInputField } from '@chakra-ui/react'
import { Body } from "../components";

export const AddScholarship = () => {
    const history = useHistory();
    const [scholarshipConfig, setScholarshipConfig] = useState({
        scholarshipId: '',
        name: '',
        description: '',
        targetStudentGroup: '',
        socialImpactOKR: '',
        maxApplicants: null,
        fundingGoal: null
    });
    const [examConfig, setExamConfig] = useState([{ name: '', totalMarks: null, passMarks: null }]);

    const handleAddExam = () => {
        const newExamConfig = [...examConfig, { name: '', totalMarks: null, passMarks: null }]
        setExamConfig(newExamConfig);
    }

    const handleScholarshipConfigChange = (event) => {
        const newConfig = {
            ...scholarshipConfig,
            [event.currentTarget.id]: event.currentTarget.value
        }
        console.log(newConfig)
        setScholarshipConfig(newConfig);
    }

    const handleExamConfigChange = (event, index) => {
        const newExamValue = examConfig[index];
        newExamValue[event.currentTarget.id] = event.currentTarget.value
        const newConfig = [...examConfig];
        newConfig[index] = newExamValue;
        setExamConfig(newConfig);
    }

    const handleCancel = () => {
        history.push('/');
    }

    const handleSubmit = async () => {
        await createScholarship(scholarshipConfig, examConfig);
        history.push('/');
    }

    const canSubmit = () => {
        return Object.values(scholarshipConfig).some(x => x === null) ||
            examConfig.some(y => Object.values(y).some(z => z === null));
    }

    const renderExamInputs = () => {
        return examConfig.map((exam, index) => (
            <HStack width="80%" justifyContent="center" bgColor="white" spacing="5px" >
                <Input id="name" color="black" placeholder="Name" width="70%" marginBottom="1%" onChange={(event) => handleExamConfigChange(event, index)} />
                <NumberInput>
                    <NumberInputField id="totalMarks" color="black" placeholder="Total marks" onChange={(event) => handleExamConfigChange(event, index)} />
                </NumberInput>
                <NumberInput>
                    <NumberInputField id="passMarks" color="black" placeholder="Pass marks" onChange={(event) => handleExamConfigChange(event, index)} />
                </NumberInput>
            </HStack>
        ))
    }

    return (
        <div>
            <Body>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" w="100%" h="100vh" bgGradient="linear(to-r,blue.200, blue.100)">
                    <VStack borderRadius="2xl" width="50%" bgColor="white">
                        <Text marginBottom="2%" marginTop="2%" color="blue.600">Scholarship Configuration</Text>
                        <Input id="scholarshipId" color="black" width="70%" placeholder="Scholarship ID" onChange={handleScholarshipConfigChange} />
                        <Input id="name" color="black" width="70%" placeholder="Name" onChange={handleScholarshipConfigChange} />
                        <Textarea id="description" color="black" width="70%" height="10%" placeholder="Description" onChange={handleScholarshipConfigChange} />
                        <Textarea id="targetStudentGroup" color="black" width="70%" height="10%" placeholder="Target student group" onChange={handleScholarshipConfigChange} />
                        <Textarea id="socialImpactOKR" color="black" width="70%" height="10%" placeholder="Social impact objective and key result" onChange={handleScholarshipConfigChange} />
                        <NumberInput width="70%">
                            <NumberInputField id="maxApplicants" color="black" placeholder="Max applicants" onChange={handleScholarshipConfigChange} />
                        </NumberInput>
                        <NumberInput width="70%" marginBottom="40px">
                            <NumberInputField id="fundingGoal" color="black" placeholder="Funding goal" onChange={handleScholarshipConfigChange} />
                        </NumberInput>
                    </VStack>

                    <VStack borderRadius="2xl" width="50%" bgColor="white" marginTop="5%" marginBottom="10%" marginStart="5px" marginEnd="5px">
                        <Text marginBottom="2%" marginTop="2%" color="blue.600">Exam Configuration</Text>
                        {renderExamInputs()}
                        <Button
                            leftIcon={<AddIcon />}
                            color="blue.600"
                            borderColor="blue.600"
                            colorScheme="whiteAlpha"
                            marginTop="20px"
                            marginBottom="20px"
                            onClick={handleAddExam}
                        >
                            Add exam
                            </Button>
                    </VStack>

                    <HStack borderRadius="2xl" width="20%" justifyContent="center" bgColor="white" spacing="5px" marginTop="-60px">
                        <Button marginTop="20px" marginBottom="20px" bgColor="red.200" onClick={handleCancel}>Cancel</Button>
                        <Button marginTop="20px" marginBottom="20px" bgColor="blue.200" onClick={handleSubmit} disabled={canSubmit()}>Submit</Button>
                    </HStack>

                </Box>
            </Body>
        </div>
    );
}