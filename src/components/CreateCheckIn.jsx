import {
  Text,
  Container,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter
} from '@chakra-ui/react';
const CreateCheckIn = () => {
  return (
    <>
      <Container>
        <Card>
          <CardHeader color="gray.500">No Active Check</CardHeader>
          <CardBody>
            <Text>Create a check in for your clients</Text>
          </CardBody>
          <CardFooter flex="row" justifyContent={'center'}>
            <Button colorScheme="orange">Create Check In</Button>
          </CardFooter>
        </Card>
      </Container>
    </>
  );
};

export default CreateCheckIn;
