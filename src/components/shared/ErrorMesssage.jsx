import { Box, Text, Button, Flex, Icon } from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';

const ErrorMessage = ({
  onRetry,
  message = 'Could not retrieve data at the moment'
}) => {
  return (
    <Box
      textAlign="center"
      p={6}
      borderRadius="md"
      bg="red.50"
      borderWidth="1px"
      borderColor="red.100"
      maxW="400px"
      mx="auto"
    >
      <Flex direction="column" align="center" gap={3}>
        <Icon as={FiAlertTriangle} w={10} h={10} color="red.400" />
        <Text fontSize="lg" fontWeight="medium" color="red.800">
          Oops!
        </Text>
        <Text color="gray.600" mb={4}>
          {message}
        </Text>
        {onRetry && (
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default ErrorMessage;
