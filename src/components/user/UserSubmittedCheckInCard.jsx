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
import useCheckInStore from '../../store/checkin-store';

const UserSubmittedCheckInCard = ({ userSubmittedCheckIn }) => {
  const setToggleUserViewSubmittedCheckInModal = useCheckInStore(
    (state) => state.setToggleUserViewSubmittedCheckInModal
  );

  return (
    <Box
      p={4}
      pl={3}
      pr={4}
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.100"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
      minHeight="160px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
      overflow="hidden"
    >
      {/* Accent Bar */}
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        width="6px"
        bgGradient="linear(to-b, orange.400, orange.300)"
        borderTopLeftRadius="2xl"
        borderBottomLeftRadius="2xl"
      />

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
            {userSubmittedCheckIn.data.checkInId}
          </Text>
          <Badge
            colorScheme="green"
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
          Submitted at{' '}
          {new Date(userSubmittedCheckIn.createdAt).toLocaleString('en-GB')}
        </Text>
      </Box>

      {/* Footer with Actions */}
      <Flex
        justify="flex-end"
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
              onClick={() =>
                setToggleUserViewSubmittedCheckInModal(userSubmittedCheckIn)
              }
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default UserSubmittedCheckInCard;
