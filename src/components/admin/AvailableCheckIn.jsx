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
import { MdDeleteOutline } from 'react-icons/md';
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
  const [deleting, setDeleting] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

  const toast = useToast();

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
    setLoading(false);
    // added publishedCheckIn as dependecny because when we publish a check-in we want to re-render so we can disable publish button
  }, [setSubmittedCheckIns, publishedCheckIn, deleting]);

  async function handlePublishCheckIn(checkInId) {
    setPublishing(true);
    const payload = {
      checkInToPublish: checkInId
    };
    try {
      const response = await client.post('/admin/publishCheckIn', payload);
      console.log('response from server', response.data);
      const message = response.data.message;
      // if we get a successful response, set cache and update state
      if (response.data.checkIn) {
        const serverPublishedCheckIn = response.data.checkIn;
        // remove old cache for analytics first
        localStorage.removeItem('publishedCheckInAnalytics');
        // set new cache for published check-in
        localStorage.setItem(
          'publishedCheckIn',
          JSON.stringify(serverPublishedCheckIn)
        );
        setPublishedCheckIn(serverPublishedCheckIn);
      }

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

  async function handleDeleteCheckIn(checkInId) {
    setDeleting(true);

    console.log('checkIn to delet', checkInId);

    const payload = {
      checkInToDelete: checkInId
    };
    try {
      const response = await client.post('/admin/deleteCheckIn', payload);
      console.log('response from server', response.data);
      const message = response.data.message;

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
      setDeleting(false);
    }
  }

  async function handleUnPublishCheckIn(checkInId) {
    setUnpublishing(true);
    const payload = {
      checkInToUnpublish: checkInId
    };
    try {
      const response = await client.post('/admin/unPublishCheckIn', payload);
      const message = response.data.message;
      // if we get a successfull response, remove cache and update state
      if (response.data.checkIn) {
        localStorage.removeItem('publishedCheckInAnalytics');
        localStorage.removeItem('publishedCheckIn');
        const serverPublishedCheckIn = response.data.checkIn;
        setPublishedCheckIn(serverPublishedCheckIn);
      }

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
      setUnpublishing(false);
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
          <CardFooter justifyContent="space-between">
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
              {availableCheckIn.published && (
                <Button
                  variant="solid"
                  colorScheme="orange"
                  onClick={() =>
                    handleUnPublishCheckIn(availableCheckIn.checkInId)
                  }
                >
                  Unpublish
                </Button>
              )}

              <Button
                as={ReactRouterLink}
                to="/admin/editCheckIn"
                state={{ checkInId: availableCheckIn.checkInId }}
                variant="ghost"
                colorScheme="orange"
              >
                Edit
              </Button>
            </ButtonGroup>
            <Button
              isLoading={unpublishing}
              loadingText="Unpublishing..."
              leftIcon={<MdDeleteOutline />}
              onClick={() => handleDeleteCheckIn(availableCheckIn.checkInId)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </Container>
  );
};

export default AvailableCheckIn;
