import { Box } from '@chakra-ui/react';
import Navigation from '../components/navigation/Navigation';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" >
      <Navigation />
      <Box flex="1" bg={'gray.50'}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
