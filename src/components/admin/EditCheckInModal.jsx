// EditCheckInModal.jsx
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
import QuestionsSummary from '../shared/QuestionsSummary';
import { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminProvider';
import QuestionCard from '../checkinBuilder/QuestionCard';
import { QuestionModal } from '../checkinBuilder/QuestionModal';
import { useCheckin } from '../../context/CheckinContext';

const EditCheckInModal = ({ isOpen, onClose, checkInId, onSuccess }) => {
  const { updateCheckIn } = useAdminService();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { submittedCheckIns, setSubmittedCheckIns } = useAdmin();
  const {submittedCheckInToEdit, formQuestions} = useCheckin();

  console.log('check in to edit ID', submittedCheckInToEdit?.checkInId);

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
      queryClient.invalidateQueries(['allAdminCheckIn', 'publishedCheckin']);
      onSuccess?.();
      onClose();
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
      questions: formQuestions
    };
    const payload = {
      originalCheckInId: submittedCheckInToEdit.checkInId,
      checkInToEdit: {
        ...finalEdittedCheckIn,
        checkInId: checkInName.trim() || submittedCheckInToEdit.checkInId
      }
    };
    console.log('payload to send to API ', payload);
    updateCheckInMutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
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
                Questions ({formQuestions?.length})
              </FormLabel>
              {/* <QuestionsSummary
                checkIn={checkInToEdit}
                setCheckIn={setSubmittedCheckIns}
                isSubmitted={true}
              /> */}
              {formQuestions?.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
              {/* <QuestionModal /> */}
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.100">
          <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
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
