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
  Flex,
  Image
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoHomeOutline, IoFolderOpenOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
import MobileNavItem from './MobileNavItem';

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
  <Flex
    justify="space-between"
    align="center"
    p={4}
    display={{ base: 'flex', md: 'none' }}
  >
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
            <MobileNavItem
              icon={IoHomeOutline}
              label="Home"
              to={isAdmin ? '/admin' : '/home'}
              onClick={onClose}
            />
            <MobileNavItem
              icon={IoFolderOpenOutline}
              label={isAdmin ? 'Create Check-in' : 'My Check-ins'}
              to={isAdmin ? '/admin/create' : '/user/submitted'}
              onClick={onClose}
            />
            <MobileNavItem
              icon={CiLogout}
              label="Logout"
              onClick={() => {
                onClose();
                handleAppLogout();
              }}
            />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </Flex>
);

export default MobileNav;
