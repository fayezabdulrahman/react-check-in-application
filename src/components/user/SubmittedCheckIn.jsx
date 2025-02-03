import {
  Flex,
  Heading,
  Card,
  CardBody,
  Container,
  Text,
  useToast
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useUser } from '../../context/UserProvider';
import Loading from '../shared/Loading';
import { useQuery } from '@tanstack/react-query';
import { fetchAllUserSubmittedCheckIns } from '../../services/userService';
const SubmittedCheckIn = () => {
  const { submittedCheckIns, setSubmittedCheckIns } = useUser();
  const toast = useToast();

  const { data, isPending, error } = useQuery({
    queryKey: ['allUserSubmittedCheckin'],
    queryFn: fetchAllUserSubmittedCheckIns
  });

  useEffect(() => {
    if (data?.submittedCheckIns) {
      setSubmittedCheckIns(data.submittedCheckIns);
    }
  }, [setSubmittedCheckIns, submittedCheckIns, data]);

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    toast({
      title: 'Failed to get Submitted Check-ins',
      description: error.response?.data?.message || 'An error occurred',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
  }
  return (
    <>
      <Container>
        <Heading pb="8">Your submitted check-ins</Heading>
        <Flex gap="4" direction="column">
          {submittedCheckIns?.map((checkin) => (
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
