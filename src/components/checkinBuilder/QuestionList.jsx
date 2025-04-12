import { Card, CardBody, Text } from '@chakra-ui/react';
import QuestionCard from './QuestionCard';
import useCheckInStore from '../../store/checkin-store';

export const QuestionsList = () => {
  const questions = useCheckInStore((state) => state.questions);

  return (
    <>
      {questions.length > 0 && (
        <Card flex={1} mt="1rem" overflowY="auto" maxH="500px">
          <CardBody>
            <Text fontWeight="bold" mb={4}>
              Form Questions
            </Text>
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </CardBody>
        </Card>
      )}
    </>
  );
};
