import { Button, Flex, Text } from '@chakra-ui/react';
import { useCheckin } from '../../context/CheckinContext';


export const QuestionTypesPanel = () => {
  const { actions } = useCheckin();
  
  const questionTypes = [
    { type: 'text', label: 'Short Text' },
    { type: 'textarea', label: 'Long Text' },
    { type: 'select', label: 'Multiple Choice' },
    { type: 'radio', label: 'Checkbox' }
  ];

  return (
    <Flex direction="column" gap={2}>
      <Text fontWeight="bold" mb={4}>
        Question Type
      </Text>
      {questionTypes.map((question) => (
        <Button
          key={question.type}
          justifyContent="flex-start"
          variant="outline"
          onClick={() => actions.openModal(question.type)}
        >
          {question.label}
        </Button>
      ))}
    </Flex>
  );
};
