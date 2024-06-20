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
import { useRef } from 'react';
import { client } from '../util/axios-util';

const CreateCheckIn = () => {
  const { checkIn, setCheckIn } = useAdminQuestion();
  const checkInNameRef = useRef();
  const toast = useToast();

  async function handlePublishCheckin() {
    const emptyChecckInName = checkInNameRef.current.value === '';
    console.log('question', checkInNameRef.current.value);
    if (emptyChecckInName) {
      console.log('empty checkin name');
      return toast({
        title: 'Please enter a name for your check-in',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }

    setCheckIn((prevState) => ({
      ...prevState,
      checkInId: checkInNameRef.current.value
    }));

    // try {
    //   const serverResponse = await client.post('/admin/createCheckin', checkIn);
    //   console.log('sucess from server on creating checkin', serverResponse.data);
    //   toast.update({
    //     title: 'Successfully Created Check-in',
    //     status: 'success',
    //     duration: 3000
    //   });

    // } catch (error) {
    //   console.log('error from server on creating checkin ', error);
    //   toast.update({
    //     title: 'Failed to Create Check-in',
    //     description: error.response?.data?.message || 'An error occurred',
    //     status: 'error',
    //     duration: 3000
    //   });
    // }


  }

  return (
    <>
      <Container>
        {!checkIn.published ? (
          <Card>
            <CardHeader color="gray.500">No Published Check-ins</CardHeader>
            <CardBody>
              {checkIn.questions?.length !== 0 ? (
                <>
                  <Text>{checkIn.questions.length} Question Added</Text>
                  <Box mt="1rem">
                    <Input
                      placeholder="Enter the name of your check-in"
                      ref={checkInNameRef}
                    />
                  </Box>
                  <CardFooter display="flex" justifyContent="center">
                    <Button
                      size="sm"
                      onClick={handlePublishCheckin}
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

        {checkIn.questions.length !== 0 && !checkIn.published && (
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
