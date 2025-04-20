import { Heading, Grid, Box, Flex } from '@chakra-ui/react';
import CreateCheckIn from './CreateCheckIn';
import PublishedCheckIn from './PublishedCheckIn';

const AdminHomepage = () => {
  return (
    <Flex direction="column" p={8} gap={8} minH="100vh">
      <Heading size="xl" mb={4}>
        Check-in Dashboard
      </Heading>

      <Grid
        templateColumns={{ base: '1fr', lg: '300px 1fr' }}
        gap={8}
        alignItems="start"
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        {/* Left Column - Status & Existing Check-ins */}
        <Box
          position={{ lg: 'sticky' }}
          top={{ lg: '8' }}
          display="flex"
          flexDirection="column"
          gap={6}
          w={{ base: '100%', lg: '300px' }}
        >
          <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
            <Heading size="md" mb={4}>
              Published Status
            </Heading>
            <PublishedCheckIn />
          </Box>
        </Box>

        {/* Right Column - Check-in Builder */}
        <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
          <Heading size="md" mb={6}>
            Create New Check-in
          </Heading>
          <CreateCheckIn />
        </Box>
      </Grid>
    </Flex>
  );
};

export default AdminHomepage;
