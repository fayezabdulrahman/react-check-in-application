import {
  Text,
  Container,
  Button,
  Card,
  CardBody,
  CardHeader,
  Box,
  CardFooter
} from '@chakra-ui/react';
import { MdPublish } from 'react-icons/md';
import NewQuestion from './NewQuestion';
import { useAdminQuestion } from '../context/AdminProvider';
import LatestCheckIn from './LatestCheckIn';
import QuestionsSummary from './QuestionsSummary';

const CreateCheckIn = () => {
  const { questions, checkIn, saveCheckIn } = useAdminQuestion();

  function handlePublishCheckin() {
    saveCheckIn();
  }

  return (
    <>
      <Container>
        {checkIn.checkInQuestions.length === 0 ? (
          <Card>
            <CardHeader color="gray.500">No Active Check</CardHeader>
            <CardBody>
              {questions.length !== 0 && (
                <Text>{questions.length} Question Added</Text>
              )}
              {questions.length !== 0 ? (
                <Text>Publish your check in when youre ready!</Text>
              ) : (
                <Text>
                  Create a check in for your clients by adding questions
                </Text>
              )}
              {questions.length !== 0 && (
                <CardFooter display='flex' justifyContent='center'>
                  <Button
                    size="sm"
                    onClick={handlePublishCheckin}
                    rightIcon={<MdPublish />}
                  >
                    Publish Check-in
                  </Button>
                </CardFooter>
              )}
            </CardBody>
          </Card>
        ) : (
          <LatestCheckIn />
        )}

        {questions.length !== 0 && (
          <>
            <QuestionsSummary />
          </>
        )}

        {checkIn.checkInQuestions.length === 0 ? (
          <>
            <Box mt="1rem">
              <NewQuestion />
            </Box>
          </>
        ) : null}
      </Container>
    </>
  );
};

export default CreateCheckIn;
