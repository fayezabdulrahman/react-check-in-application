import { Card, CardBody, Text } from '@chakra-ui/react';
import { useCheckin } from '../../context/CheckinContext';
import QuestionCard from './QuestionCard';

export const QuestionsList = () => {
  const { formQuestions } = useCheckin();

  return (
    <>
      {formQuestions?.length > 0 && (
        <Card flex={1} mt="1rem" overflowY="auto" maxH="500px">
          <CardBody>
            <Text fontWeight="bold" mb={4}>
              Form Questions
            </Text>
            {formQuestions?.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </CardBody>
        </Card>
      )}
    </>
  );
};
