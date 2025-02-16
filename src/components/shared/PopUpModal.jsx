import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useEffect } from 'react';
const PopUpModal = ({ openModal, modalConfig, onConfirm, onClose }) => {
  const { isOpen, onOpen, onClose: chakraClose } = useDisclosure();

  useEffect(() => {
    if (openModal) {
      onOpen();
    } else {
      chakraClose();
    }
  }, [openModal, onOpen, chakraClose]);
  const handleConfirm = () => {
    onConfirm(true);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalConfig?.modalHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalConfig?.modalBody}</ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={handleConfirm}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PopUpModal;
