import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState, useCallback } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  Box,
  Heading,
  IconButton,
  Tooltip,
  Text,
  Divider,
  useToast,
  Stack
} from '@chakra-ui/react';
import { FaDownload } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import '../../styles/AgGridCustomStyles.css';

const TruncatedTextRenderer = (params) => {
  const text = params.value || '';

  return (
    <Tooltip label={text} hasArrow>
      <Box
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        cursor="default"
        maxW="100%"
      >
        {text}
      </Box>
    </Tooltip>
  );
};

const DetailedPublishedCheckIn = () => {
  const location = useLocation();
  const { state } = location;
  const checkInName = state?.checkIn?.checkInId || '';
  const checkIn = state?.checkIn || null; // full check in object with responses and questions
  const toast = useToast();
  const [gridApi, setGridApi] = useState(null);
  const [filtersActive, setFiltersActive] = useState(false);

  const transformData = (data) => {
    if (!data || data.responses.length === 0) return { questions: [], answers: [] };

    // Get unique questions with their labels and IDs
    const questions = data.questions.map((q) => ({
      id: q.id,
      label: q.label
    }));

    // Map answers using questionId as the field
    const answers = data.responses.map((item) => ({
      fullName: `${item.submittedBy.firstName} ${item.submittedBy.lastName}`,
      ...Object.fromEntries(
        item.answers.map((a) => [a.questionId.toString(), a.answer])
      )
    }));

    return { questions, answers };
  };

  const { questions, answers } = transformData(checkIn);

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

    const questionColumns =
      questions?.map((question) => ({
        headerName: question.label, // display question text
        field: question.id.toString(), // use questionId as field, must match answer keys
        cellRenderer: TruncatedTextRenderer,
        filter: 'agTextColumnFilter',
        headerTooltip: question.label
      })) || [];

    return state.checkIn.anonymous
      ? questionColumns
      : [userColumn, ...questionColumns];
  }, [questions, state?.checkIn?.anonymous]);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      filter: true,
      wrapText: true,
      autoHeight: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }),
    []
  );

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();

    params.api.addEventListener('filterChanged', () => {
      setFiltersActive(params.api.isAnyFilterPresent());
    });
  }, []);

  const handleExport = useCallback(() => {
    if (!gridApi) return;

    gridApi.exportDataAsCsv({
      fileName: `Checkin-responses-${checkInName}-${new Date()
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

  const clearFilters = useCallback(() => {
    if (!gridApi) return;

    gridApi.setFilterModel(null); // Clears all filters
    setFiltersActive(false); // Reset state
  }, [gridApi]);

  if (checkIn.responses.length === 0) {
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
      <Stack
        justifyContent="space-between"
        mb={4}
        direction={{ base: 'column', sm: 'row' }}
        spacing={4}
        align={{ base: 'flex-start', sm: 'center' }}
      >
        <Box>
          <Heading size="lg">Results for {checkInName}</Heading>
          <Text color="gray.500" mt={1}>
            {answers.length} Responses Collected
          </Text>
        </Box>

        <Stack direction="row" spacing={2}>
          <Tooltip label="Clear Filters" hasArrow>
            <IconButton
              icon={<MdFilterAltOff />}
              onClick={clearFilters}
              isDisabled={!filtersActive}
              aria-label="Clear Filters"
              variant="outline"
            />
          </Tooltip>

          <Tooltip label="Export CSV" hasArrow>
            <IconButton
              icon={<FaDownload />}
              onClick={handleExport}
              aria-label="Export CSV"
              colorScheme="blue"
            />
          </Tooltip>
        </Stack>
      </Stack>
      <Divider mb={4} />

      <Box
        className="ag-grid-container ag-theme-quartz"
        height="500px"
        width="100%"
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
          paginationPageSize={50}
          suppressRowClickSelection={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          tooltipShowDelay={0}
        />
      </Box>
    </Box>
  );
};

export default DetailedPublishedCheckIn;
