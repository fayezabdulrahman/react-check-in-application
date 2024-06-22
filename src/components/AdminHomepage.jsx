import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import AvailableCheckIn from './AvailableCheckIn';
import CreateCheckIn from './CreateCheckIn';
import { useEffect, useState } from 'react';
import { client } from '../util/axios-util';
import { useAdminQuestion } from '../context/AdminProvider';
import PublishedCheckIn from './PublishedCheckIn';
import Loading from './Loading';

const AdminHomepage = () => {
  // when page loads - call api to fetch db to check for publishedChekIn
  // if no published check in - render code to ask admin to create check in
  // if published check in - load check in for admin to view it
  const { setPublishedCheckIn, publishedCheckIn, checkIn } = useAdminQuestion();
  const [loading, setLoading] = useState(true);
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

  console.log('admin homepage state value ', checkIn);
  const isPublishCheckIn = publishedCheckIn && publishedCheckIn.published;
  let content = (
    <>{!isPublishCheckIn ? <CreateCheckIn /> : <PublishedCheckIn />}</>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Tabs isFitted variant="enclosed" m={4} isLazy>
        <TabList mb="1em">
          <Tab>Active Check-ins</Tab>
          <Tab>Created Check-ins</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{content}</TabPanel>
          <TabPanel>
            <AvailableCheckIn />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default AdminHomepage;
