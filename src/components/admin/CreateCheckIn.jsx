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
import { useEffect, useRef } from 'react';
import { client } from '../../util/axios-util';
import { INTIAL_CHECKIN_STATE } from '../../constants/application';
import { useAuth } from '../../context/AuthProvider';

const CreateCheckIn = () => {
  const { checkIn, setCheckIn } = useAdmin();
  const { userState } = useAuth();
  const checkInNameRef = useRef();
  const toast = useToast();

  useEffect(() => {
    const createCheckInApiCall = async () => {
      if (!checkIn.checkInId) return;
      try {
        const serverResponse = await client.post(
          '/admin/createCheckin',
          checkIn
        );
        console.log(
          'sucess from server on creating checkin',
          serverResponse.data
        );

        toast({
          title: 'Successfully Created Check-in',
          status: 'success',
          duration: 3000,
          isClosable: true
        });

        setCheckIn(INTIAL_CHECKIN_STATE);
      } catch (error) {
        console.log('error from server on creating checkin ', error);
        toast({
          title: 'Failed to Create Check-in',
          description: error.response?.data?.message || 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    };

    createCheckInApiCall();
  }, [checkIn, toast, setCheckIn]);

  console.log('check in state inside CreateCheckIn', checkIn);

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

    setCheckIn((prevState) => ({
      ...prevState,
      createdBy: userState.firstName + ' ' + userState.lastName,
      checkInId: checkInNameRef.current.value
    }));
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
