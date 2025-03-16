import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
import { useState, useRef } from 'react';

const EditQuestion = ({checkIn, setCheckIn, questionIndex, isSubmitted, isOpen, onClose }) => {
  const [editQuestion, setEditQuestion] = useState(
    checkIn.questions[questionIndex]
  );
  const [previewOptions, setPreviewOptions] = useState({
    selectOptions: editQuestion.selectOptions,
    radioOptions: editQuestion.radioOptions
  });
  const [questionType, setQuestionType] = useState(editQuestion.componentType);
  const selectOptionsRef = useRef(editQuestion.selectOptions);
  const radioOptionsRef = useRef(editQuestion.radioOptions);

  const toast = useToast();

  const isError = editQuestion.label === '';


  function handlePreview() {
    if (selectOptionsRef.current?.value) {
      console.log('select options ref in handle preview ', selectOptionsRef.current.value);
      setPreviewOptions((prevState) => ({
        ...prevState,
        selectOptions: selectOptionsRef.current.value.trim().split(',')
      }));
    }
    if (radioOptionsRef.current?.value) {
      console.log('radio options ref in handle preview ', radioOptionsRef.current);
      setPreviewOptions((prevState) => ({
        ...prevState,
        radioOptions: radioOptionsRef.current.value.trim().split(',')
      }));
    }
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

    console.log('preview options ',previewOptions);
  
    // Create the updated question object
    const updatedQuestion = {
      ...editQuestion,
      componentType: questionType,
      selectOptions: questionType === 'select' ? previewOptions.selectOptions: [],
      radioOptions: questionType === 'radio' ? previewOptions.radioOptions : []
      // isRequired: checkBoxRef.current.checked
    };
    console.log('updated question ', updatedQuestion);

    // Update state using the new object
    setEditQuestion(updatedQuestion);

    if (isSubmitted) {
      setCheckIn((prevState) => {
        const updatedCheckIns = prevState.map((updatedCheckIn) => {
          if (updatedCheckIn.checkInId === checkIn.checkInId) {
            return {
              ...updatedCheckIn,
              questions: updatedCheckIn.questions.map((q) =>
                q.id === editQuestion.id ? updatedQuestion : q
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
            q.id === editQuestion.id ? updatedQuestion : q
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
    // reset preview options
    setPreviewOptions({selectOptions: [], radioOptions: []});
    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit your question</ModalHeader>
          <ModalCloseButton onClick={onClose}/>

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
                <Input type="text" ref={selectOptionsRef} onChange={handlePreview} />
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
                  <FormLabel>Enter the Checkbox options</FormLabel>
                  <Input type="text" ref={radioOptionsRef} onChange={handlePreview} />
                  <FormHelperText>
                    Separate each option by a comma
                  </FormHelperText>

                  <RadioGroup mt="1rem">
                    <Stack direction="row">
                      {previewOptions.radioOptions?.map((radioOption, index) => (
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
            <Button variant='ghost' mr={3} onClick={onClose}>
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
