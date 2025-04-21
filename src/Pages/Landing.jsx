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
import Loading from '../components/shared/Loading';
const Landing = () => {
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Move all hooks calls to the top BEFORE any conditionals
  const containerBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const userRoles = user?.['https://ez-check-in/roles'];

      if (userRoles.includes('admin')) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return <Loading />;
  }

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
        bg={containerBg}
        rounded="lg"
        shadow="lg"
      >
        <VStack spacing={4} textAlign="center">
          <Box>
            <Image src={appLogo} alt="Ez Check-in logo" />
          </Box>
          <Text fontSize="lg" color={textColor}>
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
