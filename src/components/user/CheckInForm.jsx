import { Container } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button
} from '@chakra-ui/react';
import { client } from '../../util/axios-util';

const CheckInForm = () => {
  const handleSubmit = async () => {
    await client.get('/protected');
  };
  return (
    <>
      <Container>
        <FormControl>
          <FormLabel>How did you find this weeks workout?</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl>
          <FormLabel>How was your diet this week?</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl>
          <FormLabel>How many times did you workout this week?</FormLabel>
          <Select placeholder="Select amount of days">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </Select>
        </FormControl>
        <FormControl pt="4">
          <Button colorScheme="orange" onClick={handleSubmit}>
            Submit
          </Button>
        </FormControl>
      </Container>
    </>
  );
};

export default CheckInForm;
