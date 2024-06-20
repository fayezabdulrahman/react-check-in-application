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
import NewQuestion from './NewQuestion';
import { useAdminQuestion } from '../context/AdminProvider';
import LatestCheckIn from './AvailableCheckIn';
import QuestionsSummary from './QuestionsSummary';
import { useEffect, useRef, useState } from 'react';
import { client } from '../util/axios-util';
import {
  INITAL_QUESTION_STATE,
  INTIAL_CHECKIN_STATE
} from '../constants/application';
import { useAuth } from '../context/AuthProvider';

const CreateCheckIn = () => {
  const { checkIn, setCheckIn, publishedCheckIn } = useAdminQuestion();
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

        setCheckIn(INITAL_QUESTION_STATE);


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
  }, [checkIn, toast]);

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
        {!publishedCheckIn.published ? (
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
                  <Text>
                    Start creating a check-in by a adding new question.
                  </Text>
                </>
              )}
            </CardBody>
          </Card>
        ) : (
          <LatestCheckIn />
        )}

        {checkIn.questions?.length > 0 && !publishedCheckIn.published && (
          <>
            <Box mt="1rem">
              <QuestionsSummary />
            </Box>
          </>
        )}

        <NewQuestion />
      </Container>
    </>
  );
};

export default CreateCheckIn;
