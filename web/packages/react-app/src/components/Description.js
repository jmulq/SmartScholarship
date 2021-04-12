
import { Box, Flex, useColorModeValue as mode } from '@chakra-ui/react'
import * as React from 'react'

export const Description = (props) => {
    const { title, value } = props
    return (
        <Flex
            as="dl"
            direction={{ base: 'column', sm: 'row' }}
            px="6"
            py="4"
            _even={{ bg: mode('gray.50', 'gray.600') }}
        >
            <Box color="black" fontSize="x-large" as="dt" flexBasis="25%">
                {title}:
      </Box>
            <Box color="black" fontSize="x-large" as="dd" flex="1" fontWeight="semibold">
                {value}
            </Box>
        </Flex>
    )
}
