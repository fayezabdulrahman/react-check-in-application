// components/MobileNav.tsx
import {
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  StackDivider,
  Avatar,
  Box,
  Wrap,
  WrapItem,
  Link,
  Icon,
  Flex,
  Image
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoHomeOutline, IoFolderOpenOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
import { Link as ReactRouterLink } from 'react-router-dom';

const MobileNav = ({
  isOpen,
  onOpen,
  onClose,
  btnRef,
  userName,
  isAdmin,
  handleAppLogout,
  logo
}) => (
  <Flex justify="space-between" align="center" p={4} display={{ base: 'flex', md: 'none' }}>
    <IconButton
      variant="outline"
      aria-label="Open menu"
      fontSize="20px"
      ref={btnRef}
      onClick={onOpen}
      icon={<GiHamburgerMenu />}
    />
    <Image
      src={logo}
      height="50px"
      rounded="lg"
      display={{ base: 'block', md: 'none' }}
    />

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
                to={isAdmin ? '/admin/create' : '/user/submitted'}
                onClick={onClose}
                fontSize="lg"
              >
                {isAdmin ? 'Create Check-in' : 'My Check-ins'}
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
  </Flex>
);

export default MobileNav;
