import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast
} from '@chakra-ui/react';
import AvailableCheckIn from './AvailableCheckIn';
import CreateCheckIn from './CreateCheckIn';
import { useEffect } from 'react';
import { useAdmin } from '../../context/AdminProvider';
import PublishedCheckIn from './PublishedCheckIn';
import Loading from '../shared/Loading';
import { INTIAL_CHECKIN_STATE } from '../../constants/application';
import LocalStorageService from '../../util/LocalStorageService';
import usePublishedCheckInQuery from '../../hooks/usePublishedCheckInQuery';

const AdminHomepage = () => {
  // when page loads - call api to fetch db to check for publishedChekIn
  // if no published check in - render code to ask admin to create check in
  // if published check in - load check in for admin to view it
  const { setPublishedCheckIn, publishedCheckIn } = useAdmin();
  const toast = useToast();

  const {
    data: publishedCheckinData,
    isPending: publishedCheckinIsPending,
    isLoading,
    error: PublishedCheckinError
  } = usePublishedCheckInQuery();

  useEffect(() => {
    const cachedPublishedCheckIn = LocalStorageService.getItem('publishedCheckIn');
    if (cachedPublishedCheckIn) {
      console.log('cached published check-in ', cachedPublishedCheckIn);
      setPublishedCheckIn(cachedPublishedCheckIn);
    } else if (publishedCheckinData?.checkIn) {
      console.log('use mutation check in data complete admin homepage', publishedCheckinData);
      const publishedCheckInDB = publishedCheckinData.checkIn;
      setPublishedCheckIn(publishedCheckInDB);
      LocalStorageService.setItem(
        'publishedCheckIn',
        publishedCheckInDB
      );
    } else {
      setPublishedCheckIn(INTIAL_CHECKIN_STATE);
    }
  }, [publishedCheckinData, setPublishedCheckIn]);

  if (isLoading || publishedCheckinIsPending) {
    return <Loading />;
  }
  if (PublishedCheckinError) {
    toast({
      title: 'An error occured.',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
    return <p>Failed to fetch published check in. Please try again later...</p>;
  }

  const isPublishCheckIn = publishedCheckIn.checkInId && publishedCheckIn.published;
  let content = (
    <>{!isPublishCheckIn ? <CreateCheckIn /> : <PublishedCheckIn />}</>
  );

  return (
    <>
      <Tabs isFitted variant="enclosed" m={4}>
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
