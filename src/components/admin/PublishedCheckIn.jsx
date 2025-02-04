import {
  Container,
  Divider,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { Card, CardBody, CardFooter } from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import { useEffect, useState } from 'react';
import { IoIosRefresh } from 'react-icons/io';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import Loading from '../shared/Loading';
import { useMutation } from '@tanstack/react-query';
import { fetchPublishedCheckInAnalytics } from '../../services/adminService';

const PublishedCheckIn = () => {
  const { publishedCheckIn } = useAdmin();
  const [checkInAnalytics, setCheckInAnalytics] = useState({});
  const toast = useToast();

  const {mutate: fetchCheckInAnalyticMutate, isPending } = useMutation({
    mutationFn: fetchPublishedCheckInAnalytics,
    onSuccess: (response) => {
      if (response) {
        console.log('analyitcs response ', response);
        setCheckInAnalytics(response);
        localStorage.setItem(
          'publishedCheckInAnalytics',
          JSON.stringify(response)
        );
      }
    },
    onError: () => {
      toast({
        title: 'Failed to get published check in responses.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  useEffect(() => {
    console.log('inside useEffectsss');
    const cachedAnalytics = localStorage.getItem('publishedCheckInAnalytics');
    if (cachedAnalytics) {
      setCheckInAnalytics(JSON.parse(cachedAnalytics));
    } else {
      const payload = { checkInId: publishedCheckIn.checkInId };
      // trigger mutate API Call
      fetchCheckInAnalyticMutate(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCheckInAnalytics, fetchCheckInAnalyticMutate]);

  if (isPending) {
    return <Loading />;
  }

  return (
    <Container>
      <Heading color="gray.500" m="1rem 0 1rem 1rem">
        Your published check-in
      </Heading>
      <Card>
        <CardBody>
          <Heading size="md" mb="1rem">
            {publishedCheckIn.checkInId}
          </Heading>
          <Stat>
            <StatLabel>Responses</StatLabel>
            <StatNumber>{checkInAnalytics.count}</StatNumber>
            <StatHelpText>
              As of {new Date().toLocaleString() + ''}
            </StatHelpText>
          </Stat>
        </CardBody>
        {checkInAnalytics.count !== 0 && (
          <>
            <Divider />

            <CardFooter display="flex" justifyContent="space-between">
              <ChakraLink
                as={ReactRouterLink}
                to="/admin/publishedCheckIn"
                state={{ checkInAnalytics: checkInAnalytics }}
              >
                View
              </ChakraLink>
              <IconButton
                aria-label="Search database"
                icon={<IoIosRefresh />}
                onClick={fetchPublishedCheckInAnalytics}
              />
            </CardFooter>
          </>
        )}
      </Card>
    </Container>
  );
};

export default PublishedCheckIn;
