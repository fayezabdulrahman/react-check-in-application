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
  Textarea,
  Flex,
  Text,
  Badge,
  CheckboxGroup,
  Checkbox,
  FormErrorMessage
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';

import * as Yup from 'yup';
import ErrorMessage from './ErrorMesssage';

const FormFactory = ({ onSubmit }) => {
  const location = useLocation();
  const { publishedCheckIn } = location.state || {}; // Safely destructure state
  const checkInId = publishedCheckIn?.checkInId;
  const initialValues = publishedCheckIn?.questions?.reduce(
    (values, question) => {
      values[question.id] = question.componentType === 'multiselect' ? [] : '';
      return values;
    },
    {}
  );

  const handleSubmit = (values) => {
    // Transform the values into an array format
    const answers = Object.entries(values).map(([questionId, answer]) => {
      const question = publishedCheckIn?.questions[questionId];
      return {
        questionId,
        question: question.label,
        answer:
          question.componentType === 'multiselect' && Array.isArray(answer)
            ? answer.join(', ')
            : answer
      };
    });

    const userSubmission = {
      checkInId,
      answers
    };

    onSubmit(userSubmission);
  };

  const generateValidationSchema = (questions) => {
    let schemaShape = {};

    questions?.forEach((question) => {
      if (question.componentType === 'multiselect') {
        schemaShape[question.id] = question.isRequired
          ? Yup.array().min(1, 'Select at least one option')
          : Yup.array();
      } else {
        schemaShape[question.id] = question.isRequired
          ? Yup.string().required('This field is required')
          : Yup.string();
      }
    });
    return Yup.object().shape(schemaShape);
  };

  const validationSchema = generateValidationSchema(
    publishedCheckIn?.questions
  );

  if (!publishedCheckIn) {
    return (
      <ErrorMessage message="No Questions found! Please return to home screen" />
    );
  }

  return (
    <>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        wrap="wrap"
        mb={6}
        gap={2}
      >
        <Box>
          <Badge
            colorScheme="orange"
            fontSize="md"
            px={3}
            py={1}
            borderRadius="md"
            textTransform="none"
          >
            Check-in name: {checkInId}
          </Badge>
        </Box>

        <Text
          color="red.500"
          fontWeight="medium"
          fontSize="sm"
          mt={{ base: 2, md: 0 }}
        >
          * Required field
        </Text>
      </Flex>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount={true}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isValid }) => (
          // no validate - stops default HTML Browser from validating the form, validation is done via Yup Schema
          <Form noValidate>
            {publishedCheckIn?.questions?.map((question) => (
              <Field key={question.id} name={question.id}>
                {({ field, form }) => (
                  <FormControl
                    isRequired={question.isRequired}
                    isInvalid={
                      form.errors[question.id] && form.touched[question.id]
                    }
                    mb="1rem"
                  >
                    <FormLabel>{question.label}</FormLabel>
                    {question.description && (
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        fontStyle="italic"
                        mb={2}
                      >
                        {question.description}
                      </Text>
                    )}
                    {question.componentType === 'text' && (
                      <Input type="text" {...field} />
                    )}
                    {question.componentType === 'textarea' && (
                      <Textarea {...field} />
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

                    {question.componentType === 'multiselect' && (
                      <CheckboxGroup
                        {...field}
                        colorScheme="orange"
                        value={values[question.id || []]}
                        onChange={(value) => {
                          form.setFieldValue(question.id, value);
                          form.setFieldTouched(question.id, true, false);
                        }}
                      >
                        <Stack spacing={2}>
                          {question.selectOptions?.map((option, index) => (
                            <Checkbox key={index} value={option}>
                              {option}
                            </Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    )}
                    {question.componentType === 'radio' && (
                      <RadioGroup
                        {...field}
                        value={values[question.id]}
                        onChange={(value) => setFieldValue(question.id, value)}
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
                      {form.errors[question.id]}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            ))}
            <Box display="flex" justifyContent="center" width="100%">
              <Button mt={4} type="submit" px={6} isDisabled={!isValid}>
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
