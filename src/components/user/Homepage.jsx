import { Container } from '@chakra-ui/react';
import CheckInForm from './CheckInForm';

const Homepage = () => {
  return (
    <Container maxW="container.lg" py={8}>
      <CheckInForm />
    </Container>
  );
};

export default Homepage;
