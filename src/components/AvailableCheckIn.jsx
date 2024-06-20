import { Card, CardBody, CardHeader, Flex } from '@chakra-ui/react';
import { useAdminQuestion } from '../context/AdminProvider';

const AvailableCheckIn = () => {
  const { checkIn } = useAdminQuestion();

  // make call to backend to fetch all checkins
  // render all checkins available

  // add functionality to edit/delete checkins
  // add functionality to publish checkins

  return (
    <>
      <Card>
        <CardHeader color="red.500">Your Created Check-ins </CardHeader>
        <CardBody>
          <Flex flexDirection="column">LOAD ALL CHECKINS HERE</Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default AvailableCheckIn;
