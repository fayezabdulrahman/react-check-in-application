import { Text, Heading, useToast, Box, Grid } from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import { useState } from 'react';
import Loading from '../shared/Loading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CreatedCheckInCard from './CreatedCheckInCard';
import { INITIAL_PERFORMING_ACTION_STATE } from '../../constants/application';
import PopUpModal from '../shared/PopUpModal';
import useAdminService from '../../hooks/services/useAdminService';
import useCheckInStore from '../../store/checkin-store';
const AvailableCheckIn = () => {
  const { setPerformingAdminAction } = useAdmin();
  const {
    fetchAllAdminCheckIn,
    publishNewCheckIn,
    unPublishCheckIn,
    deleteCheckIn
  } = useAdminService();

  const setPublishedCheckIn = useCheckInStore(
    (state) => state.setPublishedCheckIn
  );
  const setCheckInResponses = useCheckInStore(
    (state) => state.setCheckInResponses
  );

  const queryCleint = useQueryClient();

  const toast = useToast();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [deleteCheckInPayload, setDeleteCheckInPayload] = useState(null);
  const modalConfig = {
    modalHeader: 'Deleting Checkin',
    modalBody: 'Deleting this will delete for all admin users.'
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['allAdminCheckIn'],
    queryFn: fetchAllAdminCheckIn,
    meta: {
      ErrorMessage: 'failed to fetch all admin checkins'
    },
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  const { mutate: publishCheckInMutate } = useMutation({
    mutationFn: publishNewCheckIn,
    onSuccess: (response) => {
      const message = response.message;
      // if we get a successful response, set cache and update state
      if (response.checkIn) {
        const serverPublishedCheckIn = response.checkIn;
        console.log('response from publishing ', serverPublishedCheckIn);

        // set new state
        setPublishedCheckIn(serverPublishedCheckIn);

        // reset performing action
        setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);

        // invalidate cache and refetch
        queryCleint.invalidateQueries({ queryKey: ['allAdminCheckIn'] });
        queryCleint.invalidateQueries({ queryKey: ['publishedCheckin'] });
        queryCleint.invalidateQueries({
          queryKey: ['publishedCheckinAnalytics']
        });
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
      setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);
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
      // if we get a successfull response, remove cache and update state
      if (response.checkIn) {
        console.log('response.checkIn is valid ', response.checkIn);

        // reset state
        setPublishedCheckIn(null);
        setCheckInResponses([]);

        // reset performing action
        setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);
        // invalidate cache and refetch
        queryCleint.invalidateQueries({ queryKey: ['allAdminCheckIn'] });
        queryCleint.invalidateQueries({
          queryKey: ['publishedCheckinAnalytics']
        });
        queryCleint.refetchQueries({ queryKey: ['publishedCheckin'] });
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
      setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);
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

      // invalidate cache and refetch
      queryCleint.invalidateQueries({ queryKey: ['allAdminCheckIn'] });
      toast({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      // reset performing action
      setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);
    },
    onError: (error) => {
      // reset performing action
      setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);
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

  const handleDeleteCheckIn = (payload, modalConfirmationStatus) => {
    if (!openConfirmationModal) {
      setDeleteCheckInPayload(payload);
      console.log('open confirmation modal');

      // open confirmation modal first
      setOpenConfirmationModal(true);
    }
    if (modalConfirmationStatus) {
      console.log('calling delete api with payload', deleteCheckInPayload);
      // Call mutate() to trigger API call
      deleteCheckInMutate(deleteCheckInPayload);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    toast({
      title: 'Failed to load all created check in',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
  }

  return (
    <Box mt={8} px={{ base: 4, md: 8 }}>
      <Heading size="md" mb={4} fontWeight="500" color="gray.700">
        My Check-ins
        <Text fontSize="sm" color="gray.500" mt={1} fontWeight="normal">
          Manage your check-in forms
        </Text>
      </Heading>

      {data?.checkins?.length === 0 ? (
        <Box
          textAlign="center"
          p={8}
          borderRadius="lg"
          border="1px dashed"
          borderColor="gray.100"
          bg="white"
        >
          <Text color="gray.500" mb={2}>
            No Check-in forms created yet
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

      <PopUpModal
        openModal={openConfirmationModal}
        modalConfig={modalConfig}
        onConfirm={(output) => handleDeleteCheckIn(null, output)}
        onClose={() => setOpenConfirmationModal(false)}
      />
    </Box>
  );
};

export default AvailableCheckIn;
