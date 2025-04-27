import { NavLink as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';

const DesktopNavItem = ({ label, to }) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      end // only apply active styles on exact match
      fontSize="lg"
      fontWeight="500"
      position="relative"
      px={2}
      py={1}
      borderRadius="md"
      _hover={{
        textDecoration: 'none',
        bg: 'gray.100'
      }}
      _activeLink={{
        color: 'orange.500',
        fontWeight: 'bold'
      }}
    >
      {label}
    </Link>
  );
};

export default DesktopNavItem;
