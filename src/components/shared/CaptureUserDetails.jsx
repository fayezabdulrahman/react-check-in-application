import { useState, useEffect } from 'react';
import { useLocalAuth } from '../../context/LocalAuthProvider';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useToast
} from '@chakra-ui/react';
import LocalStorageService from '../../util/LocalStorageService';
import useAuthService from '../../hooks/services/useAuthService';
import { useMutation } from '@tanstack/react-query';

const CaptureUserDetails = () => {
  const { userDetails, setUserDetails } = useLocalAuth();
  const { updateUserDetails } = useAuthService();
  const [showPrompt, setShowPrompt] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const toast = useToast();

  const { mutate: updateUserMutate, isPending } = useMutation({
    mutationFn: updateUserDetails,
    onSuccess: (response) => {
      setUserDetails(response);
      LocalStorageService.setItem('hasPromptedName', true);
      setShowPrompt(false);
      toast({
        title: 'Profile updated!',
        description: 'Your details have been successfully saved.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onError: (error) => {
      console.error('Error Updating User Details', error);
      setShowPrompt(false);
      toast({
        title: 'Error updating profile',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const handleUserDetails = () => {
    const payload = {
      firstName: firstName,
      lastName: lastName
    };

    // call api
    updateUserMutate(payload);
  };

  // Check if user details are empty and prompt for input (only once)
  useEffect(() => {
    if (userDetails?.firstName === '' && userDetails?.lastName === '') {
      const hasPrompted = LocalStorageService.getItem('hasPromptedName');
      if (!hasPrompted) {
        setShowPrompt(true);
      }
    }
  }, [userDetails]);

  if (!showPrompt) return null;
  return (
    <Modal isOpen={showPrompt} onClose={() => showPrompt(false)} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete Your Profile</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Last Name</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleUserDetails}
            isDisabled={!firstName.trim() || !lastName.trim()}
            isLoading={isPending}
            loadingText="Updating"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CaptureUserDetails;
