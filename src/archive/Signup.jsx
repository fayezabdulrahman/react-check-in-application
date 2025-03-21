import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Box,
  useToast,
  IconButton
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useAuth } from '../context/AuthProvider';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
const INITIAL_STATE = {
  email: '',
  firstName: '',
  lastName: '',
  password: ''
};

const Signup = () => {
  // const { signUp } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const handleShowPassClick = () => setShowPass(!showPass);

  const toast = useToast();

  // validation for signing up
  const registerSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Surname is required'),
    password: Yup.string()
      .required('Password is required')
      .min(3, 'Must be greater than 3 characters.')
  });

  const submitForm = async (values, actions) => {
    const transformedUserInput = {
      ...values,
      email: values.email.trim().toLowerCase()
    };

    const toastId = toast({
      title: 'Signing up...',
      status: 'loading',
      position: 'bottom',
      duration: null
    });

    try {
      // await signUp(transformedUserInput);

      toast.update(toastId, {
        title: 'Signup Successful',
        status: 'success',
        duration: 3000
      });

      actions.resetForm(); // resetForm After submit
    } catch (error) {
      toast.update(toastId, {
        title: 'Signup Failed',
        description: error.response.data || 'An error occurred',
        status: 'error',
        duration: 3000
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={INITIAL_STATE}
        onSubmit={submitForm}
        validationSchema={registerSchema}
      >
        {() => (
          <Form>
            <Field name="email">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.email && form.touched.email}
                >
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="firstName">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.firstName && form.touched.firstName}
                  paddingTop="0.25rem"
                >
                  <FormLabel>First Name</FormLabel>
                  <Input {...field} />
                  <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="lastName">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.lastName && form.touched.lastName}
                  paddingTop="0.25rem"
                >
                  <FormLabel>Surname</FormLabel>
                  <Input {...field} />
                  <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.password && form.touched.password}
                  paddingTop="0.25rem"
                >
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input type={showPass ? 'text' : 'password'} {...field} />
                    <InputRightElement width="4.5rem">
                      <IconButton
                        size='sm'
                        onClick={handleShowPassClick}
                        icon={showPass ? <FaEyeSlash /> : <FaEye />}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Box display="flex" justifyContent="center" width="100%">
              <Button mt={4} type="submit" width="50%">
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Signup;
