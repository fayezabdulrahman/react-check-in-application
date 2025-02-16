import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text
} from '@chakra-ui/react';
import { MdDeleteOutline } from 'react-icons/md';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useAdmin } from '../../context/AdminProvider';
const CreatedCheckInCard = ({availableCheckIn, publishCheckIn, unPublishCheckIn, deleteCheckIn}) => {
  const {performingAdminAction, setPerformingAdminAction} = useAdmin();
  
  const handleAction = (checkInId, actionType) => {
    setPerformingAdminAction({actionInProgress: true, actionType: actionType, checkInId: checkInId});

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
  const isProcessing = performingAdminAction.actionInProgress && performingAdminAction.checkInId === availableCheckIn.checkInId;
  const isPublishing = isProcessing && performingAdminAction.actionType === 'publish';
  const isUnpublishing = isProcessing && performingAdminAction.actionType === 'unpublish';
  
  return (
    <Card mt="1rem">
      <CardHeader>Check-in name: {availableCheckIn.checkInId}</CardHeader>
      <CardBody>
        <Text>Created By: {availableCheckIn.createdBy}</Text>
        <Text>Published: {isCurrentlyPublished ? 'Yes' : 'No'} </Text>
        <Text>Questions: {availableCheckIn.questions.length}</Text>
      </CardBody>
      <CardFooter justifyContent="space-between">
        <ButtonGroup>
          <Button
            isLoading={isPublishing || isUnpublishing}
            loadingText={isPublishing ? 'Publishing...' : isUnpublishing ? 'Unpublishing...' : ''}
            variant="solid"
            colorScheme="orange"
            onClick={() => handleAction(availableCheckIn.checkInId, isCurrentlyPublished ? 'unpublish' : 'publish')}
          >
            {isCurrentlyPublished ? 'Unpublish' : 'Publish'}
          </Button>
          <Button
            as={ReactRouterLink}
            to="/admin/editCheckIn"
            state={{ checkInId: availableCheckIn.checkInId }}
            variant="ghost"
            colorScheme="orange"
          >
            Edit
          </Button>
        </ButtonGroup>
        <Button
          leftIcon={<MdDeleteOutline />}
          onClick={() => handleAction(availableCheckIn.checkInId, 'delete')}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatedCheckInCard;
