import { Container } from '@chakra-ui/react';
import AvailableUserCheckIn from './AvailableUserCheckIn';

const Homepage = () => {
  return (
    <Container maxW="container.lg" py={8}>
      <AvailableUserCheckIn />
    </Container>
  );
};

export default Homepage;
