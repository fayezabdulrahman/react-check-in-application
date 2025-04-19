import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Input,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Box
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAdminService from '../../hooks/services/useAdminService';
import { useEffect, useState } from 'react';
import QuestionCard from '../checkinBuilder/QuestionCard';
import useCheckInStore from '../../store/checkin-store';

const EditCheckInModal = () => {
  const { updateCheckIn } = useAdminService();
  const toast = useToast();
  const queryClient = useQueryClient();

  const submittedCheckInToEdit = useCheckInStore(
    (state) => state.submittedCheckInToEdit
  );
  const toggleEditModal = useCheckInStore((state) => state.toggleEditModal);
  const setToggleEditModal = useCheckInStore(
    (state) => state.setToggleEditModal
  );


  const [checkInName, setCheckInName] = useState('');

  useEffect(() => {
    if (submittedCheckInToEdit?.checkInId) {
      setCheckInName(submittedCheckInToEdit.checkInId);
    }
  }, [submittedCheckInToEdit]);

  const { mutate: updateCheckInMutate, isPending } = useMutation({
    mutationFn: updateCheckIn,
    onSuccess: (response) => {
      toast({
        title: response.message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      queryClient.invalidateQueries(['allAdminCheckIn']);
      queryClient.invalidateQueries(['publishedCheckin']);

      setToggleEditModal();
    },
    onError: (error) => {
      toast({
        title: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const handleSave = () => {
    const finalEdittedCheckIn = {
      ...submittedCheckInToEdit,
      questions: submittedCheckInToEdit?.questions
    };
    const payload = {
      originalCheckInId: submittedCheckInToEdit.checkInId,
      checkInToEdit: {
        ...finalEdittedCheckIn,
        checkInId: checkInName.trim() || submittedCheckInToEdit.checkInId
      }
    };
    updateCheckInMutate(payload);
  };

  return (
    <Modal isOpen={toggleEditModal} onClose={setToggleEditModal} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.100">
          Edit Check-in
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <Stack spacing={5}>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600" mb={1}>
                Check-in Name
              </FormLabel>
              <Input
                value={checkInName}
                onChange={(e) => setCheckInName(e.target.value)}
                placeholder="Update your check-in name (optional)"
              />
            </FormControl>

            <Box>
              <FormLabel fontSize="sm" color="gray.600" mb={2}>
                Questions ({submittedCheckInToEdit?.questions?.length})
              </FormLabel>
              {submittedCheckInToEdit?.questions?.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.100">
          <Button
            variant="ghost"
            colorScheme="blue"
            mr={3}
            onClick={setToggleEditModal}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            variant="outline"
            isLoading={isPending}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCheckInModal;
