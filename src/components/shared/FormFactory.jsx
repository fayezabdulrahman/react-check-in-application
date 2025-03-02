import {
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Box,
  Button,
  FormErrorMessage
} from '@chakra-ui/react';
import { useUser } from '../../context/UserProvider';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const FormFactory = ({ publishedCheckIn, onSubmit }) => {
  const { setQuestionResponse } = useUser();
  const initialValues = publishedCheckIn.questions.reduce(
    (values, question) => {
      values[question.label] = '';
      return values;
    },
    {}
  );

  const handleSubmit = (values) => {
    // Transform the values into an array format
    const answers = Object.entries(values).map(([question, answer]) => ({
      question,
      answer
    }));
    console.log('answers array', answers);
    // Update the state with the new answers
    setQuestionResponse((prevState) => ({
      ...prevState,
      answers: answers
    }));

    onSubmit();
  };

  const generateValidationSchema = (questions) => {
    let schemaShape = {};

    questions.forEach((question) => {
      if (question.isRequired) {
        schemaShape[question.label] = Yup.string().required(
          'This field is required'
        );
      } else {
        schemaShape[question.label] = Yup.string();
      }
    });
    return Yup.object().shape(schemaShape);
  };

  const validationSchema = generateValidationSchema(publishedCheckIn.questions);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount={true}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isValid }) => (
          <Form>
            {publishedCheckIn.questions?.map((question, index) => (
              <Field key={index} name={question.label}>
                {({ field, form }) => (
                  <FormControl
                    isRequired={question.isRequired}
                    isInvalid={
                      form.errors[question.label] &&
                      form.touched[question.label]
                    }
                    mb="1rem"
                  >
                    <FormLabel>{question.label}</FormLabel>
                    {question.componentType === 'text' && (
                      <Input type="text" {...field} />
                    )}
                    {question.componentType === 'select' && (
                      <Select placeholder="Select Option" {...field}>
                        {question.selectOptions?.map((option) => {
                          return (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          );
                        })}
                      </Select>
                    )}
                    {question.componentType === 'radio' && (
                      <RadioGroup
                        {...field}
                        value={values[question.label]}
                        onChange={(value) =>
                          setFieldValue(question.label, value)
                        }
                      >
                        <Stack direction="row">
                          {question.radioOptions?.map((option, index) => (
                            <Radio key={index} value={option}>
                              {option}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    )}
                    <FormErrorMessage>
                      {form.errors[question.label]}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            ))}
            <Box display="flex" justifyContent="center" width="100%">
              <Button mt={4} type="submit" width="50%" isDisabled={!isValid}>
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormFactory;
