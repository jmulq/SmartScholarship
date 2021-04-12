import React from 'react';
import { Box, Text } from '@chakra-ui/react'

export const ScholarshipCard = ({ id, name, description, goal, current, handleClick }) => (
    <Box id={id} onClick={handleClick} display="flex" flexDirection="column" alignItems="center" textAlign="center" bgColor="gray.200" color="black" borderRadius="lg" width="40%" marginBottom="40px" minHeight="250px" cursor="pointer">
        <Text fontSize="larger" marginTop="20px">{name}</Text>
        <Text fontSize="large">{description}</Text>
        <Text fontSize="large" marginBottom="20px">Current funding is {current} out of {goal} ETH</Text>
    </Box>
)