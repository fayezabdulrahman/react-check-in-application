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
import Loading from '../shared/Loading';
import { useQuery } from '@tanstack/react-query';
import useUserService from '../../hooks/services/useUserService';
import { CiTimer, CiCircleCheck } from 'react-icons/ci';
import UserCheckInCard from './UserCheckInCard';
import ErrorMessage from '../shared/ErrorMesssage';
const AvailableUserCheckIn = () => {
  const { fetchAllUserCheckIns } = useUserService();

  const {
    data: allUserCheckIns,
    isFetching: allUserCheckInsIsFetching,
    error: allUserCheckInsError,
    refetch
  } = useQuery({
    queryKey: ['allUserCheckIns'],
    queryFn: fetchAllUserCheckIns,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  if (allUserCheckIns) {
    console.log(
      'new api response for all published check ins',
      allUserCheckIns
    );
  }

  if (allUserCheckInsError) {
    return <ErrorMessage onRetry={refetch} />;
  }
  if (allUserCheckInsIsFetching) {
    return <Loading />;
  }
  return (
    <Card variant="outline" boxShadow="md">
      <CardBody>
        {allUserCheckInsIsFetching ? (
          <Flex direction="column" align="center" p={8}>
            <Progress size="xs" isIndeterminate w="100%" />
            <Text mt={4}>Checking for active check-ins...</Text>
          </Flex>
        ) : (
          <>
            {!allUserCheckIns?.availableToSubmit?.length &&
              allUserCheckIns?.submitted?.length > 0 && (
                <Flex direction="column" align="center" gap={4} py={8}>
                  <Icon as={CiCircleCheck} boxSize={12} color="green.500" />
                  <Heading size="lg">Response Submitted!</Heading>
                  <Text color="gray.600">
                    Thank you for Completing the latest Check-in(s)
                  </Text>
                </Flex>
              )}

            {!allUserCheckIns?.availableToSubmit?.length &&
              !allUserCheckIns?.submitted?.length && (
                <Flex direction="column" align="center" gap={4} py={8}>
                  <Icon as={CiTimer} boxSize={12} color="gray.400" />
                  <Heading size="md">No Active Check-in</Heading>
                  <Text color="gray.500">
                    Check back later for new check-ins!
                  </Text>
                </Flex>
              )}

            {allUserCheckIns?.availableToSubmit?.length > 0 && (
              <Box p={4}>
                {/* Main Dashboard Heading */}
                <Heading size="lg" color="orange.500" mb={6}>
                  Check-in Dashboard
                </Heading>

                {/* Sub-heading */}
                <Heading size="md" color="gray.600" mb={4}>
                  You have {allUserCheckIns?.availableToSubmit?.length} Check-in
                  {allUserCheckIns?.availableToSubmit?.length !== 1
                    ? 's'
                    : ''}{' '}
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
                  {allUserCheckIns?.availableToSubmit?.map((checkIn) => (
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
