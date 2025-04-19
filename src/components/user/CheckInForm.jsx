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
import { useEffect } from 'react';
import Loading from '../shared/Loading';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useUserService from '../../hooks/services/useUserService';
import usePublishedCheckInQuery from '../../hooks/usePublishedCheckInQuery';
import { CiTimer, CiCircleCheck } from 'react-icons/ci';
import useCheckInStore from '../../store/checkin-store';

const CheckInForm = () => {
  const setUserCheckInAnswers = useCheckInStore(
    (state) => state.setUserCheckInAnswers
  );
  const userCheckInAnswers = useCheckInStore(
    (state) => state.userCheckInAnswers
  );

  const userAnsweredCheckIn = useCheckInStore(
    (state) => state.userAnsweredCheckIn
  );
  const setUserAnsweredCheckIn = useCheckInStore(
    (state) => state.setUserAnsweredCheckIn
  );

  const { fetchAnsweredCheckin, submitCheckIn } = useUserService();
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
    enabled: !!publishedCheckinData?.checkIn && !userAnsweredCheckIn,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  const {
    mutate: submitUserCheckinMutate,
    isPending: submitUserCheckinIsPending
  } = useMutation({
    mutationFn: submitCheckIn, // Calls API only when triggered
    onSuccess: () => {
      toast({
        title: 'Check-in submitted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      setUserAnsweredCheckIn(true);
      // refresh queries
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
      setUserAnsweredCheckIn(answeredCheckinData?.existingCheckIn?.answered);
    }
  }, [answeredCheckinData, setUserAnsweredCheckIn]);

  useEffect(() => {
    if (publishedCheckinData?.checkIn) {
      publishedCheckinData.checkIn.checkInId;
      setUserCheckInAnswers({
        checkInId: publishedCheckinData.checkIn.checkInId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedCheckinData]);

  useEffect(() => {
    if (userCheckInAnswers.answers.length > 0 && !userAnsweredCheckIn) {
      // call mutate api
      submitUserCheckinMutate(userCheckInAnswers);
    }
  }, [userCheckInAnswers, userAnsweredCheckIn, submitUserCheckinMutate]);

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

  const submitDetails = (answers) => {
    // set the userCheckInAnswers and then the useEffect will trigger the api call
    setUserCheckInAnswers({ answers: answers });
  };

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
            {userAnsweredCheckIn && (
              <Flex direction="column" align="center" gap={4} py={8}>
                <Icon as={CiCircleCheck} boxSize={12} color="green.500" />
                <Heading size="lg">Response Submitted!</Heading>
                <Text color="gray.600">
                  Thank you for completing the latest check-in
                </Text>
              </Flex>
            )}

            {publishedCheckinData?.checkIn === null && !userAnsweredCheckIn && (
              <Flex direction="column" align="center" gap={4} py={8}>
                <Icon as={CiTimer} boxSize={12} color="gray.400" />
                <Heading size="md">No Active Check-in</Heading>
                <Text color="gray.500">
                  Check back later for new check-ins!
                </Text>
              </Flex>
            )}

            {publishedCheckinData?.checkIn?.questions?.length > 0 &&
              !userAnsweredCheckIn && (
                <Flex direction="column" gap={6}>
                  <Heading size={'md'}>
                    Check-in available {publishedCheckinData.checkIn.checkInId}
                  </Heading>
                  <FormFactory
                    publishedCheckIn={publishedCheckinData.checkIn}
                    onSubmit={(answers) => submitDetails(answers)}
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
