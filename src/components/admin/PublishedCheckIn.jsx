import { Container, Flex, Heading } from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import FormFactory from '../shared/FormFactory';

const PublishedCheckIn = () => {
  const { publishedCheckIn } = useAdmin();

  console.log('published checkIn', publishedCheckIn);

  return (
    <Container>
      <Heading>Your clients latest published check-in</Heading>
      <Flex flexDirection="column">
        {publishedCheckIn.questions?.map((quesetion, index) => (
          <FormFactory key={index} question={quesetion} />
        ))}
      </Flex>
    </Container>
  );
};

export default PublishedCheckIn;
