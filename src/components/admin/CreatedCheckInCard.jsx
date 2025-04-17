import {
  ButtonGroup,
  Tooltip,
  Icon,
  Box,
  Flex,
  IconButton,
  Text,
  Badge
} from '@chakra-ui/react';
import {
  MdDeleteOutline,
  MdEdit,
  MdUnpublished,
  MdPublish,
  MdOutlineQuestionAnswer
} from 'react-icons/md';
import { useAdmin } from '../../context/AdminProvider';
import useCheckInStore from '../../store/checkin-store';
const CreatedCheckInCard = ({
  availableCheckIn,
  publishCheckIn,
  unPublishCheckIn,
  deleteCheckIn
}) => {
  const { performingAdminAction } = useAdmin();
  const setAdminAction = useCheckInStore((state) => state.setAdminAction);
  const setSubmittedCheckInToEdit = useCheckInStore(
    (state) => state.setSubmittedCheckInToEdit
  );

  const handleEditCheckIn = (checkIn) => {
    setSubmittedCheckInToEdit(checkIn);
  };

  const handleAction = (checkInId, actionType) => {
    setAdminAction(actionType);

    if (actionType === 'publish') {
      const payload = {
        checkInToPublish: checkInId
      };
      // call publishCheckIn from parent component and pass in payload
      publishCheckIn(payload);
    }
    if (actionType === 'unpublish') {
      const payload = {
        checkInToUnpublish: checkInId
      };
      // call unpublish from parent component and pass payload
      unPublishCheckIn(payload);
    }
    if (actionType === 'delete') {
      // call delete from parent component and pass payload
      const payload = {
        checkInToDelete: checkInId
      };
      deleteCheckIn(payload);
    }
  };

  const isCurrentlyPublished = availableCheckIn.published;
  const isProcessing =
    performingAdminAction.actionInProgress &&
    performingAdminAction.checkInId === availableCheckIn.checkInId;
  const isPublishing =
    isProcessing && performingAdminAction.actionType === 'publish';
  const isUnpublishing =
    isProcessing && performingAdminAction.actionType === 'unpublish';

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
            {availableCheckIn.checkInId}
          </Text>
          <Badge
            colorScheme={isCurrentlyPublished ? 'green' : 'gray'}
            variant="subtle"
            position="absolute"
            right="0"
            top="0"
            fontSize="xs"
          >
            {isCurrentlyPublished ? 'Live' : 'Draft'}
          </Badge>
        </Flex>
      </Box>

      {/* Metadata */}
      <Box mt={2} mb={4}>
        <Text fontSize="sm" color="gray.500" noOfLines={2}>
          Created by {availableCheckIn.createdBy}
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
        <Flex align="center" gap={1}>
          <Icon as={MdOutlineQuestionAnswer} color="gray.500" boxSize={4} />
          <Text fontSize="sm" color="gray.600">
            {availableCheckIn.questions.length}
          </Text>
        </Flex>

        <ButtonGroup variant="ghost" size="sm" spacing={1}>
          <Tooltip
            label={isCurrentlyPublished ? 'Edit disabled (published)' : 'Edit'}
          >
            <IconButton
              icon={<MdEdit />}
              aria-label="Edit"
              onClick={() => handleEditCheckIn(availableCheckIn)}
              isDisabled={isCurrentlyPublished}
              colorScheme="gray"
              variant="ghost"
            />
          </Tooltip>

          <Tooltip label={isCurrentlyPublished ? 'Unpublish' : 'Publish'}>
            <IconButton
              icon={isCurrentlyPublished ? <MdUnpublished /> : <MdPublish />}
              aria-label={isCurrentlyPublished ? 'Unpublish' : 'Publish'}
              isLoading={isPublishing || isUnpublishing}
              onClick={() =>
                handleAction(
                  availableCheckIn.checkInId,
                  isCurrentlyPublished ? 'unpublish' : 'publish'
                )
              }
              colorScheme={isCurrentlyPublished ? 'orange' : 'green'}
            />
          </Tooltip>

          <Tooltip
            label={
              isCurrentlyPublished ? 'Delete disabled (published)' : 'Delete'
            }
          >
            <IconButton
              icon={<MdDeleteOutline />}
              aria-label="Delete"
              colorScheme="red"
              isDisabled={isCurrentlyPublished}
              onClick={() => handleAction(availableCheckIn.checkInId, 'delete')}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default CreatedCheckInCard;
