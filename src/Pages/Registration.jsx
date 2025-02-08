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
import { useState } from 'react';
import backgroundLogo from '../assets/b2b_second.jpg';
const Registration = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  const switchToLoginTab = () => {
    setTabIndex(0);
  };

  return (
    <>
      <Box
        bgImage={`url(${backgroundLogo})`}
        bgSize="cover"
        bgPosition="center"
        height="100vh"
        padding={'5rem'}
      >
        <Container maxW="2xl" centerContent p={6} bg={'white'} >
          <Box
            display="flex"
            justifyContent="center"
            p={3}
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="2px"
          >
            <Text fontSize="2xl">Ez Check-ins</Text>
          </Box>

          <Box p={4} borderRadius="lg" borderWidth="2px" w="100%">
            <Tabs
              variant="soft-rounded"
              colorScheme="orange"
              index={tabIndex}
              onChange={handleTabChange}
            >
              <TabList mb="1rem">
                <Tab w="50%">Login</Tab>
                <Tab w="50%">Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup switchToLoginTab={switchToLoginTab} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Registration;
