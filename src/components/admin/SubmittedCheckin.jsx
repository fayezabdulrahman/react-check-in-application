import {
  Flex,
  Heading,
  Card,
  CardBody,
  Button,
  Container,
  CardFooter,
} from '@chakra-ui/react';
const SubmittedCheckin = () => {
  const DUMMY_CHECKINS = [
    {
      id: 'id1',
      date: '12/04/2024',
    },
    {
      id: 'id2',
      date: '12/06/2024',
    },
  ];

  return (
    <>
      <Container>
        <Heading pb='8'>Recent check-ins</Heading>
        <Flex gap="4" direction="column">
          {DUMMY_CHECKINS.map((checkIn) => (
            <Card key={checkIn.id}>
              <CardBody>
                <Heading as="h4" size="md">
                  {checkIn.date}
                </Heading>
              </CardBody>
              <CardFooter>
                <Button>View Check-in</Button>
              </CardFooter>
            </Card>
          ))}
        </Flex>
      </Container>
    </>
  );
};

export default SubmittedCheckin;
