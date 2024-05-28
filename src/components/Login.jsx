import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Box,
  Button
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
const INITIAL_STATE = {
  email: '',
  password: ''
};
const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const handleShowPassClick = () => setShowPass(!showPass);
  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    password: Yup.string()
      .required('Password is required')
      .min(3, 'Must be greater than 3 characters')
  });
  const handleLogin = (values) => {
    console.log(values);
  };
  return (
    <>
      <Formik
        initialValues={INITIAL_STATE}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
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
