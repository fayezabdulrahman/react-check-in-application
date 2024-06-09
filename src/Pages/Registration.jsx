import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@chakra-ui/react';

import Login from '../components/Login';
import Signup from '../components/Signup';
const Registration = () => {
  return (
    <>
      <Container maxW="2xl" centerContent p={6} bg="black">
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg={'white'}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="2px"
        >
          <Text fontSize="2xl">Check Me In Application</Text>
        </Box>

        <Box bg="white" p={4} borderRadius="lg" borderWidth="2px" w="100%">
          <Tabs variant="soft-rounded" colorScheme="orange">
            <TabList mb="1rem">
              <Tab w="50%">Login</Tab>
              <Tab w="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Registration;
