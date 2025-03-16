import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';

import { useAuth0 } from '@auth0/auth0-react';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import backgroundLogo from '../assets/b2b_second.jpg';
const Landing = () => {
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const userRoles = user?.['https://ez-check-in/roles'];

      console.log('user roles in landing ', userRoles);
      console.log('user in landing ', user);

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
          <FaLock size={50} color={useColorModeValue('#2D3748', '#CBD5E0')} />
          <Text fontSize="2xl" fontWeight="bold">
            Welcome to Ez Check-ins
          </Text>
          <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
            Log in to access your dashboard
          </Text>
          <Button size="lg" onClick={() => loginWithRedirect()}>
            Log In
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Landing;
