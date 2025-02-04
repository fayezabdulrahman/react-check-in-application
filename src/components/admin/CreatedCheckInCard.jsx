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
    setPerformingAdminAction({actionInProgress: true, actionType: actionType});

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
  
  return (
    <Card mt="1rem">
      <CardHeader>Check-in name: {availableCheckIn.checkInId}</CardHeader>
      <CardBody>
        <Text>Created By: {availableCheckIn.createdBy}</Text>
        <Text>Published: {availableCheckIn.published ? 'Yes' : 'No'} </Text>
        <Text>Questions: {availableCheckIn.questions.length}</Text>
      </CardBody>
      <CardFooter justifyContent="space-between">
        <ButtonGroup>
          <Button
            isLoading={performingAdminAction.actionInProgress}
            loadingText="Publishing"
            variant="solid"
            colorScheme="orange"
            isDisabled={availableCheckIn.published}
            onClick={() => handleAction(availableCheckIn.checkInId, 'publish')}
          >
            Publish
          </Button>
          {availableCheckIn.published && (
            <Button
              variant="solid"
              colorScheme="orange"
              onClick={() => handleAction(availableCheckIn.checkInId, 'unpublish')}
            >
              Unpublish
            </Button>
          )}

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
          isLoading={performingAdminAction.actionInProgress}
          loadingText="Unpublishing..."
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
