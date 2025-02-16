import { Container, Heading, useToast } from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import { useEffect, useState } from 'react';
import Loading from '../shared/Loading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteCheckIn,
  fetchAllAdminCheckIn,
  publishNewCheckIn,
  unPublishCheckIn
} from '../../services/adminService';
import CreatedCheckInCard from './CreatedCheckInCard';
import { INITIAL_PERFORMING_ACTION_STATE } from '../../constants/application';
import LocalStorageService from '../../util/LocalStorageService';
import PopUpModal from '../shared/PopUpModal';

const AvailableCheckIn = () => {
  const {
    submittedCheckIns,
    setSubmittedCheckIns,
    setPublishedCheckIn,
    setPerformingAdminAction
  } = useAdmin();

  const queryCleint = useQueryClient();

  const toast = useToast();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [deleteCheckInPayload, setDeleteCheckInPayload] = useState(null);
  const modalConfig = {
    modalHeader: 'Deleting Checkin',
    modalBody: 'Deleting this will delete for all users.'
  };

  const {
    data: allAdminCheckInData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['allAdminCheckIn'],
    queryFn: fetchAllAdminCheckIn
  });

  const { mutate: publishCheckInMutate } = useMutation({
    mutationFn: publishNewCheckIn,
    onSuccess: (response) => {
      const message = response.message;
      // if we get a successful response, set cache and update state
      if (response.checkIn) {
        const serverPublishedCheckIn = response.checkIn;
        // set new state
        setPublishedCheckIn(serverPublishedCheckIn);
        // reset performing action
        setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);

        // invalidate cache and refetch
        queryCleint.invalidateQueries({ queryKey: ['allAdminCheckIn'] });

        // remove old cache for analytics first
        LocalStorageService.removeItem('publishedCheckInAnalytics');
        // set new cache for published check-in
        LocalStorageService.setItem('publishedCheckIn', serverPublishedCheckIn);
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
        LocalStorageService.removeItem('publishedCheckInAnalytics');
        LocalStorageService.removeItem('publishedCheckIn');
        const serverPublishedCheckIn = response.checkIn;
        setPublishedCheckIn(serverPublishedCheckIn);

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

  const { mutate: deleteCheckInMutate } = useMutation({
    mutationFn: deleteCheckIn,
    onMutate: (payload) => {
      const isPublishedCheckIn =
        LocalStorageService.getItem('publishedCheckIn');
      if (isPublishedCheckIn) {
        // check if deleted check in is the published one
        const publishedCheckInId = isPublishedCheckIn.publishCheckIn;
        if (payload.checkInToDelete === publishedCheckInId) {
          // we need to remove the local storage and analytical check
          // gets sent as context to onSuccess
          return { removeLocalStorage: true };
        }
      }
    },
    onSuccess: (response, context) => {
      const message = response.message;
      // reset performing action
      setPerformingAdminAction(INITIAL_PERFORMING_ACTION_STATE);

      if (context?.removeLocalStorage) {
        LocalStorageService.removeItem('publishedCheckInAnalytics');
        LocalStorageService.removeItem('publishedCheckIn');
      }

      // invalidate cache and refetch
      queryCleint.invalidateQueries({ queryKey: ['allAdminCheckIn'] });
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
    <Container>
      <Heading> Your Created Check-ins</Heading>
      {submittedCheckIns?.map((available, index) => (
        <CreatedCheckInCard
          availableCheckIn={available}
          publishCheckIn={(payload) => handlePublishCheckIn(payload)}
          unPublishCheckIn={(payload) => handleUnPublishCheckIn(payload)}
          deleteCheckIn={(payload) => handleDeleteCheckIn(payload, null)}
          key={index}
        />
      ))}
      <PopUpModal
        openModal={openConfirmationModal}
        modalConfig={modalConfig}
        onConfirm={(output) => handleDeleteCheckIn(null, output)}
        onClose={() => setOpenConfirmationModal(false)}
      />
    </Container>
  );
};

export default AvailableCheckIn;
