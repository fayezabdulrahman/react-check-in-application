import { useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useLocalAuth } from '../../context/LocalAuthProvider';
import logo from '../../assets/b2b.png';
import { useAuth0 } from '@auth0/auth0-react';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
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
      <MobileNav
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        btnRef={btnRef}
        userName={userName}
        isAdmin={isAdmin}
        handleAppLogout={handleAppLogout}
        logo={logo}
      />
      <DesktopNav
        isAdmin={isAdmin}
        userName={userName}
        logo={logo}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
        isMenuOpen={isMenuOpen}
        handleAppLogout={handleAppLogout}
      />
    </>
  );
};

export default Navigation;
