import { Container, useToast, Heading } from '@chakra-ui/react';
import FormFactory from '../shared/FormFactory';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserProvider';
import Loading from '../shared/Loading';
import { useAuth } from '../../context/AuthProvider';
import { useQuery, useMutation } from '@tanstack/react-query';
import { INTIAL_CHECKIN_STATE } from '../../constants/application';
import {
  fetchAnsweredCheckin,
  fetchPublishedCheckin,
  submitCheckIn
} from '../../services/userService';

const CheckInForm = () => {
  const {
    setPublishedCheckIn,
    publishedCheckIn,
    questionResponse,
    setQuestionResponse
  } = useUser();

  const { userState } = useAuth();
  const [answeredCheckIn, setAnsweredCheckIn] = useState(false);
  const toast = useToast();

  const {
    data: publishedCheckinData,
    isPending: publishedCheckinIsPending,
    error: PublishedCheckinError
  } = useQuery({
    queryKey: ['publishedCheckin'],
    queryFn: fetchPublishedCheckin
  });

  const {
    data: answeredCheckinData,
    isFetching: answeredCheckinIsFetching,
    error: answeredCheckinError
  } = useQuery({
    queryKey: ['answeredCheckin'],
    queryFn: fetchAnsweredCheckin,
    enabled: !!publishedCheckinData?.checkIn
  });

  const {
    mutate: submitUserCheckinMutate,
    isPending: submitUserCheckinIsPending
  } = useMutation({
    mutationFn: submitCheckIn, // Calls API only when triggered
    onSuccess: (response) => {
      console.log('Submission successful:', response);
      toast({
        title: 'Check-in submitted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      setAnsweredCheckIn(true);
    },
    onError: (error) => {
      console.error('Error submitting check-in:', error);
      toast({
        title: 'Submission failed!',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  // Update published check-in state when data is available
  useEffect(() => {
    if (publishedCheckinData?.checkIn) {
      setPublishedCheckIn(publishedCheckinData.checkIn);
    } else {
      setPublishedCheckIn(INTIAL_CHECKIN_STATE);
    }
  }, [publishedCheckinData, publishedCheckIn, setPublishedCheckIn]);

  // Update answered check-in state when data is available
  useEffect(() => {
    if (answeredCheckinData?.existingCheckIn) {
      setAnsweredCheckIn(answeredCheckinData?.existingCheckIn?.answered);
    }
  }, [answeredCheckinData, publishedCheckIn]);

  if (publishedCheckinIsPending) {
    return <Loading />;
  }
  if (PublishedCheckinError) {
    toast({
      title: 'An error occured.',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
    return <p>Failed to fetch published check in. Please try again later...</p>;
  }

  if (answeredCheckinIsFetching) {
    return <Loading />;
  }

  if (answeredCheckinError) {
    toast({
      title: 'An error occured.',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
    return <p>Failed to fetch answered check in. Please try again later...</p>;
  }

  console.log('answered check in data', answeredCheckinData);
  console.log('published check in response', publishedCheckinData);
  console.log('check in state', publishedCheckIn);
  console.log('answered boolean ', answeredCheckIn);

  if (submitUserCheckinIsPending) {
    return <Loading />;
  }

  function submitDetails() {
    const updatedResponse = {
      ...questionResponse,
      checkInId: publishedCheckIn.checkInId,
      submittedBy: userState.firstName + ' ' + userState.lastName
    };
    setQuestionResponse(() => ({
      updatedResponse
    }));

    // Call mutate() to trigger API call
    submitUserCheckinMutate(updatedResponse);
  }

  return (
    <Container>
      {publishedCheckIn?.questions.length > 0 && !answeredCheckIn && (
        <>
          <Heading>Check-in available</Heading>
          <FormFactory
            publishedCheckIn={publishedCheckIn}
            onSubmit={submitDetails}
          />
        </>
      )}
      {publishedCheckIn?.questions?.length === 0 && !answeredCheckIn && (
        <>
          <Heading>No Check-in available</Heading>
        </>
      )}
      {publishedCheckIn?.questions?.length > 0 && answeredCheckIn && (
        <>
          <Heading>Your response was submitted! Thank you</Heading>
        </>
      )}
    </Container>
  );
};

export default CheckInForm;
