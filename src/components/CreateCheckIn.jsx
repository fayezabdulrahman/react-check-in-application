import {
  Text,
  Container,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  Divider
} from '@chakra-ui/react';
import { MdPublish } from 'react-icons/md';
import FormFactory from './FormFactory';
import NewQuestion from './NewQuestion';
import { useAdminQuestion } from '../context/AdminProvider';
import { useState } from 'react';

const CreateCheckIn = () => {
  const { questions, checkIn, saveCheckIn } = useAdminQuestion();
  const [editingActiveCheckIn, setEditingActiveCheckIn] = useState(false);

  function handlePublishCheckin() {
    saveCheckIn();
  }

  function handleEditActiveCheckIn() {
    console.log('active checkin', checkIn.checkInQuestions);
    setEditingActiveCheckIn(!editingActiveCheckIn);
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
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader color="red.500">Your Active Check In </CardHeader>
            <CardBody>
              <Flex flexDirection="column">
                {checkIn.checkInQuestions.map((checkin, index) => (
                  <FormFactory key={index} question={checkin} />
                ))}
              </Flex>
            </CardBody>
          </Card>
        )}

        <Divider />
        {questions.length !== 0 && (
          <>
            <Flex
              mt="1rem"
              alignItems="baseline"
              gap="1rem"
              justifyContent="space-between"
            >
              <Heading size="md" mt="1rem">
                Summary of your questions{' '}
              </Heading>
              <Flex justifyContent="flex-end">
                <Button
                  size="sm"
                  onClick={handlePublishCheckin}
                  rightIcon={<MdPublish />}
                >
                  Publish Check-in
                </Button>
              </Flex>
            </Flex>
          </>
        )}

        {checkIn.checkInQuestions.length === 0 ? (
          <>
            <Flex mt="1rem" flexDirection="column">
              {questions?.map((question, index) => {
                return <FormFactory key={index} question={question} />;
              })}
            </Flex>
            <NewQuestion />
          </>
        ) : null}
      </Container>
    </>
  );
};

export default CreateCheckIn;
