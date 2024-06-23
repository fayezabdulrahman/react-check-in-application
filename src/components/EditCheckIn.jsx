import { Button, Flex, useToast } from '@chakra-ui/react';
import { useAdminQuestion } from '../context/AdminProvider';
import QuestionsSummary from './QuestionsSummary';
import { client } from '../util/axios-util';
const EditCheckIn = ({ checkInId }) => {
  const { submittedCheckIns, setSubmittedCheckIns } = useAdminQuestion();
  const toast = useToast();
  const checkInToEdit = submittedCheckIns.find(
    (checkIn) => checkIn.checkInId === checkInId
  );

  async function handleSaveCheckIn() {
    console.log('the checkIn that is updated', checkInToEdit);
    console.log('call api to save checkIn');
    try {
      const response = await client.post('/admin/updateCheckIn', checkInToEdit);
      toast({
        title: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });

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
      <Flex justifyContent='flex-end'>
        <Button colorScheme='orange' size='sm' onClick={handleSaveCheckIn}>Save Check-in</Button>
      </Flex>
      <QuestionsSummary
        checkIn={checkInToEdit}
        setCheckIn={setSubmittedCheckIns}
        isSubmitted={true}
      />
    </>
  );
};

export default EditCheckIn;
