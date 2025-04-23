// components/DesktopNav.tsx
import {
  Flex,
  Link,
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image
} from '@chakra-ui/react';
import { CiLogout } from 'react-icons/ci';
import { Link as ReactRouterLink } from 'react-router-dom';

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
    <Image src={logo} height="50px" rounded="sm" />

    {/* Links */}
    <Flex alignItems="center" gap={6}>
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
        to={isAdmin ? '/admin/create' : '/user/submitted'}
        fontSize="lg"
        fontWeight="500"
        _hover={{ textDecoration: 'none', opacity: 0.8 }}
      >
        {isAdmin ? 'Create Check-in ' : 'My Check-ins'}
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
);

export default DesktopNav;
