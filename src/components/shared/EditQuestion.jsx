import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Select,
  Stack,
  Radio,
  Checkbox,
  FormHelperText,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';

const EditQuestion = ({ questionId, checkIn, setCheckIn, isSubmitted }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editQuestion, setEditQuestion] = useState(
    checkIn.questions[questionId]
  );
  const [questionType, setQuestionType] = useState(editQuestion.componentType);

  const toast = useToast();

  const isError = editQuestion.label === '';
  console.log('edit questino state ', editQuestion);
  console.log('edit questino type state ', questionType);


  function handleSelectOptions(event) {
    const input = event.target.value;
    const separatedValues = input.trim().split(',');
    setEditQuestion((prevState) => ({
      ...prevState,
      componentType: 'select',
      selectOptions: separatedValues,
      radioOptions: []
    }));
  }

  function handleRadioOptions(event) {
    const input = event.target.value;
    const separatedValues = input.trim().split(',');
    setEditQuestion((prevState) => ({
      ...prevState,
      componentType: 'radio',
      radioOptions: separatedValues,
      selectOptions: []
    }));
  }

  function handleQuestionName(event) {
    const questionToAsk = event.target.value;
    setEditQuestion((prevState) => ({
      ...prevState,
      label: questionToAsk
    }));
  }

  function handleSaveQuestion() {
    if (isError) {
      return toast({
        title: 'You must enter a Question',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }

    if (isSubmitted) {
      setCheckIn((prevState) => {
        const updatedCheckIns = prevState.map((updatedCheckIn) => {
          if (updatedCheckIn.checkInId === checkIn.checkInId) {
            return {
              ...updatedCheckIn,
              questions: updatedCheckIn.questions.map((q) =>
                q.id === editQuestion.id ? editQuestion : q
              )
            };
          }
          return updatedCheckIn;
        });
        return updatedCheckIns;
      });
    } else {
      setCheckIn((prevState) => ({
        ...prevState,
        questions: [
          ...prevState.questions.map((q) =>
            q.id === editQuestion.id ? editQuestion : q
          )
        ]
      }));
    }

    toast({
      title: 'Question Updated',
      status: 'success',
      duration: 2000,
      isClosable: true
    });
    // reset questionType
    setQuestionType('text');
    onClose();
  }

  function closeModal() {
    // reset question
    setEditQuestion(checkIn.questions[questionId]);
    setQuestionType(editQuestion.componentType);
    onClose();
  }

  return (
    <>
      <Button
        leftIcon={<CiEdit />}
        variant="outline"
        size="sm"
        ml={3}
        mt={1}
        onClick={onOpen}
      >
        Edit Question
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit your question</ModalHeader>
          <ModalCloseButton onClick={closeModal}/>

          <ModalBody>
            <FormControl>
              <FormLabel>Question</FormLabel>
              <FormLabel>{editQuestion.label}</FormLabel>

              <Input type="text" onChange={handleQuestionName} />
            </FormControl>
            <FormControl mt="1rem">
              <FormLabel>Type of Answer</FormLabel>
              <RadioGroup value={questionType} onChange={setQuestionType}>
                <Stack direction="row">
                  <Radio value="text">Text</Radio>
                  <Radio value="textarea">Text Area</Radio>
                  <Radio value="select">Multi Choice</Radio>
                  <Radio value="radio">Checkbox</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            {questionType === 'select' ? (
              <FormControl mt="1rem">
                <FormLabel>Enter the Multi Choice options</FormLabel>
                <Input type="text" onChange={handleSelectOptions} />
                <FormHelperText>Separate each option by a comma</FormHelperText>
                <Select placeholder="Preview your options" mt="1rem">
                  {editQuestion.selectOptions.map((selectOption, index) => (
                    <option key={index} value={selectOption}>
                      {selectOption}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            {questionType === 'radio' ? (
              <>
                <FormControl mt="1rem">
                  <FormLabel>Enter the Checkbox options</FormLabel>
                  <Input type="text" onChange={handleRadioOptions} />
                  <FormHelperText>
                    Separate each option by a comma
                  </FormHelperText>

                  <RadioGroup mt="1rem">
                    <Stack direction="row">
                      {editQuestion.radioOptions.map((radioOption, index) => (
                        <Radio key={index} value={radioOption}>
                          {radioOption}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </>
            ) : null}
            <FormControl mt="1rem">
              <FormLabel>Is this Question Required ?</FormLabel>
              <Checkbox
                isChecked={editQuestion.isRequired}
                onChange={(e) =>
                  setEditQuestion((prevState) => ({
                    ...prevState,
                    isRequired: e.target.checked
                  }))
                }
              >
                Yes
              </Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={closeModal}>
              Close
            </Button>
            <Button onClick={handleSaveQuestion}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditQuestion;
