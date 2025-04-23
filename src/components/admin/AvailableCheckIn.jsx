import {
  Text,
  Heading,
  useToast,
  Box,
  Grid,
  Flex,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { IoMdRefresh } from 'react-icons/io';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CreatedCheckInCard from './CreatedCheckInCard';
import useAdminService from '../../hooks/services/useAdminService';
import useCheckInStore from '../../store/checkin-store';
import ErrorMessage from '../shared/ErrorMesssage';
import SkeletonLoader from '../shared/SkeletonLoader';

const AvailableCheckIn = () => {
  const {
    fetchAllAdminCheckIn,
    publishNewCheckIn,
    unPublishCheckIn,
    deleteCheckIn
  } = useAdminService();

  const openDeleteModal = useCheckInStore((state) => state.openDeleteModal);

  const resetAdminAction = useCheckInStore((state) => state.resetAdminAction);

  const queryCleint = useQueryClient();

  const toast = useToast();

  const { data, isFetching, isLoading, error, refetch } = useQuery({
    queryKey: ['allAdminCheckIn'],
    queryFn: fetchAllAdminCheckIn,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  const { mutate: publishCheckInMutate } = useMutation({
    mutationFn: publishNewCheckIn,
    onSuccess: (response) => {
      const message = response.message;

      if (response.checkIn) {
        // reset performing action
        resetAdminAction();

        // refetch data
        queryCleint.refetchQueries({ queryKey: ['allAdminCheckIn'] });
      }

      toast({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onError: (error) => {
      // reset performing action
      resetAdminAction();
      toast({
        title: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const { mutate: unPublishCheckInMutate } = useMutation({
    mutationFn: unPublishCheckIn,
    onSuccess: (response) => {
      const message = response.message;
      if (response.checkIn) {
        // reset performing action
        resetAdminAction();
        // refetch data
        queryCleint.refetchQueries({ queryKey: ['allAdminCheckIn'] });
      }

      toast({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onError: (error) => {
      // reset performing action
      resetAdminAction();
      console.error(error);
      toast({
        title: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const { mutate: deleteCheckInMutate } = useMutation({
    mutationFn: deleteCheckIn,
    onSuccess: (response) => {
      const message = response.message;

      // refetch data
      queryCleint.refetchQueries({ queryKey: ['allAdminCheckIn'] });
      toast({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      // reset performing action
      resetAdminAction();
    },
    onError: (error) => {
      // reset performing action
      resetAdminAction();
      toast({
        title: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const handlePublishCheckIn = (payload) => {
    // Call mutate() to trigger API call
    publishCheckInMutate(payload);
  };

  const handleUnPublishCheckIn = (payload) => {
    // Call mutate() to trigger API call
    unPublishCheckInMutate(payload);
  };

  const handleDeleteCheckIn = (checkInId) => {
    openDeleteModal({
      id: checkInId,
      header: `Delete ${checkInId.checkInToDelete}`,
      body: 'Are you sure you want to Delete this Check-in ? This removes it for all admin users.',
      onConfirm: (payload) => deleteCheckInMutate(payload)
    });
  };

  if (isLoading || isFetching) {
    return <SkeletonLoader />;
  }
  if (error) {
    toast({
      title: 'Failed to load all created check in',
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
    <Box mt={4} pt={4} px={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" mb={4} fontWeight="500" color="gray.700">
          My Check-ins
          <Text fontSize="sm" color="gray.500" mt={1} fontWeight="normal">
            Manage your check-in forms
          </Text>
        </Heading>

        {data?.checkIns?.length > 0 && (
          <Tooltip label='Refresh'>
            <IconButton
              aria-label="Refresh check-ins"
              icon={<IoMdRefresh />}
              onClick={refetch}
              variant="ghost"
              colorScheme="gray"
            />
          </Tooltip>
        )}
      </Flex>

      {data?.checkIns?.length === 0 ? (
        <Box
          textAlign="center"
          p={8}
          borderRadius="lg"
          border="1px dashed"
          borderColor="gray.100"
          bg="white"
        >
          <Text color="gray.500" mb={2}>
            No Check-in forms created !
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
          {data?.checkIns?.map((available, index) => (
            <Box
              key={index}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              <CreatedCheckInCard
                availableCheckIn={available}
                publishCheckIn={handlePublishCheckIn}
                unPublishCheckIn={handleUnPublishCheckIn}
                deleteCheckIn={handleDeleteCheckIn}
              />
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AvailableCheckIn;
