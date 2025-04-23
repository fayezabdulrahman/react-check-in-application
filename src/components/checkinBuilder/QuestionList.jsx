import { Card, CardBody, Text } from '@chakra-ui/react';
import QuestionCard from './QuestionCard';
import useCheckInStore from '../../store/checkin-store';

export const QuestionsList = () => {
  const questions = useCheckInStore((state) => state.questions);

  return (
    <>
      {questions.length > 0 && (
        <Card
          flex={1}
          mt="1rem"
          overflowY="auto"
          maxH="500px"
          position="relative"
          borderLeft="4px solid"
          borderColor="green.400"
          boxShadow="md"
          transition="all 0.2s"
          _hover={{ boxShadow: 'lg' }}
        >
          <CardBody>
            <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }} mb={4}>
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
