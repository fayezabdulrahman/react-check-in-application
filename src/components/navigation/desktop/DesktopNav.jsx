import {
  Flex,
  HStack,
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image
} from '@chakra-ui/react';
import { CiLogout } from 'react-icons/ci';
import DesktopNavItem from './DesktopNavItem';
const DesktopNav = ({
  isAdmin,
  userName,
  logo,
  handleMenuOpen,
  handleMenuClose,
  isMenuOpen,
  handleAppLogout
}) => (
  <Flex
    justify="space-between"
    align="center"
    p={4}
    display={{ base: 'none', md: 'flex' }}
  >
    {/* Logo */}
    <Image src={logo} height="50px" rounded="lg" />

    {/* Links */}
    <HStack spacing={6} align="center">
      <DesktopNavItem label="Home" to={isAdmin ? '/admin' : '/home'} />
      <DesktopNavItem
        label={isAdmin ? 'Create Check-in' : 'My Check-ins'}
        to={isAdmin ? '/admin/create' : '/user/submitted'}
      />

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
    </HStack>
  </Flex>
);

export default DesktopNav;
