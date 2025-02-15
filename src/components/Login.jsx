import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Box,
  Button,
  useToast
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
const Login = () => {
  const INITIAL_STATE = {
    email: '',
    password: ''
  };
  const [showPass, setShowPass] = useState(false);
  const handleShowPassClick = () => setShowPass(!showPass);
  const { login } = useAuth();

  const toast = useToast();

  // validatoin for form
  const loginSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    password: Yup.string()
      .required('Password is required')
      .min(3, 'Must be greater than 3 characters')
  });
  const handleLogin = async (values) => {

    const transformedUserInput = {
      ...values,
      email: values.email.trim().toLowerCase()
    };
    const toastId = toast({
      title: 'Logging in..',
      status: 'loading',
      position: 'bottom',
      duration: null
    });
    try {
      await login(transformedUserInput);

      toast.update(toastId, {
        title: 'Login Successful',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast.update(toastId, {
        title: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000
      });
    }
  };
  return (
    <>
      <Formik
        initialValues={INITIAL_STATE}
        onSubmit={handleLogin}
        validationSchema={loginSchema}
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

            <Field name="password">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.password && form.touched.password}
                >
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input type={showPass ? 'text' : 'password'} {...field} />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowPassClick}
                      >
                        {showPass ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Box display="flex" justifyContent="center" width="100%">
              <Button mt={4} colorScheme="orange" type="submit" width="50%">
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
