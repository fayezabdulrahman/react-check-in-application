import { Card, CardBody, Box, useToast } from '@chakra-ui/react';
import FormFactory from '../shared/FormFactory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUserService from '../../hooks/services/useUserService';
import Loading from '../shared/Loading';
import { useNavigate } from 'react-router-dom';

const CheckInForm = () => {
  const { submitCheckIn } = useUserService();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: submitUserCheckinMutate,
    isPending: submitUserCheckinIsPending
  } = useMutation({
    mutationFn: submitCheckIn,
    onSuccess: () => {
      toast({
        title: 'Check-in Submitted!',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      // refresh queries
      queryClient.refetchQueries({
        queryKey: ['allUserCheckIns']
      });
      queryClient.invalidateQueries({
        queryKey: ['allUserSubmittedCheckin']
      });

      // navigat home
      navigate('/home', { replace: true });
    },
    onError: (error) => {
      console.error('Error Submitting Check-in:', error);
      toast({
        title: 'Submission failed!',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  if (submitUserCheckinIsPending) {
    return <Loading />;
  }
  const submitDetails = (userSubmissionDetails) => {
    const { checkInId, answers } = userSubmissionDetails;
    const payload = {
      checkInId,
      answers
    };
    submitUserCheckinMutate(payload);
  };

  return (
    <>
      <Card
        variant="outline"
        boxShadow="lg"
        borderRadius="2xl"
        borderColor="gray.100"
        bgGradient="linear(to-br, white, gray.50)"
        transition="all 0.3s ease"
        _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
        position="relative"
        p={6}
      >
        {/* Accent bar at the top */}
        <Box
          position="absolute"
          top={0}
          left={0}
          height="4px"
          width="100%"
          bgGradient="linear(to-r, orange.400, orange.300)"
          borderTopRadius="2xl"
        />

        <CardBody>
          {/* The form */}
          <FormFactory onSubmit={(answers) => submitDetails(answers)} />
        </CardBody>
      </Card>
    </>
  );
};

export default CheckInForm;
