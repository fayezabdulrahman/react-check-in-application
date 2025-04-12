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
  useToast
} from '@chakra-ui/react';
import { useCheckin } from '../../context/CheckinContext';
import { useEffect } from 'react';
import { useAdmin } from '../../context/AdminProvider';

export const QuestionModal = () => {
  const {
    isModalOpen,
    actions,
    editingQuestion,
    selectedQuestionType,
    formData,
    setFormData,
    submittedCheckInToEdit
  } = useCheckin();
  const toast = useToast();

  useEffect(() => {
    if (editingQuestion) {
      setFormData(editingQuestion);
    }
  }, [editingQuestion, setFormData]);

  useEffect(() => {
    if (submittedCheckInToEdit) {
      actions.startEdittingSubmittedCheckIn(submittedCheckInToEdit);
    }
  }, [submittedCheckInToEdit]);

  const handleSave = () => {
    if (!formData.label.trim()) {
      return toast({ title: 'Question text required', status: 'error' });
    }

    const question = {
      label: formData.label,
      componentType: selectedQuestionType,
      isRequired: formData.isRequired,
      radioOptions: formData.radioOptions,
      selectOptions: formData.selectOptions
    };

    console.log('question to save ', question);

    if (editingQuestion) {
      console.log('editing question ', editingQuestion);
      actions.editQuestion(editingQuestion.id, question);
    } else {
      actions.addQuestion(question);
    }
    actions.closeModal();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={actions.closeModal} size="xl">x
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingQuestion ? 'Edit Question' : 'New Question'}
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

          {selectedQuestionType === 'select' && (
            <FormControl mb={4}>
              <FormLabel>Options (comma-separated)</FormLabel>
              <Input
                value={formData.selectOptions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    selectOptions: e.target.value.trim().split(',')
                  }))
                }
              />
              <FormHelperText>Separate options with commas</FormHelperText>
            </FormControl>
          )}

          {selectedQuestionType === 'radio' && (
            <FormControl mb={4}>
              <FormLabel>Options (comma-separated)</FormLabel>
              <Input
                value={formData.radioOptions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    radioOptions: e.target.value.trim().split(',')
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
              {editingQuestion ? 'Save Changes' : 'Add Question'}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
