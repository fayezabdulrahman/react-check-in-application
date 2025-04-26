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
    <Image src={logo} height="50px" rounded="lg" />

    {/* Links */}
    <Flex alignItems="center" gap={6}>
      <Link
        as={ReactRouterLink}
        to={isAdmin ? '/admin' : '/home'}
        fontSize="lg"
        fontWeight="500"
        position="relative"
        _hover={{
          textDecoration: 'underline',
          color: 'orange.500'
        }}
        _after={{
          content: '""',
          position: 'absolute',
          width: '0%',
          height: '2px',
          left: 0,
          bottom: '-2px',
          bg: 'orange.500',
          transition: 'width 0.3s ease'
        }}
      >
        Home
      </Link>
      <Link
        as={ReactRouterLink}
        to={isAdmin ? '/admin/create' : '/user/submitted'}
        fontSize="lg"
        fontWeight="500"
        position="relative"
        _hover={{
          textDecoration: 'underline',
          color: 'orange.500'
        }}
        _after={{
          content: '""',
          position: 'absolute',
          width: '0%',
          height: '2px',
          left: 0,
          bottom: '-2px',
          bg: 'orange.500',
          transition: 'width 0.3s ease'
        }}
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
