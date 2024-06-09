import { Container, Heading, Spinner } from '@chakra-ui/react';

const Loading = () => {
  return (
    <>
      <Container centerContent mt='15rem'>
        <Heading as='h1' size='4xl'>Loading</Heading>
        <Spinner size="xl" color="red.500" mt='1.5rem' />
      </Container>
    </>
  );
};

export default Loading;
