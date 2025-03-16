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
  Flex,
  Icon,
  Link,
  Image
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CiLogout } from 'react-icons/ci';
import { IoHomeOutline } from 'react-icons/io5';
import { useRef } from 'react';
import { useLocalAuth } from '../context/LocalAuthProvider';
import logo from '../assets/b2b.png';
import { useAuth0 } from '@auth0/auth0-react';
const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { logout } = useLocalAuth();
  const { user } = useAuth0();
  const userRoles = user?.['https://ez-check-in/roles'] || [];

  const isAdmin = userRoles.includes('admin');

  const userName = user?.nickname;

  return (
    <>
      <Flex gap="8" alignItems="center" justifyContent="space-between" p={4}>
        <IconButton
          variant="outline"
          aria-label="Call Sage"
          fontSize="20px"
          ref={btnRef}
          onClick={onOpen}
          icon={<GiHamburgerMenu />}
        />
        <Image rounded="sm" src={logo} height='50px' />
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
                <Avatar name={userName} src={user.picture}></Avatar>
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
                <Link as={ReactRouterLink} onClick={logout}>
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
