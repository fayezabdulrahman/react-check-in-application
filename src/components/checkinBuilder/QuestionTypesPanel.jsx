import { Button, Flex, Text } from '@chakra-ui/react';
import useCheckInStore from '../../store/checkin-store';
import { IoMdCheckbox, IoIosText, IoMdText, IoMdOptions } from 'react-icons/io';

export const QuestionTypesPanel = () => {
  const setToggleModal = useCheckInStore((state) => state.setToggleModal);
  const setQuestionType = useCheckInStore((state) => state.setQuestionType);

  const store = useCheckInStore();
  console.log('Store:', store); // check if anything shows up

  const questionTypes = [
    { type: 'text', label: 'Short Text', icon: <IoIosText /> },
    { type: 'textarea', label: 'Long Text', icon: <IoMdText /> },
    { type: 'select', label: 'Multiple Choice', icon: <IoMdOptions /> },
    { type: 'radio', label: 'Multiple Option', icon: <IoMdCheckbox /> }
  ];

  return (
    <Flex direction="column" gap={2}>
      <Text fontWeight="bold" mb={4}>
        Question Type
      </Text>
      {questionTypes.map((question) => (
        <Button
          key={question.type}
          leftIcon={question.icon}
          justifyContent="flex-start"
          variant="outline"
          onClick={() => {
            setToggleModal();
            setQuestionType(question.type);
          }}
        >
          {question.label}
        </Button>
      ))}
    </Flex>
  );
};
