import { Card, CardBody, CardHeader, Flex } from '@chakra-ui/react';
import FormFactory from './FormFactory';
import { useAdminQuestion } from '../context/AdminProvider';

const LatestCheckIn = () => {
  const { checkIn } = useAdminQuestion();

  return (
    <>
      <Card>
        <CardHeader color="red.500">Your Active Check In </CardHeader>
        <CardBody>
          <Flex flexDirection="column">
            {checkIn.questions?.map((checkin, index) => (
              <FormFactory key={index} question={checkin} />
            ))}
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default LatestCheckIn;
