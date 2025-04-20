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
  useToast,
  Icon,
  Heading,
  Box,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { MdRefresh, MdAssignmentTurnedIn } from 'react-icons/md';
import LocalStorageService from '../../util/LocalStorageService';

import usePublishedCheckInAnalytics from '../../hooks/usePublishedCheckInAnalytics';
import { useEffect, useState } from 'react';
import useCheckInStore from '../../store/checkin-store';
import SkeletonLoader from '../shared/SkeletonLoader';

const PublishedAnalytics = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const setCheckInResponses = useCheckInStore(
    (state) => state.setCheckInResponses
  );

  const toast = useToast();

  const { data, isLoading, isPending, error, refetch } =
    usePublishedCheckInAnalytics();

  const cardBg = useColorModeValue('white', 'gray.800');
  const statColor = useColorModeValue('orange.500', 'orange.300');

  // if we have a check-in analytics from our backend and our store is empty
  // set the store to the check-in analytics from our backend
  useEffect(() => {
    if (data?.responses.length > 0) {
      setCheckInResponses(data.responses);
      LocalStorageService.setItem('checkInResponses', data.responses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading || isPending) {
    return <SkeletonLoader width="100%" height="20px" count={3} spacing={4} />;
  }
  if (error) {
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
    <Card
      variant="outline"
      width="100%"
      bg={cardBg}
      borderRadius="lg"
      boxShadow="sm"
    >
      <CardBody>
        {/* Title Row */}
        <Flex align="center" gap={3} mb={4}>
          <Icon as={MdAssignmentTurnedIn} boxSize={6} color={statColor} />
          <Box>
            <Heading size="md" fontWeight="semibold">
              {data?.checkInId || 'Untitled Check-in'}
            </Heading>
          </Box>
        </Flex>

        {/* Stat Block */}
        <Stat>
          <StatLabel color="gray.600">Total Responses</StatLabel>
          <Skeleton isLoaded={!isPending}>
            <StatNumber fontSize="3xl" fontWeight="bold">
              {data?.count || 0}
            </StatNumber>
          </Skeleton>
          <StatHelpText mt={1} color="gray.500">
            Last updated: {lastUpdated.toLocaleTimeString('en-GB')}
          </StatHelpText>
        </Stat>
      </CardBody>

      <Divider />

      <CardFooter>
        <Flex justify="space-between" align="center" width="100%">
          <Link
            as={ReactRouterLink}
            to="/admin/publishedCheckIn"
            color={statColor}
            fontWeight="semibold"
            fontSize="sm"
            _hover={{ textDecoration: 'underline' }}
          >
            View Results
          </Link>

          <Tooltip label="Refresh">
            <IconButton
              icon={<MdRefresh />}
              variant="ghost"
              aria-label="Refresh analytics"
              size="sm"
              isLoading={isPending}
              onClick={handleRefetch}
            />
          </Tooltip>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default PublishedAnalytics;
