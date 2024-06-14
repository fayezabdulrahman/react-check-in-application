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

const FormFactory = ({ question }) => {
  const { componentType } = question;

  function renderDynamicQuesiton() {
    switch (componentType) {
      case 'text':
        return (
          <>
            <FormControl {...question.isRequired} mb="1rem">
              <FormLabel>{question.label}</FormLabel>
              <Input type="text" />
            </FormControl>
          </>
        );
      case 'select':
        return (
          <>
            <FormControl {...question.isRequired} mb="1rem">
              <FormLabel>{question.label}</FormLabel>

              <Select placeholder="Select Option">
                {question.selectOptions?.map((option) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </>
        );
      case 'radio':
        return (
          <>
            <FormControl {...question.isRequired} mb="1rem">
              <FormLabel>{question.label}</FormLabel>
            </FormControl>
            <RadioGroup>
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
          <>
            <FormControl {...question.isRequired} mb="1rem">
              <FormLabel>{question.label}</FormLabel>
              <Textarea />
            </FormControl>
          </>
        );
      default:
        return null;
    }
  }
  return <Container centerContent>{renderDynamicQuesiton()}</Container>;
};

export default FormFactory;
