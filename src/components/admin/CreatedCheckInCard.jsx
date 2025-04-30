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
  MdOutlineQuestionAnswer,
  MdOutlineRemoveRedEye
} from 'react-icons/md';
import useCheckInStore from '../../store/checkin-store';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const CreatedCheckInCard = ({
  availableCheckIn,
  publishCheckIn,
  unPublishCheckIn,
  deleteCheckIn
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const setAdminAction = useCheckInStore((state) => state.setAdminAction);
  const adminAction = useCheckInStore((state) => state.adminAction);
  const navigate = useNavigate();

  const setSubmittedCheckInToEdit = useCheckInStore(
    (state) => state.setSubmittedCheckInToEdit
  );

  const handleEditCheckIn = (checkIn) => {
    setSubmittedCheckInToEdit(checkIn);
  };

  const handleViewCheckInResponses = (checkIn) => {
    navigate('/admin/checkInResults', {
      state: {
        checkIn
      }
    });
  };

  const handleAction = (checkInId, actionType) => {
    setAdminAction(actionType);
    setIsProcessing(checkInId === availableCheckIn.checkInId);

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
  const isPublishing =
    isProcessing &&
    adminAction.actionInProgress &&
    adminAction.actionType === 'publish';
  const isUnpublishing =
    isProcessing &&
    adminAction.actionInProgress &&
    adminAction.actionType === 'unpublish';

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="lg"
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
            {isCurrentlyPublished ? 'Active' : 'Draft'}
          </Badge>
        </Flex>
      </Box>

      {/* Metadata */}
      <Box mt={2} mb={4}>
        <Text fontSize="sm" color="gray.500" noOfLines={2}>
          Created by {availableCheckIn.createdBy}
        </Text>
        {availableCheckIn.anonymous && (
          <Text fontSize="sm" color="gray.500" noOfLines={2}>
            This Check-in is anonymous
          </Text>
        )}
        <Flex
          align="center"
          justify="space-between"
          bg="gray.50"
          p={3}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.100"
          mt={2}
        >
          <Flex align="center" gap={2}>
            <Icon as={MdOutlineQuestionAnswer} color="blue.500" boxSize={5} />
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              Collected Responses
            </Text>
          </Flex>

          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {availableCheckIn.responseCount}
          </Text>
        </Flex>
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
          <Tooltip label={'View'}>
            <IconButton
              icon={<MdOutlineRemoveRedEye />}
              aria-label="Edit"
              onClick={() => handleViewCheckInResponses(availableCheckIn)}
              colorScheme="orange"
              variant="ghost"
            />
          </Tooltip>
          <Tooltip
            label={isCurrentlyPublished ? 'Edit disabled (active)' : 'Edit'}
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

          <Tooltip label={isCurrentlyPublished ? 'Deactivate' : 'Activate'}>
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
            label={isCurrentlyPublished ? 'Delete disabled (active)' : 'Delete'}
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
