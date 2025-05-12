import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Flex,
  FormHelperText,
  Tooltip,
  Icon,
  useToast
} from '@chakra-ui/react';
import { MdHelpOutline } from 'react-icons/md';

import { useEffect, useState } from 'react';
import useCheckInStore from '../../store/checkin-store';
import { INITAL_QUESTION_STATE } from '../../constants/application';

export const QuestionModal = () => {
  const toast = useToast();
  const [formData, setFormData] = useState(INITAL_QUESTION_STATE);

  const questionType = useCheckInStore((state) => state.questionType);
  const toggleModal = useCheckInStore((state) => state.toggleModal);
  const setToggleModal = useCheckInStore((state) => state.setToggleModal);
  const addQuestion = useCheckInStore((state) => state.addQuestion);
  const questionToEdit = useCheckInStore((state) => state.questionToEdit);
  const updateQuestion = useCheckInStore((state) => state.updateQuestion);
  const submittedCheckInToEdit = useCheckInStore(
    (state) => state.submittedCheckInToEdit
  );
  const updateSubmittedQuestion = useCheckInStore(
    (state) => state.updateSubmittedQuestion
  );
  const setQuestionType = useCheckInStore((state) => state.setQuestionType);
  const resetQuestionToEdit = useCheckInStore(
    (state) => state.resetQuestionToEdit
  );

  useEffect(() => {
    if (questionToEdit) {
      setFormData(questionToEdit);
    }
  }, [questionToEdit]);

  const handleSave = () => {
    if (!formData.label.trim()) {
      return toast({ title: 'Question name is required', status: 'error' });
    }

    const cleanSelectOptions = formData.selectOptions
      .map((option) => option.trim())
      .filter((item) => item !== '');

    const cleanRadioOptions = formData.radioOptions
      .map((option) => option.trim())
      .filter((item) => item !== '');

    const question = {
      label: formData.label,
      description: formData.description,
      componentType: questionType,
      isRequired: formData.isRequired,
      radioOptions: cleanRadioOptions,
      selectOptions: cleanSelectOptions
    };

    if (questionToEdit) {
      const updatedEquestion = {
        ...question,
        id: questionToEdit.id
      };
      if (submittedCheckInToEdit) {
        const updatedSubmittedQuestion = {
          ...question,
          id: questionToEdit.id
        };
        // call method to update question in a submitted check in
        updateSubmittedQuestion(updatedSubmittedQuestion);
      } else {
        updateQuestion(updatedEquestion);
      }
    } else {
      addQuestion(question);
    }

    setToggleModal();
    setFormData(INITAL_QUESTION_STATE);
  };

  const handleCloseModal = () => {
    setToggleModal();
    setQuestionType('');
    setFormData(INITAL_QUESTION_STATE);
    if (questionToEdit) {
      resetQuestionToEdit();
    }
  };

  return (
    <Modal isOpen={toggleModal} onClose={handleCloseModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {questionToEdit ? 'Edit Question' : 'New Question'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={4}>
            <FormLabel>Question</FormLabel>
            <Input
              value={formData.label}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, label: e.target.value }))
              }
              autoFocus
            />
          </FormControl>

          <Flex align="center" gap={2} wrap="wrap">
            <FormControl mb={4}>
              <Flex align="center"  mb={1}>
                <FormLabel >Description</FormLabel>
                <Tooltip
                  label="Add further description to your question"
                  fontSize="sm"
                  hasArrow
                  placement="bottom"
                >
                  <span>
                    <Icon
                      as={MdHelpOutline}
                      color="gray.500"
                      _hover={{ color: 'gray.700' }}
                      boxSize={4}
                      cursor="help"
                    />
                  </span>
                </Tooltip>
              </Flex>

              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </FormControl>
          </Flex>

          {(questionType === 'select' || questionType === 'multiselect') && (
            <FormControl mb={4}>
              <FormLabel>Options (comma-separated)</FormLabel>
              <Input
                value={formData.selectOptions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    selectOptions: e.target.value.split(',')
                  }))
                }
              />
              <FormHelperText>Separate options with commas</FormHelperText>
            </FormControl>
          )}

          {questionType === 'radio' && (
            <FormControl mb={4}>
              <FormLabel>Options (comma-separated)</FormLabel>
              <Input
                value={formData.radioOptions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    radioOptions: e.target.value.split(',')
                  }))
                }
              />
              <FormHelperText>Separate options with commas</FormHelperText>
            </FormControl>
          )}

          <Checkbox
            isChecked={formData.isRequired}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isRequired: e.target.checked }))
            }
          >
            Required
          </Checkbox>

          <Flex justify="flex-end" mt={8}>
            <Button colorScheme="blue" onClick={handleSave}>
              {questionToEdit ? 'Save Changes' : 'Add Question'}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuestionModal;
