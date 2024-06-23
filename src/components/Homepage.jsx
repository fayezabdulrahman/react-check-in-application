import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CheckInForm from './user/CheckInForm';
import SubmittedCheckin from './admin/SubmittedCheckin';
const Homepage = () => {
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
