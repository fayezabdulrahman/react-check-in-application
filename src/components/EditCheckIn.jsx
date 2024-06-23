import { useAdminQuestion } from '../context/AdminProvider';
import QuestionsSummary from './QuestionsSummary';
const EditCheckIn = ({ checkInId }) => {
  const { submittedCheckIns, setSubmittedCheckIns } = useAdminQuestion();
  console.log('test', checkInId);
  console.log(submittedCheckIns);
  const checkInToEdit = submittedCheckIns.find(
    (checkIn) => checkIn.checkInId === checkInId
  );
  console.log('check in to edit', checkInToEdit);

  return (
    <>
      <QuestionsSummary
        checkIn={checkInToEdit}
        setCheckIn={setSubmittedCheckIns}
        isSubmitted={true}
      />
    </>
  );
};

export default EditCheckIn;
