import { Text, Heading, useToast, Box, Grid } from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import { useEffect, useState } from 'react';
import Loading from '../shared/Loading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CreatedCheckInCard from './CreatedCheckInCard';
import { INITIAL_PERFORMING_ACTION_STATE } from '../../constants/application';
import LocalStorageService from '../../util/LocalStorageService';
import PopUpModal from '../shared/PopUpModal';
import useAdminService from '../../hooks/services/useAdminService';
import useAvailableCheckInQuery from '../../hooks/useAvailableCheckInQuery';
const AvailableCheckIn = () => {
  const {
    submittedCheckIns,
    setSubmittedCheckIns,
    setPublishedCheckIn,
    setPerformingAdminAction
  } = useAdmin();
  const {fetchAllAdminCheckIn, publishNewCheckIn, unPublishCheckIn, deleteCheckIn} = useAdminService();

  const queryCleint = useQueryClient();

  const toast = useToast();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [deleteCheckInPayload, setDeleteCheckInPayload] = useState(null);
  const modalConfig = {
    modalHeader: 'Deleting Checkin',
    modalBody: 'Deleting this will delete for all admin users.'
  };

  const {
    data: allAdminCheckInData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['allAdminCheckIn'],
    queryFn: fetchAllAdminCheckIn,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  const { mutate: publishCheckInMutate } = useMutation({
    mutationFn: publishNewCheckIn,
    onMutate: (payload) => {
      let contextToReturn = {};
      // const isPublishedCheckIn =
      // LocalStorageService.getItem('publishedCheckIn');
      // if (isPublishedCheckIn) {
      //   if (isPublishedCheckIn.checkInId !== payload.checkInToPublish) {
      //     contextToReturn['removeLocalStorage'] = true;
      //   }
      // }
      return contextToReturn; // Ensure context is never undefined
    },
    onSuccess: (response, payload, context) => {
      const message = response.message;
      // remove old cache first
      // if (context?.removeLocalStorage) {
      //   LocalStorageService.removeItem('publishedCheckInAnalytics');
      //   LocalStorageService.removeItem('publishedCheckIn');
      // }
      // if we get a successful response, set cache and update state
      if (response.checkIn) {
        const serverPublishedCheckIn = response.checkIn;
        console.log('response from publishing ', serverPublishedCheckIn);

        // set new state
        setPublishedCheckIn(serverPublishedCheckIn);
        // set new cache for published check-in
        // LocalStorageService.setItem('publishedCheckIn', serverPublishedCheckIn);
        // reset performing action
        setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);

        // invalidate cache and refetch
        queryCleint.invalidateQueries({ queryKey: ['allAdminCheckIn'] });
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
        // LocalStorageService.removeItem('publishedCheckInAnalytics');
        // LocalStorageService.removeItem('publishedCheckIn');

        // reset state
        setPublishedCheckIn(null);

        // reset performing action
        setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);
        // invalidate cache and refetch
        queryCleint.invalidateQueries({ queryKey: ['allAdminCheckIn'] });
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
    onMutate: (payload) => {
      let contextToReturn = {};
      const isPublishedCheckIn =
        LocalStorageService.getItem('publishedCheckIn');
      if (isPublishedCheckIn) {
        // check if deleted check in is the published one
        const publishedCheckInId = isPublishedCheckIn.checkInId;
        if (payload.checkInToDelete === publishedCheckInId) {
          // we need to remove the local storage and analytical check
          // gets sent as context to onSuccess
          contextToReturn['removeLocalStorage'] = true;
        }
      }
      return contextToReturn;
    },
    onSuccess: (response, payload, context) => {
      const message = response.message;

      if (context.removeLocalStorage) {
        LocalStorageService.removeItem('publishedCheckInAnalytics');
        LocalStorageService.removeItem('publishedCheckIn');

        // reset published check in state
        setPublishedCheckIn(null);
      }

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

  useEffect(() => {
    if (allAdminCheckInData?.checkIns) {
      setSubmittedCheckIns(allAdminCheckInData.checkIns);
    } else {
      setSubmittedCheckIns([]);
    }
  }, [setSubmittedCheckIns, allAdminCheckInData]);

  // Directly use query data instead of context state
  // const submittedCheckIns = allAdminCheckInData?.checkIns || [];


  useEffect(() => {
    if (error) {
      console.log('error loading all created check ins ', error);
      toast({
        title: 'Failed to load all created check in',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }


  return (
    <Box mt={8} px={{ base: 4, md: 8 }}>
      <Heading size="md" mb={4} fontWeight="500" color="gray.700">
        My Check-ins
        <Text fontSize="sm" color="gray.500" mt={1} fontWeight="normal">
          Manage your check-in forms
        </Text>
      </Heading>
  
      {submittedCheckIns?.length === 0 ? (
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
          {submittedCheckIns?.map((available, index) => (
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
