import {
  ButtonGroup,
  Tooltip,
  Box,
  Flex,
  IconButton,
  Text,
  Badge
} from '@chakra-ui/react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
const UserSubmittedCheckInCard = ({ allUserSubmittedCheckIns }) => {
  return (
    <Box
      p={4}
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.100"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
      minHeight="140px" // Fixed minimum height
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      {/* Header Section */}
      <Box position="relative">
        <Flex align="center" gap={2} mb={2}>
          <Text
            fontSize="md"
            fontWeight="600"
            color="gray.700"
            isTruncated
            maxWidth="70%"
          >
            {allUserSubmittedCheckIns.data.checkInId}
          </Text>
          <Badge
            colorScheme={'green'}
            variant="subtle"
            position="absolute"
            right="0"
            top="0"
            fontSize="xs"
          >
            Submitted
          </Badge>
        </Flex>
      </Box>

      {/* Metadata */}
      <Box mt={2} mb={4}>
        <Text fontSize="sm" color="gray.500" noOfLines={2}>
          Submitted at {new Date(allUserSubmittedCheckIns.createdAt).toLocaleDateString('en-GB')}
        </Text>
      </Box>

      {/* Footer with Actions */}
      <Flex
        justify="space-between"
        align="center"
        borderTop="1px solid"
        borderColor="gray.100"
        pt={3}
      >
        <ButtonGroup variant="ghost" size="sm" spacing={1}>
          <Tooltip label={'View'}>
            <IconButton
              icon={<MdOutlineRemoveRedEye />}
              aria-label="View"
              colorScheme="orange"
              onClick={() => console.log('ADD VIEW QUESTION SUBMITTED')}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default UserSubmittedCheckInCard;
