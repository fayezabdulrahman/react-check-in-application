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
  const { checkIn, publishCheckIn } = useAdminQuestion();

  function handlePublishCheckin() {
    console.log('publsih checkIn');
    publishCheckIn();
  }

  return (
    <>
      <Container>
        {!checkIn.published ? (
          <Card>
            <CardHeader color="gray.500">No Active Check</CardHeader>
            <CardBody>
              {checkIn.questions?.length !== 0 && (
                <Text>{checkIn.questions.length} Question Added</Text>
              )}
              {checkIn.questions?.length !== 0 ? (
                <Text>Publish your check in when youre ready!</Text>
              ) : (
                <Text>
                  Create a check in for your clients by adding questions
                </Text>
              )}
              {checkIn.questions?.length !== 0 && (
                <CardFooter display="flex" justifyContent="center">
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

        {checkIn.questions.length !== 0  && !checkIn.published && (
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
