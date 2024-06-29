import { Container, useToast, Heading } from '@chakra-ui/react';
import FormFactory from '../shared/FormFactory';
import { client } from '../../util/axios-util';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserProvider';
import Loading from '../shared/Loading';
import { useAuth } from '../../context/AuthProvider';

const CheckInForm = () => {
  const {
    setPublishedCheckIn,
    publishedCheckIn,
    questionResponse,
    setQuestionResponse
  } = useUser();

  const [loading, setLoading] = useState(true);
  const { userState } = useAuth();
  const [answeredCheckIn, setAnsweredCheckIn] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const submitCheckInApiCall = async () => {
      if (!questionResponse.submittedBy) return;
      try {
        console.log('submit question response', questionResponse);
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
        setAnsweredCheckIn(responseServer.data.answered);
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

  function callApi() {
    setQuestionResponse((prevState) => ({
      ...prevState,
      checkInId: publishedCheckIn.checkInId,
      submittedBy: userState.firstName + ' ' + userState.lastName
    }));
  }

  // call api to fetch publishedcheckIn and check if user already answered the check-in
  useEffect(() => {
    const fetchPublishedCheckin = async () => {
      await client
        .get('/admin/publishedCheckin')
        .then((response) => {
          console.log('response from server', response.data);
          const serverResponse = response.data;
          if (serverResponse.checkIn !== null) {
            console.log('fetched published checkin, ', response.data);
            const publishedCheckInDB = serverResponse.checkIn;
            setPublishedCheckIn(publishedCheckInDB);
          }
        })
        .catch((error) => {
          console.log('error fetching published check-in', error);
        });
    };

    const fetchAnsweredCheckIn = async () => {
      const payload = {
        firstName: userState.firstName,
        lastName: userState.lastName
      };
      await client
        .post('/user/answeredCheckIn', payload)
        .then((response) => {
          const serverResponse = response.data;
          if (serverResponse.existingCheckIn !== null) {
            console.log('You already entered a check-in response');
            const userSubmittedCheckIn = response.data.existingCheckIn;
            setAnsweredCheckIn(userSubmittedCheckIn.answered);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const fetchData = async () => {
      await fetchPublishedCheckin();
      await fetchAnsweredCheckIn();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <Container>
      {publishedCheckIn.questions.length > 0 && !answeredCheckIn && (
        <>
          <Heading>Check-in available</Heading>
          <FormFactory publishedCheckIn={publishedCheckIn} onSubmit={callApi} />
        </>
      )}
      {publishedCheckIn.questions &&
        publishedCheckIn.questions.length === 0 &&
        !answeredCheckIn && (
          <>
            <Heading>No Check-in available</Heading>
          </>
        )}
      {answeredCheckIn && (
        <>
          <Heading>Your response was submitted! Thank you</Heading>
        </>
      )}
    </Container>
  );
};

export default CheckInForm;
