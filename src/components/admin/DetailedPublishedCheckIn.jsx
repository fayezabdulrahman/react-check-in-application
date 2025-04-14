import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Box, Heading } from '@chakra-ui/react';
import useCheckInStore from '../../store/checkin-store';
const DetailedPublishedCheckIn = () => {
  const checkInResponses = useCheckInStore((state) => state.checkInResponses);

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

  const { questions, answers } = transformData(checkInResponses);

  // Define the columns for ag-Grid
  const columnDefs = useMemo(() => {
    const userColumns = [{ headerName: 'Name', field: 'fullName' }];

    const questionColumns = questions?.map((question) => ({
      headerName: question,
      field: question
    }));

    return [...userColumns, ...questionColumns];
  }, [questions]);

  const defaultColumns = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      wrapText: true,
      autoHeight: true,
      wrapHeaderText: true,
      autoHeaderHeight: true
    };
  }, []);

  return (
    <>
      <Box className="ag-theme-quartz" height="600" margin="1rem">
        <Heading mb="1rem">Check-in results</Heading>

        <AgGridReact
          rowData={answers}
          columnDefs={columnDefs}
          defaultColDef={defaultColumns}
        />
      </Box>
    </>
  );
};

export default DetailedPublishedCheckIn;
