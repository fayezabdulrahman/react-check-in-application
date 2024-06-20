import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import AvailableCheckIn from './AvailableCheckIn';
import CreateCheckIn from './CreateCheckIn';
import { useEffect } from 'react';
import { client } from '../util/axios-util';
import { useAdminQuestion } from '../context/AdminProvider';

const AdminHomepage = () => {
  // when page loads - call api to fetch db to check for publishedChekIn
  // if no published check in - render code to ask admin to create check in
  // if published check in - load check in and give ability to edit/publish
  const { checkIn, setCheckIn } = useAdminQuestion();
  useEffect(() => {
    const fetchPublishedCheckin = async () => {
      await client.get('/admin/publishedCheckin').then((response) => {
        console.log('response from server', response.data);
        const serverResponse = response.data;
        if (serverResponse.checkIn !== null) {
          const availableCheckIn = serverResponse.checkIn;
          setCheckIn(availableCheckIn);
        }
      });
    };

    fetchPublishedCheckin();
  }, [setCheckIn]);
  const noCheckIn = checkIn.published;
  let content = <>{!noCheckIn ? <CreateCheckIn /> : <AvailableCheckIn />}</>;

  return (
    <>
      <Tabs isFitted variant="enclosed" m={4}>
        <TabList mb="1em">
          <Tab>Active Check-ins</Tab>
          <Tab>Created Check-ins</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{content}</TabPanel>
          <TabPanel>Your previous check in</TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default AdminHomepage;
