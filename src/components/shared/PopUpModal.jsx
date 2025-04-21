import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter
} from '@chakra-ui/react';
import { useRef } from 'react';
import useCheckInStore from '../../store/checkin-store';
const PopUpModal = () => {
  const toggleDeleteModal = useCheckInStore((state) => state.toggleDeleteModal);
  const deleteModalConfig = useCheckInStore((state) => state.deleteModalConfig);
  const closeDeleteModal = useCheckInStore((state) => state.closeDeleteModal);

  const handleConfirm = () => {
    if (deleteModalConfig?.onConfirm) {
      deleteModalConfig.onConfirm(deleteModalConfig.id);
    }
    closeDeleteModal();
  };
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        isOpen={toggleDeleteModal}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {deleteModalConfig?.header}
            </AlertDialogHeader>

            <AlertDialogBody>{deleteModalConfig?.body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default PopUpModal;
