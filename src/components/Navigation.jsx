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
  Wrap,
  WrapItem,
  Avatar,
  Heading,
  Flex,
  Icon,
  Link
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CiLogout } from 'react-icons/ci';
import { IoHomeOutline } from 'react-icons/io5';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { logout, userState } = useAuth();
  const isAdmin = userState.role === 'admin';

  const userName = userState.firstName + ' ' + userState.lastName;

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <>
      <Flex gap="8" alignItems="center" justifyContent="space-between" p={4}>
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
                <Avatar name={userName} src=""></Avatar>
              </WrapItem>
            </Wrap>
            <Box>{userName}</Box>
          </DrawerHeader>

          <DrawerBody>
            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={4}
              align="stretch"
            >
              <Box display="flex" alignItems="center" gap="2">
                <Icon as={IoHomeOutline} boxSize={6} />
                <Link
                  as={ReactRouterLink}
                  to={isAdmin ? '/admin' : '/home'}
                  onClick={onClose}
                >
                  Home
                </Link>
              </Box>
              <Box display="flex" alignItems="center" gap="2">
                <Icon as={CiLogout} boxSize={6} />
                <Link as={ReactRouterLink} onClick={handleLogout}>
                  Logout
                </Link>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navigation;
