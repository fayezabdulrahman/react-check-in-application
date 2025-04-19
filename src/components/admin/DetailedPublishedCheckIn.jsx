import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState, useCallback } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  Box,
  Heading,
  HStack,
  Button,
  Tooltip,
  Text,
  Divider,
  useToast
} from '@chakra-ui/react';
import { FaDownload } from 'react-icons/fa';
import useCheckInStore from '../../store/checkin-store';

const TruncatedTextRenderer = (params) => {
  const header = params.colDef.headerName;
  const text = params.value || '';

  return (
    <Tooltip label={header} hasArrow>
      <Box
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        cursor="default"
      >
        {text}
      </Box>
    </Tooltip>
  );
};

const DetailedPublishedCheckIn = () => {
  const toast = useToast();
  const checkInResponses = useCheckInStore((state) => state.checkInResponses);
  const publishedCheckIn = useCheckInStore((state) => state.publishedCheckIn);
  const [gridApi, setGridApi] = useState(null);

  const transformData = (data) => {
    if (!data || data.length === 0) return { questions: [], answers: [] };

    const questions = data[0].answers.map((answer) => answer.question);
    const answers = data.map((item) => ({
      fullName: `${item.submittedBy.firstName} ${item.submittedBy.lastName}`,
      ...Object.fromEntries(item.answers.map((a) => [a.question, a.answer]))
    }));

    return { questions, answers };
  };

  const { questions, answers } = transformData(checkInResponses);

  const columnDefs = useMemo(() => {
    const userColumn = {
      headerName: 'Name',
      field: 'fullName',
      pinned: 'left',
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['contains', 'notContains'],
        maxNumConditions: 1
      }
    };

    return [
      userColumn,
      ...(questions?.map((question) => ({
        headerName: question,
        field: question,
        cellRenderer: TruncatedTextRenderer,
        filter: 'agTextColumnFilter'
      })) || [])
    ];
  }, [questions]);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      filter: true,
      wrapText: true,
      autoHeight: true,
      menuTabs: ['filterMenuTab'],
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }),
    []
  );

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const handleExport = useCallback(() => {
    if (!gridApi) return;

    gridApi.exportDataAsCsv({
      fileName: `Checkin-responses-${publishedCheckIn.checkInId}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
      processCellCallback: (params) => {
        if (params.column.getColDef().field === 'fullName') return params.value;
        return params.value?.toString() || '';
      }
    });
    toast({
      title: 'Export started',
      description: 'CSV export will download shortly',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
    // disabling es lint on purposes because we don't want this to re-render if published checkIn changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridApi, toast]);

  if (checkInResponses.length === 0) {
    return (
      <Box textAlign="center" p={10}>
        <Heading size="md" mb={4}>
          No responses available
        </Heading>
        <Text color="gray.500">
          Submitted check-in responses will appear here
        </Text>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="calc(100vh - 100px)"
      p={4}
    >
      <HStack justifyContent="space-between" mb={4}>
        <Box>
          <Heading size="lg">
            Check-in Results for {publishedCheckIn.checkInId}
          </Heading>
          <Text color="gray.500" mt={1}>
            {answers.length} responses collected
          </Text>
        </Box>
        <Button
          leftIcon={<FaDownload />}
          colorScheme="blue"
          onClick={handleExport}
          variant="solid"
        >
          Export CSV
        </Button>
      </HStack>
      <Divider mb={4} />

      <Box
        className="ag-theme-quartz"
        flex={1}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
      >
        <AgGridReact
          rowData={answers}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={20}
          domLayout="autoHeight"
          suppressRowClickSelection={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
        />
      </Box>
    </Box>
  );
};

export default DetailedPublishedCheckIn;
