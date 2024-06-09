import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CheckInForm from './CheckInForm';
import SubmittedCheckin from './SubmittedCheckin';
import { useAuth } from '../context/AuthProvider';
const Homepage = () => {
  // const {token} = useAuth();
  // console.log('homepage token', token);
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
