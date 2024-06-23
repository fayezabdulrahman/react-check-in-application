import { Container } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Flex,
  Heading
} from '@chakra-ui/react';
import FormFactory from '../shared/FormFactory';
import { client } from '../../util/axios-util';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserProvider';
import Loading from '../shared/Loading';

const CheckInForm = () => {
  const { setPublishedCheckIn, publishedCheckIn } = useUser();
  const [loading, setLoading] = useState(true);

  async function handleSubmit() {
    console.log('submit api');
  }

  // call api to fetch publishedcheckIn
  useEffect(() => {
    const fetchPublishedCheckin = async () => {
      await client
        .get('/admin/publishedCheckin')
        .then((response) => {
          console.log('response from server', response.data);
          const serverResponse = response.data;
          if (serverResponse.checkIn !== null) {
            const publishedCheckInDB = serverResponse.checkIn;
            setPublishedCheckIn(publishedCheckInDB);
          }
        })
        .catch((error) => {
          console.log('error fetching published check-in', error);
        });
    };

    const fetchData = async () => {
      await fetchPublishedCheckin();
      setLoading(false);
    };

    fetchData();
  }, [setPublishedCheckIn]);

  if (loading) {
    return <Loading />;
  }
  return (
    <Container>
      {publishedCheckIn.questions.length > 0 ? (
        <>
          <Heading>Check-in available</Heading>
          <Flex flexDirection="column">
            {publishedCheckIn.questions?.map((quesetion, index) => (
              <FormFactory key={index} question={quesetion} />
            ))}
          </Flex>
        </>
      ) : (
        <>
          <Heading>No Check-in available</Heading>
        </>
      )}
    </Container>
  );
};

export default CheckInForm;
