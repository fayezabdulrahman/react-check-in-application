import {
  Flex,
  Heading,
  Card,
  CardBody,
  Container,
  Text,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserProvider';
import { client } from '../../util/axios-util';
import Loading from '../shared/Loading';
const SubmittedCheckIn = () => {
  const { submittedCheckIns, setSubmittedCheckIns } = useUser();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchSubmittedCheckins = async () => {
      try {
        const response = await client.get('/user/getAllSubmittedCheckIn');
        setSubmittedCheckIns(response.data.submittedCheckIns);
      } catch (error) {
        toast({
          title: 'Failed to get Submitted Check-ins',
          description: error.response?.data?.message || 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmittedCheckins();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Container>
        <Heading pb="8">Your submitted check-ins</Heading>
        <Flex gap="4" direction="column">
          {submittedCheckIns.map((checkin) => (
            <Card key={checkin.checkInId.checkInId}>
              <CardBody>
                <Heading as="h4" size="md">
                  Check-in name: {checkin.checkInId.checkInId}
                </Heading>
                <Text pt="2" fontSize="sm">
                  Submitted: {new Date(checkin.createdAt).toLocaleString()}
                </Text>
              </CardBody>
            </Card>
          ))}
        </Flex>
      </Container>
    </>
  );
};

export default SubmittedCheckIn;
