import { Box, Grid, Heading, Text, useToast } from '@chakra-ui/react';
import Loading from '../shared/Loading';
import { useQuery } from '@tanstack/react-query';
import useUserService from '../../hooks/services/useUserService';
import { useLocalAuth } from '../../context/LocalAuthProvider';
import UserSubmittedCheckInCard from './UserSubmittedCheckInCard';
import ErrorMessage from '../shared/ErrorMesssage';
const SubmittedCheckIn = () => {
  const { fetchAllUserSubmittedCheckIns } = useUserService();
  const toast = useToast();
  const { userDetails } = useLocalAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['allUserSubmittedCheckin'],
    queryFn: fetchAllUserSubmittedCheckIns,
    enabled: !!userDetails,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });


  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    toast({
      title: 'Failed to fetch Submitted Check-ins',
      description: error.response?.data?.message || 'An error occurred',
      status: 'error',
      duration: 3000,
      isClosable: true
    });

    return (
      <>
        <Box mt={8}>
          <ErrorMessage onRetry={refetch} />
        </Box>
      </>
    );
  }

  return (
    <Box mt={8} px={{ base: 4, md: 8 }}>
      <Heading size="md" mb={4} fontWeight="500" color="gray.700">
        My Check-ins
        <Text fontSize="sm" color="gray.500" mt={1} fontWeight="normal">
          View your Submitted Check-ins
        </Text>
      </Heading>

      {data?.submittedCheckIns?.length === 0 ? (
        <Box
          textAlign="center"
          p={8}
          borderRadius="lg"
          border="1px dashed"
          borderColor="gray.100"
          bg="white"
        >
          <Text color="gray.500" mb={2}>
            No submissions Found. Complete a Check-in to see it here!
          </Text>
        </Box>
      ) : (
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)'
          }}
          gap={6}
          paddingBottom={6}
        >
          {data?.submittedCheckIns?.map((available, index) => (
            <Box
              key={index}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              <UserSubmittedCheckInCard userSubmittedCheckIn={available} />
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SubmittedCheckIn;
