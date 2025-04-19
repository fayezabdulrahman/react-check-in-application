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
  Image,
  Menu,
  MenuList,
  MenuButton,
  MenuItem
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CiLogout } from 'react-icons/ci';
import { IoHomeOutline, IoFolderOpenOutline} from 'react-icons/io5';
import { useRef, useState } from 'react';
import { useLocalAuth } from '../context/LocalAuthProvider';
import logo from '../assets/b2b.png';
import { useAuth0 } from '@auth0/auth0-react';
const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { handleAppLogout, userDetails } = useLocalAuth();
  const { user } = useAuth0();
  const userRoles = user?.['https://ez-check-in/roles'] || [];

  const isAdmin = userRoles.includes('admin');

  const userName = `${userDetails?.firstName} ${userDetails?.lastName}`;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={4}
        position="relative"
      >
        {/* Mobile Hamburger */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          variant="outline"
          aria-label="Open menu"
          fontSize="20px"
          ref={btnRef}
          onClick={onOpen}
          icon={<GiHamburgerMenu />}
        />

        {/* Logo */}
        <Image
          rounded="sm"
          src={logo}
          height="50px"
          position={{ base: 'absolute', md: 'static' }}
          left="50%"
          transform={{ base: 'translateX(-50%)', md: 'none' }}
        />

        {/* Desktop Navigation */}
        <Flex
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          gap={6}
        >
          <Link
            as={ReactRouterLink}
            to={isAdmin ? '/admin' : '/home'}
            fontSize="lg"
            fontWeight="500"
            _hover={{ textDecoration: 'none', opacity: 0.8 }}
          >
            Home
          </Link>

          <Link
            as={ReactRouterLink}
            to={isAdmin ? '/admin/availableCheckIn' : '/user/submitted'}
            fontSize="lg"
            fontWeight="500"
            _hover={{ textDecoration: 'none', opacity: 0.8 }}
          >
            My Check-ins
          </Link>

          <Box onMouseEnter={handleMenuOpen} onMouseLeave={handleMenuClose}>
            <Menu isOpen={isMenuOpen}>
              <MenuButton>
                <Avatar name={userName} size="md" cursor="pointer" />
              </MenuButton>
              <MenuList
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
              >
                <MenuItem icon={<CiLogout />} onClick={handleAppLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {/* Mobile Drawer */}
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
                <Avatar name={userName} />
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
                  fontSize="lg"
                >
                  Home
                </Link>
              </Box>
              <Box display="flex" alignItems="center" gap="2">
              <Icon as={IoFolderOpenOutline} boxSize={6} />
                <Link
                  as={ReactRouterLink}
                  to={isAdmin ? '/admin/availableCheckIn' : '/user/submitted'}
                  onClick={onClose}
                  fontSize="lg"
                >
                  My Check-ins
                </Link>
              </Box>
              <Box display="flex" alignItems="center" gap="2">
                <Icon as={CiLogout} boxSize={6} />
                <Link
                  as={ReactRouterLink}
                  onClick={() => {
                    onClose();
                    handleAppLogout();
                  }}
                  fontSize="lg"
                >
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
