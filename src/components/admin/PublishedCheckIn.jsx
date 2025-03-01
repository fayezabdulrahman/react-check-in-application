import {
  Container,
  Divider,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Button
} from '@chakra-ui/react';
import { Card, CardBody, CardFooter } from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import { useEffect } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import Loading from '../shared/Loading';
import { useMutation } from '@tanstack/react-query';
import { fetchPublishedCheckInAnalytics } from '../../services/adminService';
import LocalStorageService from '../../util/LocalStorageService';

const PublishedCheckIn = () => {
  const { publishedCheckIn, checkInAnalytics, setCheckInAnalytics  } = useAdmin();
  const toast = useToast();

  const {
    mutate: fetchCheckInAnalyticMutate,
    isPending,
    isLoading
  } = useMutation({
    mutationFn: fetchPublishedCheckInAnalytics,
    onSuccess: (response) => {
      if (response) {
        console.log('analyitcs response ', response);
        setCheckInAnalytics(response);
        LocalStorageService.setItem('publishedCheckInAnalytics', response);
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
    const cachedAnalytics = LocalStorageService.getItem(
      'publishedCheckInAnalytics'
    );
    if (cachedAnalytics) {
      setCheckInAnalytics(cachedAnalytics);
    } else {
      const payload = { checkInId: publishedCheckIn.checkInId };
      // trigger mutate API Call
      fetchCheckInAnalyticMutate(payload);
    }
  }, [setCheckInAnalytics, fetchCheckInAnalyticMutate, publishedCheckIn]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Heading>
        Your Published Check-in
      </Heading>
      <Card mt="1rem">
        <CardBody>
          <Heading size="md" mb="1rem">
            Check-in name: {publishedCheckIn.checkInId}
          </Heading>
          <Stat>
            <StatLabel>Responses</StatLabel>
            <StatNumber>{checkInAnalytics.count}</StatNumber>
            <StatHelpText>
              As of {new Date().toLocaleString('en-GB')}
            </StatHelpText>
          </Stat>
        </CardBody>
        {checkInAnalytics.count !== 0 && (
          <>
            <Divider />

            <CardFooter
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <ChakraLink
                as={ReactRouterLink}
                to="/admin/publishedCheckIn"
                state={{ checkInAnalytics: checkInAnalytics }}
              >
                View Results
              </ChakraLink>
              <Button
                isLoading={isPending}
                loadingText="Refreshing"
                colorScheme="orange"
                variant="outline"
                onClick={() =>
                  fetchCheckInAnalyticMutate({
                    checkInId: publishedCheckIn.checkInId
                  })
                }
              >
                Refresh
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </Container>
  );
};

export default PublishedCheckIn;
