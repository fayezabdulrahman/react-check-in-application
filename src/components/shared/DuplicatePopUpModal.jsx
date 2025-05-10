import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader
} from '@chakra-ui/react';
import useCheckInStore from '../../store/checkin-store';
import { useState } from 'react';
import { useCreateCheckIn } from '../../hooks/useCreateCheckIn';
const DuplicatePopUpModal = () => {
  const [duplicateCheckInName, setDuplicateCheckInName] = useState('');

  const closeDuplicateModal = useCheckInStore(
    (state) => state.closeDuplicateModal
  );

  const duplicateCheckInData = useCheckInStore(
    (state) => state.duplicateCheckInData
  );
  const toggleDuplicateModal = useCheckInStore(
    (state) => state.toggleDuplicateModal
  );

  const { mutate: saveCheckIn, isPending } = useCreateCheckIn({
    refetchQueryKeys: [['allAdminCheckIn']],
    afterSuccess: closeDuplicateModal,
    afterError: closeDuplicateModal
  });

  const handleCreate = () => {
    const payload = {
      ...duplicateCheckInData,
      checkInId: duplicateCheckInName
    };
    saveCheckIn(payload);
  };

  const handleOnClose = () => {
    setDuplicateCheckInName('');
    closeDuplicateModal();
  };

  return (
    <>
      <Modal isOpen={toggleDuplicateModal} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Duplicating your check-in</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Check-in name</FormLabel>
              <Input
                onChange={(e) => setDuplicateCheckInName(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="orange"
              mr={3}
              onClick={handleCreate}
              isDisabled={!duplicateCheckInName}
              isLoading={isPending}
              loadingText={'Creating...'}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DuplicatePopUpModal;
