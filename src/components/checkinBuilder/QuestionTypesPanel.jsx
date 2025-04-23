import { Button, Flex, Text } from '@chakra-ui/react';
import useCheckInStore from '../../store/checkin-store';
import { IoMdCheckbox, IoIosText, IoMdText, IoMdList } from 'react-icons/io';

export const QuestionTypesPanel = () => {
  const setToggleModal = useCheckInStore((state) => state.setToggleModal);
  const setQuestionType = useCheckInStore((state) => state.setQuestionType);

  const questionTypes = [
    { type: 'text', label: 'Short Text', icon: <IoIosText /> },
    { type: 'textarea', label: 'Long Text', icon: <IoMdText /> },
    { type: 'select', label: 'Multiple Choice', icon: <IoMdList /> },
    { type: 'radio', label: 'Multiple Option', icon: <IoMdCheckbox /> }
  ];

  return (
    <Flex direction="column" gap={4}>
      <Text
        fontWeight="bold"
        fontSize="md"
        borderBottom="2px solid"
        borderColor="orange.300"
        pb={2}
      >
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
