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
import { Link as ReactRouterLink } from 'react-router-dom';
import { useAdmin } from '../../context/AdminProvider';
import { client } from '../../util/axios-util';
import { useEffect, useState } from 'react';
import Loading from '../shared/Loading';

const AvailableCheckIn = () => {
  const {
    submittedCheckIns,
    setSubmittedCheckIns,
    setPublishedCheckIn,
    publishedCheckIn
  } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const toast = useToast();

  // TODO: add functionality to delete checkins

  useEffect(() => {
    const fetchCreatedCheckins = async () => {
      await client
        .get('/admin/allCheckins')
        .then((response) => {
          console.log('success fetching all checkins ', response.data);
          const allCheckins = response.data.checkIns;
          setSubmittedCheckIns(allCheckins);
          setLoading(false);
        })
        .catch((error) => {
          console.log('error fetching all checkins ', error);
          setLoading(false);
        });
    };
    fetchCreatedCheckins();
    // added publishedCheckIn as dependecny because when we publish a check-in we want to re-render so we can disable publish button
  }, [setSubmittedCheckIns, publishedCheckIn]);

  async function handlePublishCheckIn(checkInId) {
    setPublishing(true);
    const payload = {
      checkInToPublish: checkInId
    };
    try {
      const response = await client.post('/admin/publishCheckIn', payload);
      console.log('response from server', response.data);
      const message = response.data.message;
      const serverPublishedCheckIn = response.data.checkIn;

      setPublishedCheckIn(serverPublishedCheckIn);
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
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <Heading> Your Created Check-ins</Heading>
      {submittedCheckIns?.map((availableCheckIn, index) => (
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
                isLoading={publishing}
                loadingText="Publishing"
                variant="solid"
                colorScheme="orange"
                isDisabled={availableCheckIn.published}
                onClick={() => handlePublishCheckIn(availableCheckIn.checkInId)}
              >
                Publish
              </Button>
              <Button
                as={ReactRouterLink}
                to='/admin/editCheckIn'
                state={{checkInId: availableCheckIn.checkInId}}
                variant="ghost"
                colorScheme="orange"
              >
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
