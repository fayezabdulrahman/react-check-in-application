import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  useColorModeValue,
  Image
} from '@chakra-ui/react';

import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import backgroundLogo from '../assets/b2b_second.jpg';
import appLogo from '../assets/ez_checkin_logo.png';
const Landing = () => {
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const userRoles = user?.['https://ez-check-in/roles'];

      if (userRoles.includes('admin')) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return (
    <Box
      bgImage={`url(${backgroundLogo})`}
      bgSize="cover"
      bgPosition="center"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={6}
    >
      <Container
        maxW="md"
        centerContent
        p={8}
        bg={useColorModeValue('white', 'gray.800')}
        rounded="lg"
        shadow="lg"
      >
        <VStack spacing={4} textAlign="center">
          <Box>
            <Image src={appLogo} alt="Ez Check-in logo" />
          </Box>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
            Log in to access your dashboard
          </Text>
          <Button size="lg" onClick={() => loginWithRedirect()}>
            Log in
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Landing;
