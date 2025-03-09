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
import useUserService from '../../hooks/services/useUserService';
import LocalStorageService from '../../util/LocalStorageService';
const SubmittedCheckIn = () => {
  const { submittedCheckIns, setSubmittedCheckIns } = useUser();
  const {fetchAllUserSubmittedCheckIns} = useUserService();
  const toast = useToast();

  const { data, isPending, error } = useQuery({
    queryKey: ['allUserSubmittedCheckin'],
    queryFn: fetchAllUserSubmittedCheckIns,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  useEffect(() => {
    const submittedCheckInLocalStorage = LocalStorageService.getItem('submittedCheckInResponse');
    if (submittedCheckInLocalStorage) {
      setSubmittedCheckIns(submittedCheckInLocalStorage);
    } else if (data?.submittedCheckIns) {
      setSubmittedCheckIns(data.submittedCheckIns);
      LocalStorageService.setItem('submittedCheckInResponse', data.submittedCheckIns);
    } else {
      setSubmittedCheckIns(undefined);
    }
  }, [setSubmittedCheckIns, data]);

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
        <Heading pb="8">Your submitted Check-ins</Heading>
        <Flex gap="4" direction="column">
          {submittedCheckIns?.map((checkin) => (
            <Card key={checkin?._id}>
              <CardBody>
                <Heading as="h4" size="md">
                  Check-in name: {checkin?.data?.checkInId}
                </Heading>
                <Text pt="2" fontSize="sm">
                  Submitted: {new Date(checkin.createdAt).toLocaleString('en-GB')}
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
