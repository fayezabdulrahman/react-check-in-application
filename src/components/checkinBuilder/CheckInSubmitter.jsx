import { Button, CardFooter, Input, useToast, Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAdminService from '../../hooks/services/useAdminService';
import { useRef } from 'react';
import { useLocalAuth } from '../../context/LocalAuthProvider';
import { MdPublish } from 'react-icons/md';
import useCheckInStore from '../../store/checkin-store';

export const CheckInSubmitter = () => {
  const questions = useCheckInStore((state) => state.questions);
  const resetQuestions = useCheckInStore((state) => state.resetQuestions);

  const { userDetails } = useLocalAuth();
  const { createAdminCheckIn } = useAdminService();
  const queryClient = useQueryClient();
  const toast = useToast();
  const checkInNameRef = useRef();

  const { mutate: saveCheckIn, isPending } = useMutation({
    mutationFn: createAdminCheckIn,
    onSuccess: () => {
      toast({
        title: 'Check-in saved successfully',
        status: 'success',
        duration: 3000
      });
      queryClient.refetchQueries(['allAdminCheckIn']);
      resetQuestions();
    },
    onError: (error) => {
      toast({
        title: 'Error saving check-in',
        description: error.response?.data?.message,
        status: 'error',
        duration: 3000
      });
    }
  });

  const handleSaveCheckIn = () => {
    if (!checkInNameRef.current.value.trim()) {
      toast({
        title: 'Check-in name is required',
        status: 'error',
        duration: 2000
      });
      return;
    }

    const checkInToSave = {
      checkInId: checkInNameRef.current.value.trim(),
      createdBy: `${userDetails.firstName} ${userDetails.lastName}`,
      questions: questions,
      published: false
    };

    saveCheckIn(checkInToSave);
  };

  return (
    <>
      {questions.length > 0 ? (
        <>
          <Input
            placeholder="Enter check-in name"
            ref={checkInNameRef}
            mb={4}
          />
          <CardFooter justifyContent="center">
            <Button
              colorScheme="green"
              rightIcon={<MdPublish />}
              onClick={handleSaveCheckIn}
              isLoading={isPending}
            >
              Create Check-in
            </Button>
          </CardFooter>
        </>
      ) : (
        <Text textAlign="center" color="gray.500">
          Add your first question to begin
        </Text>
      )}
    </>
  );
};
