import {
  VStack,
  StackDivider,
  Box,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Wrap,
  WrapItem,
  Avatar,
  Heading,
  Flex,
} from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CiLogout } from 'react-icons/ci';
import { IoChatboxOutline, IoHomeOutline } from 'react-icons/io5';
import { useRef } from 'react';
const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  return (
    <>
      <Flex gap='8' alignItems='center' justifyContent='space-between' p={4}>
        <IconButton
          variant="outline"
          colorScheme="teal"
          aria-label="Call Sage"
          fontSize="20px"
          ref={btnRef}
          onClick={onOpen}
          icon={<GiHamburgerMenu />}
        />
        <Heading> Gym name</Heading>
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader display="flex" gap="4" alignItems="center">
            <Wrap>
              <WrapItem>
                <Avatar name="user name" src=""></Avatar>
              </WrapItem>
            </Wrap>
            <Box>Username</Box>
          </DrawerHeader>

          <DrawerBody>
            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={4}
              align="stretch"
            >
              <Box display="flex" alignItems="center" gap="2">
                <IconButton
                  colorScheme="teal"
                  aria-label="Call Sage"
                  fontSize="20px"
                  icon={<IoHomeOutline />}
                />
                Home
              </Box>
              <Box display="flex" alignItems="center" gap="2">
                <IconButton
                  colorScheme="teal"
                  aria-label="Call Sage"
                  fontSize="20px"
                  icon={<IoChatboxOutline />}
                />
                Chat
              </Box>
              <Box display="flex" alignItems="center" gap="2">
                <IconButton
                  colorScheme="teal"
                  aria-label="Call Sage"
                  fontSize="20px"
                  icon={<CiLogout />}
                />
                Logout
              </Box>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navigation;