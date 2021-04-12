
import { HamburgerIcon, AddIcon } from '@chakra-ui/icons'
import { Box, Stack, HStack, Text, useColorModeValue, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react'
import * as React from 'react'
import useWeb3Modal from "../hooks/useWeb3Modal";
import { WalletButton } from './WalletButton';
import { useHistory } from "react-router-dom";

export const TopBar = () => {
    const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
    const history = useHistory();

    const handleClickAddScholarship = () => {
        history.push('/add-scholarship');
    }

    return (
        <Box as="section">
            <Stack
                direction={{ base: 'column', sm: 'row' }}
                py="3"
                px={{ base: '3', md: '6', lg: '8' }}
                color="white"
                bg={useColorModeValue('blue.600', 'blue.400')}
                justifyContent="space-between"
                alignItems="center"
                width="100%"
            >
                <HStack direction="row" width="100%" spacing="3" justifyContent="space-between">
                    <Menu>
                        <MenuButton
                            as={HamburgerIcon}
                            aria-label="Options"
                            icon={<HamburgerIcon />}
                            variant="outline"
                            fontSize="2xl"
                            h="10"
                        />
                        <MenuList color="black">
                            <MenuItem onClick={() => history.push('/')} icon={<AddIcon />} onClick={handleClickAddScholarship}>
                                Add Scholarship
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Text marginLeft="150px" fontSize="2xl" fontWeight="medium" marginEnd="2">
                        Smart Scholarship Portal
                    </Text>
                    <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
                </HStack>
            </Stack>
        </Box>
    )
}