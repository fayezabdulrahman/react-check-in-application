import {
  Stack,
  Text,
  Card,
  CardBody,
  Heading,
  Input,
  useToast,
  CardFooter,
  Button,
  Container
} from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import QuestionsSummary from '../shared/QuestionsSummary';
import { client } from '../../util/axios-util';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const EditCheckIn = () => {
  const location = useLocation();
  const { checkInId } = location.state;
  const navigate = useNavigate();
  const { submittedCheckIns, setSubmittedCheckIns } = useAdmin();
  const toast = useToast();
  let checkInToEdit = submittedCheckIns.find(
    (checkIn) => checkIn.checkInId === checkInId
  );

  const checkInNameRef = useRef();

  async function handleSaveCheckIn() {
    // update check in name if checkInNameRef is not empty otherwise leave as original
    // if we have new check in name/ create original
    const checkInName = checkInNameRef.current.value || checkInToEdit.checkInId;

    const payload = {
      originalCheckInId: checkInToEdit.checkInId,
      checkInToEdit: {
        ...checkInToEdit,
        checkInId: checkInName
      }
    };
    console.log('call api to update checkIn with new details', payload);
    try {
      const response = await client.post('/admin/updateCheckIn', payload);
      toast({
        title: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Failed to Update Check-in',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }

  return (
    <>
      <Container>
        <Card>
          <CardBody>
            <Stack mt="6" spacing="3">
              <Heading size="md">Check-in name</Heading>
              <Text>{checkInToEdit?.checkInId}</Text>
              <Input placeholder="Update your check-in name (optional)" ref={checkInNameRef} />
            </Stack>
          </CardBody>
          <CardFooter justifyContent="center">
            <Button colorScheme="orange" size="sm" onClick={handleSaveCheckIn}>
              Save Check-in
            </Button>
          </CardFooter>
        </Card>
        <QuestionsSummary
          checkIn={checkInToEdit}
          setCheckIn={setSubmittedCheckIns}
          isSubmitted={true}
        />
      </Container>
    </>
  );
};

export default EditCheckIn;
