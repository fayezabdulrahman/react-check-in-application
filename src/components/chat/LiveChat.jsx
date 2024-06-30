import { Box, VStack, Input, Button } from '@chakra-ui/react';

const LiveChat = () => {
  return (
    <Box flex="1" p={4} display="flex" flexDirection="column">
      <VStack
        align="stretch"
        flex="1"
        overflowY="auto"
        bg="gray.50"
        borderRadius="md"
        p={4}
      >
        {/* Chat messages will be rendered here */}
        chat message will be rendered here...
      </VStack>
      <Box mt={4}>
        <Input placeholder="Enter a message..." />
        <Button mt={2} colorScheme="teal">
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default LiveChat;
