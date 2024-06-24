import { Button, Container, useToast, Flex, Heading } from '@chakra-ui/react';
import FormFactory from '../shared/FormFactory';
import { client } from '../../util/axios-util';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserProvider';
import Loading from '../shared/Loading';
import { useAuth } from '../../context/AuthProvider';
import { INITIAL_QUESTION_RESPONSE } from '../../constants/application';

const CheckInForm = () => {
  const {
    setPublishedCheckIn,
    publishedCheckIn,
    questionResponse,
    setQuestionResponse
  } = useUser();

  const [loading, setLoading] = useState(true);
  const { userState } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const submitCheckInApiCall = async () => {
      if (!questionResponse.submittedBy) return;
      try {
        console.log('submit answer', questionResponse);
        const responseServer = await client.post(
          '/user/submitCheckIn',
          questionResponse
        );
        toast({
          title: responseServer.data.message,
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        setQuestionResponse(INITIAL_QUESTION_RESPONSE);
      } catch (error) {
        console.log('error from server on submitting checkin ', error);
        toast({
          title: 'Failed to Submit Check-in',
          description: error.response?.data?.message || 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    };

    submitCheckInApiCall();
  }, [questionResponse, setQuestionResponse, toast]);

  function handleSubmit() {
    setQuestionResponse((prevState) => ({
      ...prevState,
      checkInId: publishedCheckIn.checkInId,
      submittedBy: userState.firstName + ' ' + userState.lastName
    }));
  }

  async function handleFetch() {
    try {
      console.log('submit answer', questionResponse);
      const responseServer = await client.get(
        '/user/questionResponses'
      );
      console.log('response', responseServer.data);
    } catch (error) {
      console.log('error from server on retrieving responses ', error);
    }
  }

  // call api to fetch publishedcheckIn
  useEffect(() => {
    const fetchPublishedCheckin = async () => {
      await client
        .get('/admin/publishedCheckin')
        .then((response) => {
          console.log('response from server', response.data);
          const serverResponse = response.data;
          if (serverResponse.checkIn !== null) {
            const publishedCheckInDB = serverResponse.checkIn;
            setPublishedCheckIn(publishedCheckInDB);
          }
        })
        .catch((error) => {
          console.log('error fetching published check-in', error);
        });
    };

    const fetchData = async () => {
      await fetchPublishedCheckin();
      setLoading(false);
    };

    fetchData();
  }, [setPublishedCheckIn]);

  if (loading) {
    return <Loading />;
  }
  return (
    <Container>
      {publishedCheckIn.questions.length > 0 ? (
        <>
          <Heading>Check-in available</Heading>
          <Flex flexDirection="column">
            {publishedCheckIn.questions?.map((quesetion, index) => (
              <FormFactory key={index} question={quesetion} />
            ))}
          </Flex>
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={handleFetch}>test</Button>

        </>
      ) : (
        <>
          <Heading>No Check-in available</Heading>
        </>
      )}
    </Container>
  );
};

export default CheckInForm;
