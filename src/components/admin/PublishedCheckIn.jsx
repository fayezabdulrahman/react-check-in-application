import {
  Container,
  Divider,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton
} from '@chakra-ui/react';
import { Card, CardBody, CardFooter } from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminProvider';
import { useEffect, useState } from 'react';
import { client } from '../../util/axios-util';
import { IoIosRefresh } from 'react-icons/io';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import Loading from '../shared/Loading';

const PublishedCheckIn = () => {
  const { publishedCheckIn } = useAdmin();
  const [checkInAnalytics, setCheckInAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedAnalytics = localStorage.getItem('publishedCheckInAnalytics');
    if (cachedAnalytics) {
      setCheckInAnalytics(JSON.parse(cachedAnalytics));
    } else {
      fetchPublishedCheckInAnalytics();
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedCheckIn]);

  const fetchPublishedCheckInAnalytics = async () => {
    setLoading(true);
    const payload = { checkInId: publishedCheckIn.checkInId };

    await client
      .post('/admin/checkInAnayltics', payload)
      .then((response) => {
        setCheckInAnalytics(response.data);
        console.log('response from server for analytics', response.data);
        localStorage.setItem(
          'publishedCheckInAnalytics',
          JSON.stringify(response.data)
        );
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <Heading color="gray.500" m="1rem 0 0 1rem">
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
