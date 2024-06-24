import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea
} from '@chakra-ui/react';
import { useUser } from '../../context/UserProvider';

const FormFactory = ({ question }) => {
  const { componentType } = question;
  const { setQuestionResponse } = useUser();

  // const handleChange = (value) => {
  //   onInputChange(question.label, value);
  // };

  // const handleChange = (event) => {
  //   console.log(event);
  //   const { name, value } = event.target;
  //   setQuestionResponse((prev) => ({
  //     ...prev,
  //     answers: {
  //       ...prev.answers,
  //       [name]: value
  //     }
  //   }));
  //   console.log('questionResponse', questionResponse);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionResponse((prevResponse) => {
      const newAnswers = prevResponse.answers.filter(
        (ans) => ans.questionLabel !== name
      );
      newAnswers.push({ questionLabel: name, answer: value });
      return {
        ...prevResponse,
        answers: newAnswers
      };
    });
  };

  function renderDynamicQuesiton() {
    switch (componentType) {
      case 'text':
        return (
          <FormControl {...question.isRequired} mb="1rem">
            <FormLabel>{question.label}</FormLabel>
            <Input type="text" onChange={handleChange} name={question.label} />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl {...question.isRequired} mb="1rem">
            <FormLabel>{question.label}</FormLabel>

            <Select
              placeholder="Select Option"
              onChange={handleChange}
              name={question.label}
            >
              {question.selectOptions?.map((option) => {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        );
      case 'radio':
        return (
          <>
            <FormControl {...question.isRequired} mb="1rem">
              <FormLabel>{question.label}</FormLabel>
            </FormControl>
            <RadioGroup onChange={(value) => handleChange({ target: { name: question.label, value } })} name={question.label}>
              <Stack direction="row">
                {question.radioOptions?.map((option) => {
                  return (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  );
                })}
              </Stack>
            </RadioGroup>
          </>
        );
      case 'textarea':
        return (
          <FormControl {...question.isRequired} mb="1rem">
            <FormLabel>{question.label}</FormLabel>
            <Textarea onChange={handleChange} name={question.label} />
          </FormControl>
        );
      default:
        return null;
    }
  }
  return (
    <>
      <Container centerContent>{renderDynamicQuesiton()}</Container>
    </>
  );
};

export default FormFactory;
