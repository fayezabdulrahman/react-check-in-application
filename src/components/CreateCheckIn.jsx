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

const CreateCheckIn = () => {
  const { checkIn } = useAdminQuestion();
  const questionNameRef = useRef();
  const toast = useToast();

  function handlePublishCheckin() {
    const emptyChecckInName = questionNameRef.current.value === '';
    if (emptyChecckInName) {
      console.log('empty checkin name');
      return toast({
        title: 'Please enter a name for your check-in',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
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
                      ref={questionNameRef}
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
