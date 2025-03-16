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
import { useRef, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { useAdmin } from '../context/AdminProvider';

const NewQuestion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questionType, setQuestionType] = useState('text');
  const [previewOptions, setPreviewOptions] = useState({
    selectOptions: [],
    radioOptions: []
  });
  const selectOptionsRef = useRef();
  const radioOptionsRef = useRef();
  const questionLabelRef = useRef();
  const checkBoxRef = useRef();
  const toast = useToast();
  const { checkIn, setCheckIn } = useAdmin();

  function handlePreview() {
    if (selectOptionsRef.current) {
      setPreviewOptions((prevState) => ({
        ...prevState,
        selectOptions: selectOptionsRef.current.value.trim().split(',')
      }));
    }
    if (radioOptionsRef.current) {
      setPreviewOptions((prevState) => ({
        ...prevState,
        radioOptions: radioOptionsRef.current.value.trim().split(',')
      }));
    }
  }

  function handleSaveQuestion() {
    if (questionLabelRef.current.value === '') {
      return toast({
        title: 'You must enter a Question',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
    const quesetionToSave = {
      id: checkIn.questions?.length,
      label: questionLabelRef.current.value,
      componentType: questionType,
      selectOptions: selectOptionsRef.current
        ? selectOptionsRef.current.value.trim().split(',')
        : [],
      radioOptions: radioOptionsRef.current
        ? radioOptionsRef.current.value.trim().split(',')
        : [],
      isRequired: checkBoxRef.current.checked
    };

    setCheckIn((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        {
          ...quesetionToSave
        }
      ]
    }));
    toast({
      title: 'Question created',
      status: 'success',
      duration: 2000,
      isClosable: true
    });
    setQuestionType('text');
    onClose();
  }

  return (
    <>
      <Button
        leftIcon={<IoMdAdd />}
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
              <Input type="text" ref={questionLabelRef} />
            </FormControl>
            <FormControl mt="1rem">
              <FormLabel>Type of Answer</FormLabel>
              <RadioGroup value={questionType} onChange={setQuestionType}>
                <Stack direction="row">
                  <Radio value="text">Short Text</Radio>
                  <Radio value="textarea">Long Text</Radio>
                  <Radio value="select">Multi Choice</Radio>
                  <Radio value="radio">Checkbox</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            {questionType === 'select' ? (
              <FormControl mt="1rem">
                <FormLabel>Enter the multi choice options</FormLabel>
                <Input
                  type="text"
                  ref={selectOptionsRef}
                  onChange={handlePreview}
                />
                <FormHelperText>Separate each option by a comma</FormHelperText>
                <Select placeholder="Preview your options" mt="1rem">
                  {previewOptions.selectOptions?.map((selectOption, index) => (
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
                  <FormLabel>Enter the checkbox options</FormLabel>
                  <Input
                    type="text"
                    ref={radioOptionsRef}
                    onChange={handlePreview}
                  />
                  <FormHelperText>
                    Separate each option by a comma
                  </FormHelperText>

                  <RadioGroup mt="1rem">
                    <Stack direction="row">
                      {previewOptions.radioOptions?.map(
                        (radioOption, index) => (
                          <Radio key={index} value={radioOption}>
                            {radioOption}
                          </Radio>
                        )
                      )}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </>
            ) : null}
            <FormControl mt="1rem">
              <FormLabel>Is this Question Required ?</FormLabel>
              <Checkbox ref={checkBoxRef}>Yes</Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="solid" onClick={handleSaveQuestion}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewQuestion;
