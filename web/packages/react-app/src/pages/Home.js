import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Box, Spinner } from '@chakra-ui/react'
import { Body } from "../components";
import { getBlockchain, getScholarshipContracts, getScholarshipDetails, getAllScholarshipDetails } from '../ethereum';
import { ScholarshipCard } from "../components/ScholarshipCard";
import { utils, BigNumber } from "ethers";
import { from } from "apollo-link";

export const Home = () => {
    const [scholarshipFactory, setScholarshipFactory] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [scholarships, setScholarships] = useState([]);
    const [scholarshipContracts, setScholarshipContracts] = useState([]);
    const [scholarshipDetails, setScholarshipDetails] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const init = async () => {
            const { scholarshipFactory } = await getBlockchain();
            setScholarshipFactory(scholarshipFactory);
        }
        init();
    }, []);

    useEffect(() => {
        const getScholarships = async () => {
            const scholarships = await scholarshipFactory.getScholarships();
            setScholarships(scholarships);
        }
        typeof scholarshipFactory !== 'undefined' && getScholarships();
    }, [scholarshipFactory])

    useEffect(() => {
        const getScholarshipContract = async (scholarships) => {
            const res = await getScholarshipContracts(scholarships);
            setScholarshipContracts(res);
        }
        scholarships.length > 0 && getScholarshipContract(scholarships);
    }, [scholarships])

    useEffect(() => {
        const getScholarshipsData = async (scholarships) => {
            const scholarshipDetails = await getAllScholarshipDetails(scholarships);
            setScholarshipDetails(scholarshipDetails);
            setIsLoading(false);
        }
        scholarshipContracts.length > 0 && getScholarshipsData(scholarshipContracts);
    }, [scholarshipContracts])

    const handleCardClick = (event) => {
        console.log('ye', scholarshipDetails[event.currentTarget.id]);
        history.push({
            pathname: '/scholarship',
            state: {
                scholarshipAddress: scholarships[event.currentTarget.id],
                scholarshipDetails: scholarshipDetails[event.currentTarget.id],
            }
        })
    }

    const renderScholarshipCards = () => {
        return scholarshipDetails.map((scholarship, index) => {
            const { fundingGoal, currentFunding, info } = scholarship;
            const { name, description } = info;

            const goalString = fundingGoal.toString();
            const currentString = currentFunding.toString();

            const goalEth = utils.formatEther(goalString);
            const currentEth = utils.formatEther(currentString);

            return <ScholarshipCard id={index} handleClick={handleCardClick} name={name} description={description} goal={goalEth} current={currentEth} />
        })
    }

    return (
        <div>
            <Body>
                <Box w="100%" h="100vh" bgGradient="linear(to-r,blue.200, blue.100)">
                    {isLoading ?
                        <Spinner
                            size="xl"
                            position="absolute"
                            right="50%"
                            top="50%"
                            marginRight="-3rem"
                            marginTop="-3rem"
                        /> : <Box display="flex" flexWrap="wrap" justifyContent="space-around" marginTop="10%">{renderScholarshipCards()}</Box>
                    }
                </Box>
            </Body>
        </div>
    );
}