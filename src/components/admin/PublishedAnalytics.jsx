import {
  Skeleton,
  Flex,
  Link,
  Card,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  CardBody,
  CardFooter,
  Divider,
  useToast
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import Loading from '../shared/Loading';

import usePublishedCheckInAnalytics from '../../hooks/usePublishedCheckInAnalytics';
import { useEffect, useState } from 'react';
import useCheckInStore from '../../store/checkin-store';

const PublishedAnalytics = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const setCheckInResponses = useCheckInStore(
    (state) => state.setCheckInResponses
  );
  const checkInResponses = useCheckInStore((state) => state.checkInResponses);

  const toast = useToast();

  const { data, isLoading, isPending, error, refetch } =
    usePublishedCheckInAnalytics();

  // if we have a check-in analytics from our backend and our store is empty
  // set the store to the check-in analytics from our backend
  useEffect(() => {
    if (data?.responses.length > 0 && checkInResponses.length === 0) {
      setCheckInResponses(data.responses);
    }
  }, [data, checkInResponses, setCheckInResponses]);

  if (isLoading || isPending) {
    return <Loading />;
  }
  if (error) {
    console.log('error ', error);
    toast({
      title: 'Failed to get published check-in responses.',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
  }

  const handleRefetch = async () => {
    try {
      const result = await refetch();
      if (result.status === 'success') {
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Refetch failed:', err);
      toast({
        title: 'Failed to refresh',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <>
      <Card variant="outline" width="100%">
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Total Responses</StatLabel>
            <Skeleton isLoaded={!isPending}>
              <StatNumber fontSize="2xl">{data?.count || 0}</StatNumber>
            </Skeleton>
            <StatHelpText color="gray.500">
              Last updated: {lastUpdated.toLocaleTimeString('en-GB')}
            </StatHelpText>
          </Stat>
        </CardBody>
        {data?.count > 0 && (
          <>
            <Divider />
            <CardFooter>
              <Flex justify="space-between" width="100%" align="center">
                <Link
                  as={ReactRouterLink}
                  to="/admin/publishedCheckIn"
                  state={{ data }}
                  color="blue.500"
                  fontWeight="500"
                  _hover={{ textDecoration: 'underline' }}
                >
                  View Results
                </Link>

                <IconButton
                  icon={<MdRefresh />}
                  variant="outline"
                  aria-label="Refresh analytics"
                  size="sm"
                  isLoading={isPending}
                  onClick={handleRefetch}
                />
              </Flex>
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );
};

export default PublishedAnalytics;
