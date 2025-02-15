import { Container, useToast, Heading } from '@chakra-ui/react';
import FormFactory from '../shared/FormFactory';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '../../context/UserProvider';
import Loading from '../shared/Loading';
import { useAuth } from '../../context/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { INTIAL_CHECKIN_STATE } from '../../constants/application';
import {
  fetchAnsweredCheckin,
  submitCheckIn
} from '../../services/userService';
import LocalStorageService from '../../util/LocalStorageService';
import usePublishedCheckInQuery from '../../hooks/usePublishedCheckInQuery';

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
  const hasFetchedPublishedCheckin = useRef(false); // Prevent duplicate calls
  const queryClient = useQueryClient();

  const {
    data: publishedCheckinData,
    isPending: publishedCheckinIsPending,
    error: PublishedCheckinError
  } = usePublishedCheckInQuery();

  const {
    data: answeredCheckinData,
    isFetching: answeredCheckinIsFetching,
    error: answeredCheckinError
  } = useQuery({
    queryKey: ['answeredCheckin'],
    queryFn: fetchAnsweredCheckin,
    enabled: !!publishedCheckinData?.checkIn && !answeredCheckIn,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
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
      queryClient.invalidateQueries({queryKey: ['answeredCheckin']});
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
    if (hasFetchedPublishedCheckin.current === true) {
      const publishedCheckInInLocalStorage =
        LocalStorageService.getItem('publishedCheckIn');
      if (publishedCheckInInLocalStorage) {
        setPublishedCheckIn(publishedCheckInInLocalStorage);
      } else if (publishedCheckinData?.checkIn) {
        console.log('save published check in to local storage');
        setPublishedCheckIn(publishedCheckinData.checkIn);
        LocalStorageService.setItem(
          'publishedCheckIn',
          publishedCheckinData.checkIn
        );
      } else {
        console.log('inside else block');
        setPublishedCheckIn(INTIAL_CHECKIN_STATE);
      }
    }

    return () => {
      hasFetchedPublishedCheckin.current = true; // Mark as fetched
    };
  }, [publishedCheckinData, setPublishedCheckIn]);

  // Update answered check-in state when data is available
  useEffect(() => {
    if (answeredCheckinData?.existingCheckIn) {
      setAnsweredCheckIn(answeredCheckinData?.existingCheckIn?.answered);
    }
  }, [answeredCheckinData]);

  if (PublishedCheckinError) {
    toast({
      title: 'An error occured.',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
    return <p>Failed to fetch published check in. Please try again later...</p>;
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

  if (
    publishedCheckinIsPending ||
    answeredCheckinIsFetching ||
    submitUserCheckinIsPending
  ) {
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

  console.log('published check in state', publishedCheckIn);
  console.log('published check in data api call', publishedCheckinData);

  return (
    <Container>
      {publishedCheckIn?.questions?.length > 0 && answeredCheckIn && (
        <>
          <Heading>Your response was submitted! Thank you</Heading>
        </>
      )}

      {publishedCheckIn?.questions?.length === 0 && !answeredCheckIn && (
        <>
          <Heading>No Check-in available</Heading>
        </>
      )}
      {publishedCheckIn?.questions?.length > 0 && !answeredCheckIn && (
        <>
          <Heading>Check-in available</Heading>
          <FormFactory
            publishedCheckIn={publishedCheckIn}
            onSubmit={submitDetails}
          />
        </>
      )}
    </Container>
  );
};

export default CheckInForm;
