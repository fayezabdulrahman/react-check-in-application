import {
  Text,
  Container,
  Button,
  Card,
  CardBody,
  CardHeader,
  Box,
  CardFooter,
  Input,
  useToast
} from '@chakra-ui/react';
import { MdPublish } from 'react-icons/md';
import NewQuestion from '../NewQuestion';
import { useAdmin } from '../../context/AdminProvider';
import QuestionsSummary from '../shared/QuestionsSummary';
import { useRef } from 'react';
import { INTIAL_CHECKIN_STATE } from '../../constants/application';
import { useAuth } from '../../context/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminCheckIn } from '../../services/adminService';
import Loading from '../shared/Loading';

const CreateCheckIn = () => {
  const { checkIn, setCheckIn } = useAdmin();
  const { userState } = useAuth();
  const checkInNameRef = useRef();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {mutate: createCheckIn, isPending} = useMutation({
    mutationFn: createAdminCheckIn,
    onSuccess: (response) => {
      console.log('response from creating check in ', response);
      toast({
        title: 'Successfully Created Check-in',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      setCheckIn(INTIAL_CHECKIN_STATE);

      // invalidate cache so we get latest created check ins
      queryClient.invalidateQueries({queryKey: ['allAdminCheckIn']});

    },
    onError: (error) => {
      toast({
        title: 'Failed to Create Check-in',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });


  if (isPending) {
    return <Loading />;
  }

  function handleCreateCheckIn() {
    const emptyChecckInName = checkInNameRef.current.value === '';
    if (emptyChecckInName) {
      return toast({
        title: 'Please enter a name for your check-in',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }

    const checkinToCreate = {
      ...checkIn,
      createdBy: userState.firstName + ' ' + userState.lastName,
      checkInId: checkInNameRef.current.value
    };

    setCheckIn(checkinToCreate);

     // Call mutate() to trigger API call
    createCheckIn(checkinToCreate);
  }

  return (
    <>
      <Container>
        <Card>
          <CardHeader color="gray.500">No Published Check-ins</CardHeader>
          <CardBody>
            {checkIn.questions?.length > 0 ? (
              <>
                <Text>{checkIn.questions?.length} Question Added</Text>
                <Box mt="1rem">
                  <Input
                    placeholder="Enter a name for your check-in"
                    ref={checkInNameRef}
                  />
                </Box>
                <CardFooter display="flex" justifyContent="center">
                  <Button
                    size="sm"
                    onClick={handleCreateCheckIn}
                    rightIcon={<MdPublish />}
                  >
                    Create Check-in
                  </Button>
                </CardFooter>
              </>
            ) : (
              <>
                <Text>Start creating a check-in by a adding new question.</Text>
              </>
            )}
          </CardBody>
        </Card>

        {checkIn.questions?.length > 0 && (
          <>
            <Box mt="1rem">
              <QuestionsSummary
                checkIn={checkIn}
                setCheckIn={setCheckIn}
                isSubmitted={false}
              />
            </Box>
          </>
        )}

        <NewQuestion />
      </Container>
    </>
  );
};

export default CreateCheckIn;
