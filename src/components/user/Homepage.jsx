import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import CheckInForm from './CheckInForm';
import SubmittedCheckIn from './SubmittedCheckIn';
// const Homepage = () => {
//   return (
//     <>
//       <Tabs isFitted variant="enclosed" m={4}>
//         <TabList mb="1em">
//           <Tab>Active Check-ins</Tab>
//           <Tab>Submitted Check-ins</Tab>
//         </TabList>
//         <TabPanels>
//           <TabPanel>
//             <CheckInForm />
//           </TabPanel>
//           <TabPanel>
//             <SubmittedCheckIn />
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </>
//   );
// };

const Homepage = () => {
  return (
    <Container maxW="container.lg" py={8}>
      <Flex direction="column" gap={8}>
        <Box>
          <Heading size="lg" mb={4}>Current Check-in</Heading>
          <CheckInForm />
        </Box>
      </Flex>
    </Container>
  );
};

export default Homepage;
