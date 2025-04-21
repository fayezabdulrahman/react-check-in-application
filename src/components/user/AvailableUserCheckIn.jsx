import {
  Heading,
  Card,
  CardBody,
  Flex,
  Icon,
  Text,
  Progress,
  Box,
  Grid
} from '@chakra-ui/react';
import { useEffect } from 'react';
import Loading from '../shared/Loading';
import { useQuery } from '@tanstack/react-query';
import useUserService from '../../hooks/services/useUserService';
import usePublishedCheckInQuery from '../../hooks/usePublishedCheckInQuery';
import { CiTimer, CiCircleCheck } from 'react-icons/ci';
import useCheckInStore from '../../store/checkin-store';
import UserCheckInCard from './UserCheckInCard';
import ErrorMessage from '../shared/ErrorMesssage';
const AvailableUserCheckIn = () => {
  const setUserCheckInAnswers = useCheckInStore(
    (state) => state.setUserCheckInAnswers
  );

  const userAnsweredCheckIn = useCheckInStore(
    (state) => state.userAnsweredCheckIn
  );
  const setUserAnsweredCheckIn = useCheckInStore(
    (state) => state.setUserAnsweredCheckIn
  );

  const { fetchAnsweredCheckin } = useUserService();

  const {
    data: publishedCheckinData,
    isPending: publishedCheckinIsPending,
    error: PublishedCheckinError,
    refetch
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

  // Update answered check-in state when data is available
  useEffect(() => {
    if (answeredCheckinData?.existingCheckIn) {
      setUserAnsweredCheckIn(answeredCheckinData?.existingCheckIn?.answered);
    }
  }, [answeredCheckinData, setUserAnsweredCheckIn]);

  useEffect(() => {
    if (publishedCheckinData?.checkIn.length > 0) {
      // TODO: REVIEW CODE BELOW WHEN WE ENABLE MULTI CHECK INS TO BE PUBLISHED
      setUserCheckInAnswers({
        checkInId: publishedCheckinData.checkIn[0].checkInId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedCheckinData]);

  if (PublishedCheckinError || answeredCheckinError) {
    return <ErrorMessage onRetry={refetch}/>;
  }
  if (publishedCheckinIsPending || answeredCheckinIsFetching) {
    return <Loading />;
  }
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

            {publishedCheckinData?.checkIn.length === 0 &&
              !userAnsweredCheckIn && (
                <Flex direction="column" align="center" gap={4} py={8}>
                  <Icon as={CiTimer} boxSize={12} color="gray.400" />
                  <Heading size="md">No Active Check-in</Heading>
                  <Text color="gray.500">
                    Check back later for new check-ins!
                  </Text>
                </Flex>
              )}

            {publishedCheckinData?.checkIn.length > 0 &&
              !userAnsweredCheckIn && (
                <Box p={4}>
                  {/* Main Dashboard Heading */}
                  <Heading size="lg" color="orange.500" mb={6}>
                    Check-in Dashboard
                  </Heading>

                  {/* Sub-heading */}
                  <Heading size="md" color="gray.600" mb={4}>
                    You have {publishedCheckinData.checkIn.length} check-in
                    {publishedCheckinData.checkIn.length !== 1 ? 's' : ''}{' '}
                    available
                  </Heading>
                  {/* Responsive Grid */}
                  <Grid
                    templateColumns={{
                      base: '1fr',
                      sm: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)'
                    }}
                    gap={4}
                  >
                    {publishedCheckinData.checkIn.map((checkIn) => (
                      <UserCheckInCard
                        key={checkIn.checkInId}
                        checkIn={checkIn}
                      />
                    ))}
                  </Grid>
                </Box>
              )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default AvailableUserCheckIn;
