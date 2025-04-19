import { Box, Text, useToast } from '@chakra-ui/react';
import Loading from '../shared/Loading';
import usePublishedCheckInQuery from '../../hooks/usePublishedCheckInQuery';
import PublishedAnalytics from './PublishedAnalytics';
import useCheckInStore from '../../store/checkin-store';
import { useEffect } from 'react';

const PublishedCheckIn = () => {
  // calls to check if we have a published check-in from the api
  const { data, isLoading, error } = usePublishedCheckInQuery();
  const publishedCheckIn = useCheckInStore((state) => state.publishedCheckIn);
  const setPublishedCheckIn = useCheckInStore(
    (state) => state.setPublishedCheckIn
  );

  const toast = useToast();

  // if we have a check-in from our backend and our store is empty
  // set the store to the published check-in from our backend
  useEffect(() => {
    if (data?.checkIn && !publishedCheckIn) {
      setPublishedCheckIn(data.checkIn);
    }
  }, [data, publishedCheckIn, setPublishedCheckIn]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    console.error(error);
    toast({
      title:
        error.response?.data?.message ||
        'An error occurred while fetching published check-in',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
  }
  return (
    <>
      {!data?.checkIn && (
        <Box
          width="100%"
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
          p={8}
          textAlign="center"
        >
          <Text fontSize="lg" color="gray.500">
            No check-in currently published
          </Text>
          <Text mt={2} fontSize="sm" color="gray.400">
            Publish a check-in to view responses
          </Text>
        </Box>
      )}
      {data?.checkIn && <PublishedAnalytics />}
    </>
  );
};

export default PublishedCheckIn;
