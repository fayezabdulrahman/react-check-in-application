import {
  IconButton,
  Skeleton,
  Flex,
  Link,
  Divider,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
  Text,
  useToast
} from '@chakra-ui/react';
import { Card, CardBody, CardFooter } from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import { useEffect } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import Loading from '../shared/Loading';
import { useMutation } from '@tanstack/react-query';
import useAdminService from '../../hooks/services/useAdminService';
import LocalStorageService from '../../util/LocalStorageService';
import usePublishedCheckInAnalytics from '../../hooks/usePublishedCheckInAnalytics';
import usePublishedCheckInQuery from '../../hooks/usePublishedCheckInQuery';

const PublishedCheckIn = () => {
  const { publishedCheckIn, checkInAnalytics } = useAdmin();
  const toast = useToast();

  const { isLoading: publishedCheckinIsLoading } = usePublishedCheckInQuery();

  const {
    isLoading: publishedAnalyticsLoading,
    isPending: publishedAnalyticsPending,
    error: publishedCheckInAnalyticsError,
    refetch
  } = usePublishedCheckInAnalytics();

  useEffect(() => {
    if (publishedCheckInAnalyticsError) {
      console.log('error ', publishedCheckInAnalyticsError);
      toast({
        title: 'Failed to get published check-in responses.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }, [publishedCheckInAnalyticsError, toast]);

  if (publishedAnalyticsLoading || publishedCheckinIsLoading) {
    return <Loading />;
  }

  return (
    <Card variant="outline" width="100%">
      <CardBody>
        {!publishedCheckIn ? (
          <Box textAlign="center" py={8}>
            <Text fontSize="lg" color="gray.500">
              No check-in currently published
            </Text>
            <Text mt={2} fontSize="sm" color="gray.400">
              Publish a check-in to view responses
            </Text>
          </Box>
        ) : (
          <>
            <Heading size="md" mb={4} color="gray.700">
              {publishedCheckIn.checkInId}
            </Heading>

            <Stat>
              <StatLabel color="gray.600">Total Responses</StatLabel>
              <Skeleton isLoaded={!publishedAnalyticsPending}>
                <StatNumber fontSize="2xl">
                  {checkInAnalytics?.count || 0}
                </StatNumber>
              </Skeleton>
              <StatHelpText color="gray.500">
                Last updated: {new Date().toLocaleTimeString('en-GB')}
              </StatHelpText>
            </Stat>
          </>
        )}
      </CardBody>

      {publishedCheckIn && checkInAnalytics?.count > 0 && (
        <>
          <Divider />
          <CardFooter>
            <Flex justify="space-between" width="100%" align="center">
              <Link
                as={ReactRouterLink}
                to="/admin/publishedCheckIn"
                state={{ checkInAnalytics }}
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
                isLoading={publishedAnalyticsPending}
                onClick={() => refetch()}
              />
            </Flex>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default PublishedCheckIn;
