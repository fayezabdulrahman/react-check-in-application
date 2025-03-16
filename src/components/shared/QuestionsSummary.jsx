import {
  Box,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Heading,
  CardHeader,
  Text,
  UnorderedList,
  ListItem,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import EditQuestion from './EditQuestion';
import { useState } from 'react';
const QuestionsSummary = ({ checkIn, setCheckIn, isSubmitted }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuestionToEdit, setSelectedQuestionToEdit] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  const handleDeleteQuestion = (questionId) => {
    setCheckIn((prevState) => ({
      ...prevState,
      questions: prevState.questions.filter((q) => q.id !== questionId)
    }));
  };

  const handleEditQuestion = (question, indexOfQuestionInState) => {
    setSelectedQuestionToEdit(question); // Set the selected question
    setSelectedQuestionIndex(indexOfQuestionInState);
    onOpen(); // Open the modal
  };

  const handleClose = () => {
    setSelectedQuestionToEdit(null);
    setSelectedQuestionIndex(null);
    onClose();
  };

  return (
    <>
      <Card mt="1rem" overflowY="auto" maxH="500px">
        <CardHeader>
          <Heading size="md">Summary of your Questions</Heading>
        </CardHeader>

        <CardBody>
          {checkIn?.questions?.map((question, index) => (
            <Stack key={index} divider={<StackDivider />} spacing="4">
              <Box mt="1rem">
                <Heading size="xs">{question.label}</Heading>

                <Text pt="2" fontSize="sm">
                  Question Required: {question.isRequired ? 'Yes' : 'No'}
                </Text>

                {question.selectOptions?.length > 0
                  ? 'Multi Choice Options'
                  : null}
                <UnorderedList>
                  {question.selectOptions?.map((selectOption, index) => (
                    <ListItem key={index}>{selectOption}</ListItem>
                  ))}
                </UnorderedList>

                {question.radioOptions?.length > 0 ? 'Checkbox Options' : null}

                <UnorderedList>
                  {question.radioOptions?.map((radioOption, index) => (
                    <ListItem key={index}>{radioOption}</ListItem>
                  ))}
                </UnorderedList>
                <Box display="flex" justifyContent="flex-end" gap="1rem">
                  <Button
                    leftIcon={<CiEdit />}
                    variant="outline"
                    size="sm"
                    ml={3}
                    mt={1}
                    onClick={() => handleEditQuestion(question, index)}
                  >
                    Edit
                  </Button>
                  <Button
                    leftIcon={<MdDeleteOutline />}
                    variant="outline"
                    size="sm"
                    ml={3}
                    mt={1}
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Stack>
          ))}
        </CardBody>
      </Card>
      {selectedQuestionToEdit && (
        <EditQuestion
          isOpen={isOpen}
          onClose={handleClose}
          questionIndex={selectedQuestionIndex}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          isSubmitted={isSubmitted}
        />
      )}
    </>
  );
};

export default QuestionsSummary;
