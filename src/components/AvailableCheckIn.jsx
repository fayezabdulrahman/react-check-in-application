import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react';
import { useAdminQuestion } from '../context/AdminProvider';
import { client } from '../util/axios-util';
const AvailableCheckIn = () => {
  const { submittedCheckIns, setPublishedCheckIn } = useAdminQuestion();
  const toast = useToast();

  // add functionality to edit/delete checkins
  async function handlePublishCheckIn(checkInId) {
    const payload = {
      checkInToPublish: checkInId
    };
    try {
      const response = await client.post('/admin/publishCheckIn', payload);
      console.log('response from server', response.data);
      const message = response.data.message;
      const publishedCheckIn = response.data.checkIn;

      setPublishedCheckIn(publishedCheckIn);
      toast({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.log('error');
      toast({
        title: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }

  return (
    <Container>
      <Heading> Your Created Check-ins</Heading>
      {submittedCheckIns.map((availableCheckIn, index) => (
        <Card key={index} mt="1rem">
          <CardHeader>Check-in name: {availableCheckIn.checkInId}</CardHeader>
          <CardBody>
            <Text>Created By: {availableCheckIn.createdBy}</Text>
            <Text>Published: {availableCheckIn.published ? 'Yes' : 'No'} </Text>
            <Text>Questions length: {availableCheckIn.questions.length}</Text>
          </CardBody>
          <CardFooter>
            <ButtonGroup>
              <Button
                variant="solid"
                colorScheme="orange"
                isDisabled={availableCheckIn.published}
                onClick={() => handlePublishCheckIn(availableCheckIn.checkInId)}
              >
                Publish
              </Button>
              <Button variant="ghost" colorScheme="orange">
                Edit
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      ))}
    </Container>
  );
};

export default AvailableCheckIn;
