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
  VStack
} from '@chakra-ui/react';
import { useAdminQuestion } from '../context/AdminProvider';
import { useEffect } from 'react';
import { client } from '../util/axios-util';

const AvailableCheckIn = () => {
  const { submittedCheckIns, setSubmittedCheckIns } = useAdminQuestion();

  useEffect(() => {
    const fetchCreatedCheckins = async () => {
      await client
        .get('/admin/allCheckins')
        .then((response) => {
          console.log('success fetching all checkins ', response.data);
          const allCheckins = response.data.checkIns;
          setSubmittedCheckIns(allCheckins);
        })
        .catch((error) => {
          console.log('error fetching all checkins ', error);
        });
    };
    fetchCreatedCheckins();
  }, [setSubmittedCheckIns]);

  // add functionality to edit/delete checkins
  // add functionality to publish checkins

  return (
    <Container>
      <Heading color="red.500"> Your Created Check-ins</Heading>
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
