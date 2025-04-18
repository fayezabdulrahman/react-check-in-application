import {
  useToast,
  Heading,
  Card,
  CardBody,
  Flex,
  Icon,
  Text,
  Progress
} from '@chakra-ui/react';
import FormFactory from '../shared/FormFactory';
import { useEffect, useState } from 'react';
import Loading from '../shared/Loading';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useUserService from '../../hooks/services/useUserService';
import usePublishedCheckInQuery from '../../hooks/usePublishedCheckInQuery';
import { CiTimer, CiCircleCheck } from 'react-icons/ci';
import { useAuth0 } from '@auth0/auth0-react';
import useCheckInStore from '../../store/checkin-store';

const CheckInForm = () => {
  const setUserCheckInAnswers = useCheckInStore(
    (state) => state.setUserCheckInAnswers
  );
  const userCheckInAnswers = useCheckInStore(
    (state) => state.userCheckInAnswers
  );

  const { fetchAnsweredCheckin, submitCheckIn } = useUserService();
  const { user } = useAuth0();
  const [answeredCheckIn, setAnsweredCheckIn] = useState(false);
  const toast = useToast();
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
      // TODO Figure out why allUserSubmittedCheckin is not invalidating!!!!
      queryClient.invalidateQueries({
        queryKey: ['answeredCheckin']
      });
      queryClient.invalidateQueries({
        queryKey: ['allUserSubmittedCheckin']
      });
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

  // Update answered check-in state when data is available
  useEffect(() => {
    if (answeredCheckinData?.existingCheckIn) {
      setAnsweredCheckIn(answeredCheckinData?.existingCheckIn?.answered);
    }
  }, [answeredCheckinData]);

  useEffect(() => {
    if (userCheckInAnswers.submittedBy) {
      // Call mutate() to trigger API call
      submitUserCheckinMutate(userCheckInAnswers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCheckInAnswers]);

  if (PublishedCheckinError) {
    toast({
      title: 'An error occured while fetching the active check-in.',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
    return <p>Failed to fetch published check in. Please try again later...</p>;
  }

  if (answeredCheckinError) {
    toast({
      title: 'An error occured while fetching an answered check-in.',
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
    setUserCheckInAnswers({
      checkInId: publishedCheckinData.checkIn.checkInId,
      submittedBy: user?.nickname
    });
  }
  console.log('published check in data api call', publishedCheckinData);

  return (
    <Card variant="outline" boxShadow="md">
      <CardBody>
        {publishedCheckinIsPending ? (
          <Flex direction="column" align="center" p={8}>
            <Progress size="xs" isIndeterminate w="100%" />
            <Text mt={4}>Checking for active check-ins...</Text>
          </Flex>
        ) : (
          <>
            {answeredCheckIn && (
              <Flex direction="column" align="center" gap={4} py={8}>
                <Icon as={CiCircleCheck} boxSize={12} color="green.500" />
                <Heading size="lg">Response Submitted!</Heading>
                <Text color="gray.600">
                  Thank you for completing the latest check-in
                </Text>
              </Flex>
            )}

            {publishedCheckinData?.checkIn === null && !answeredCheckIn && (
              <Flex direction="column" align="center" gap={4} py={8}>
                <Icon as={CiTimer} boxSize={12} color="gray.400" />
                <Heading size="md">No Active Check-in</Heading>
                <Text color="gray.500">
                  Check back later for new check-ins!
                </Text>
              </Flex>
            )}

            {publishedCheckinData?.checkIn?.questions?.length > 0 &&
              !answeredCheckIn && (
                <Flex direction="column" gap={6}>
                  <FormFactory
                    publishedCheckIn={publishedCheckinData.checkIn}
                    onSubmit={submitDetails}
                  />
                </Flex>
              )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default CheckInForm;
