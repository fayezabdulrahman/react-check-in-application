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
import { IoMdAdd } from 'react-icons/io';
import { useAdminQuestion } from '../context/AdminProvider';
import {INITAL_QUESTION_STATE} from '../constants/application';

const NewQuestion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questionType, setQuestionType] = useState('text');
  const [newQuestion, setNewQuestion] = useState(INITAL_QUESTION_STATE);
  const toast = useToast();
  const { checkIn, setCheckIn } = useAdminQuestion();

  const isError = newQuestion.label === '';

  function handleSelectOptions(event) {
    const input = event.target.value;
    const separatedValues = input.split(',');
    setNewQuestion((prevState) => ({
      ...prevState,
      componentType: 'select',
      selectOptions: separatedValues
    }));
  }

  function handleRadioOptions(event) {
    const input = event.target.value;
    const separatedValues = input.split(',');
    setNewQuestion((prevState) => ({
      ...prevState,
      componentType: 'radio',
      selectOptions: separatedValues
    }));
  }

  function handleQuestionName(event) {
    const questionToAsk = event.target.value;
    setNewQuestion((prevState) => ({
      ...prevState,
      id: checkIn.questions?.length,
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
    // saveCheckInQuestion(newQuestion);

    setCheckIn((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        {
          ...newQuestion
        }
      ]
    }));
    toast({
      title: 'Question created',
      status: 'success',
      duration: 2000,
      isClosable: true
    });
    // reset questionType
    setQuestionType('text');
    onClose();
  }

  return (
    <>
      <Button
        leftIcon={<IoMdAdd />}
        colorScheme="orange"
        variant="solid"
        size="sm"
        mt="1rem"
        onClick={onOpen}
      >
        Add Question
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Input your question</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl>
              <FormLabel>Question</FormLabel>
              <Input type="text" onChange={handleQuestionName} />
            </FormControl>
            <FormControl mt="1rem">
              <FormLabel>Type of Answer</FormLabel>
              <RadioGroup value={questionType} onChange={setQuestionType}>
                <Stack direction="row">
                  <Radio value="text">Text</Radio>
                  <Radio value="textarea">Text Area</Radio>
                  <Radio value="select">Dropdown</Radio>
                  <Radio value="radio">Radio</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            {questionType === 'select' ? (
              <FormControl mt="1rem">
                <FormLabel>Enter the dropdown options</FormLabel>
                <Input type="text" onChange={handleSelectOptions} />
                <FormHelperText>Separate each option by a comma</FormHelperText>
                <Select placeholder="Preview your options" mt="1rem">
                  {newQuestion.selectOptions?.map((selectOption, index) => (
                    <option key={index} value={selectOption}>
                      {selectOption.trim()}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            {questionType === 'radio' ? (
              <>
                <FormControl mt="1rem">
                  <FormLabel>Enter the radio options</FormLabel>
                  <Input type="text" onChange={handleRadioOptions} />
                  <FormHelperText>
                    Separate each option by a comma
                  </FormHelperText>

                  <RadioGroup mt="1rem">
                    <Stack direction="row">
                      {newQuestion.radioOptions?.map((radioOption, index) => (
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
                onChange={(e) =>
                  setNewQuestion((prevState) => ({
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
            <Button colorScheme="orange" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleSaveQuestion}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewQuestion;
