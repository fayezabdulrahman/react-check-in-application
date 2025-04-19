import { useAuth0 } from '@auth0/auth0-react';
import QuestionModal from '../checkinBuilder/QuestionModal';
import EditCheckInModal from '../admin/EditCheckInModal';
import CaptureUserDetails from '../shared/CaptureUserDetails';
import ViewSubmittedCheckInModal from '../user/ViewSubmittedCheckInModal';

const ProtectedComponents = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading || !isAuthenticated) return null;

  return (
    <>
      <QuestionModal />
      <EditCheckInModal />
      <CaptureUserDetails />
      <ViewSubmittedCheckInModal />
    </>
  );
};

export default ProtectedComponents;
