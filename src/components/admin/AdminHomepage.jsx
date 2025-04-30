import { Heading, Box, Flex } from '@chakra-ui/react';
import CreateCheckIn from './CreateCheckIn';

const AdminHomepage = () => {
  return (
    <Flex direction="column" p={{ base: 4, md: 8 }} gap={8} minH="100vh">
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="lg"
        p={{ base: 4, md: 6 }}
        w="100%"
        maxW="100%"
        borderLeft="6px solid"
        borderColor="green.400"
      >
        <Heading size="lg" mb={6}>
          Create New Check-in
        </Heading>
        <CreateCheckIn />
      </Box>
    </Flex>
  );
};

export default AdminHomepage;
