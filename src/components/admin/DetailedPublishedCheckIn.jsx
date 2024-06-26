import { useLocation } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
const DetailedPublishedCheckIn = () => {
  const location = useLocation();
  const { checkInAnalytics } = location.state;
  console.log('checkInAnalytics ', checkInAnalytics);

  const transformData = (data) => {
    // Extract questions from the first set of answers
    const questions = data[0].answers.map((answer) => answer.question);

    // Extract answers grouped by each question
    const answers = data.map((item) => {
      const answerSet = {
        fullName: item.submittedBy.firstName + ' ' + item.submittedBy.lastName
      };
      item.answers.forEach((answer) => {
        answerSet[answer.question] = answer.answer;
      });
      return answerSet;
    });

    return { questions, answers };
  };

  const { questions, answers } = transformData(checkInAnalytics.questions);

  // Define the columns for ag-Grid
  const columnDefs = useMemo(() => {
    const userColumns = [{ headerName: 'Name', field: 'fullName' }];

    const questionColumns = questions.map((question) => ({
      headerName: question,
      field: question
    }));

    return [...userColumns, ...questionColumns];
  }, [questions]);
  console.log('questions', questions);
  console.log('answers', answers);

  return (
    <>
      <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          rowData={answers}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1 }}
        />
      </div>
    </>
  );
};

export default DetailedPublishedCheckIn;
