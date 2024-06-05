import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CheckInForm from './CheckInForm';
import SubmittedCheckin from './SubmittedCheckin';
import { UserContext } from '../hooks/auth';
import { useContext } from 'react';
const Homepage = () => {
  const {user} = useContext(UserContext);
  console.log('user details in homepage', user);
  return (
    <>
      <Tabs isFitted variant="enclosed" m={4}>
        <TabList mb="1em">
          <Tab>Active Check-ins</Tab>
          <Tab>Submitted Check-ins</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CheckInForm />
          </TabPanel>
          <TabPanel>
            <SubmittedCheckin />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Homepage;
