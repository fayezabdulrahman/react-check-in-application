import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Container,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from '@chakra-ui/react';
import CreateCheckIn from './CreateCheckIn';

const AdminHomepage = () => {
  const noCheckIn = true;
  let content = (
    <>
      {noCheckIn ? (
        <Container>
          <Card>
            <CardHeader color='gray.500'>No Active Check</CardHeader>
            <CardBody>
              <Text>Create a check in for your clients</Text>
            </CardBody>
            <CardFooter>
              <Button colorScheme="orange">Create Check In</Button>
            </CardFooter>
          </Card>
        </Container>
      ) : (
        <CreateCheckIn />
      )}
    </>
  );

  return (
    <>
      <Tabs isFitted variant="enclosed" m={4}>
        <TabList mb="1em">
          <Tab>Active Check-ins</Tab>
          <Tab>Submitted Check-ins</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{content}</TabPanel>
          <TabPanel>tEST</TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default AdminHomepage;
