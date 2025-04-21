import {
  Box,
  Card,
  CardBody,
  Flex,
  Text,
  Tag,
  IconButton
} from '@chakra-ui/react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import useCheckInStore from '../../store/checkin-store';
const QuestionCard = ({ question, readOnly = false }) => {
  const [isCheckInSubmitted, setIsCheckInSubmitted] = useState(false);
  const removeQuestion = useCheckInStore((state) => state.removeQuestion);
  const setQuestionToEdit = useCheckInStore((state) => state.setQuestionToEdit);
  const submittedCheckInToEdit = useCheckInStore(
    (state) => state.submittedCheckInToEdit
  );
  const removeQuestionFromSubmittedCheckIn = useCheckInStore(
    (state) => state.removeQuestionFromSubmittedCheckIn
  );
  const setSubmittedCheckInQuestionToEdit = useCheckInStore(
    (state) => state.setSubmittedCheckInQuestionToEdit
  );

  const openDeleteModal = useCheckInStore((state) => state.openDeleteModal);

  useEffect(() => {
    if (submittedCheckInToEdit) {
      setIsCheckInSubmitted(true);
    }
  }, [submittedCheckInToEdit]);

  const handleEdit = (question) => {
    if (submittedCheckInToEdit) {
      setSubmittedCheckInQuestionToEdit(question);
    } else {
      setQuestionToEdit(question);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    openDeleteModal({
      id: questionId,
      header: 'Delete Question',
      body: 'Are you sure you want to Delete this question ?',
      onConfirm: (payload) => handleDelete(payload)
    });
  };

  const handleDelete = (questionId) => {
    if (isCheckInSubmitted) {
      removeQuestionFromSubmittedCheckIn(questionId);
    } else {
      removeQuestion(questionId);
    }
  };
  return (
    <>
      <Card mb={4} variant="outline">
        <CardBody>
          <Flex justify="space-between" align="center">
            <Box>
              <Flex
                as={question.answer ? 'b' : ''}
                align="center"
                gap={2}
                mb={2}
              >
                <Text fontWeight="medium">{question.label}</Text>
                {!readOnly && question.isRequired && (
                  <Tag colorScheme="red">Required</Tag>
                )}
                {question.answer && <Text>{question.answer}</Text>}
              </Flex>
              {question.selectOptions?.length > 0 && (
                <Text fontSize="sm" color="gray.500">
                  Choice Options: {question.selectOptions.join(', ')}
                </Text>
              )}
              {question.radioOptions?.length > 0 && (
                <Text fontSize="sm" color="gray.500">
                  Checkbox Options: {question.radioOptions.join(', ')}
                </Text>
              )}
            </Box>

            {!readOnly && (
              <Flex gap={2}>
                <IconButton
                  icon={<MdEdit />}
                  aria-label="Edit question"
                  onClick={() => handleEdit(question)}
                  variant="ghost"
                />
                <IconButton
                  icon={<MdDelete />}
                  aria-label="Delete question"
                  onClick={() => handleDeleteQuestion(question.id)}
                  variant="ghost"
                  colorScheme="red"
                />
              </Flex>
            )}
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default QuestionCard;
