import {
  Button,
  Box,
  Card,
  CardBody,
  Flex,
  Text,
  Tag,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
import useCheckInStore from '../../store/checkin-store';
const QuestionCard = ({ question }) => {
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isCheckInSubmitted, setIsCheckInSubmitted] = useState(false);
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const removeQuestion = useCheckInStore((state) => state.removeQuestion);
  const setQuestionToEdit = useCheckInStore((state) => state.setQuestionToEdit);
  const submittedCheckInToEdit = useCheckInStore((state) => state.submittedCheckInToEdit);
  const removeQuestionFromSubmittedCheckIn = useCheckInStore((state) => state.removeQuestionFromSubmittedCheckIn);
  const setSubmittedCheckInQuestionToEdit = useCheckInStore((state) => state.setSubmittedCheckInQuestionToEdit);

  useEffect(() => {
    if (submittedCheckInToEdit) {
      setIsCheckInSubmitted(true);
    }
  }, [submittedCheckInToEdit]);

  const handleEdit = (question) => {
    if (submittedCheckInToEdit) {
      // setSubmittedCheckInQuestionToEdit
      setSubmittedCheckInQuestionToEdit(question);
    } else {
      setQuestionToEdit(question);
    }
  };

  const handleDelete = () => {
    if (isCheckInSubmitted) {
      removeQuestionFromSubmittedCheckIn(questionToDelete);
    } else {
      removeQuestion(questionToDelete);
    }
    onClose();
  };
  return (
    <>
      <Card mb={4} variant="outline">
        <CardBody>
          <Flex justify="space-between" align="center">
            <Box>
              <Flex align="center" gap={2} mb={2}>
                <Text fontWeight="medium">{question.label}</Text>
                <Tag colorScheme="blue">{question.componentType}</Tag>
                {question.isRequired && <Tag colorScheme="red">Required</Tag>}
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
                onClick={() => {
                  setQuestionToDelete(question.id);
                  onOpen();
                }}
                variant="ghost"
                colorScheme="red"
              />
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Question
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default QuestionCard;
