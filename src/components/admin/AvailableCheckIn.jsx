import {
  Text,
  Heading,
  useToast,
  Box,
  Grid,
  Flex,
  IconButton,
  Tooltip,
  Stack,
  ButtonGroup
} from '@chakra-ui/react';
import { IoMdRefresh } from 'react-icons/io';
import { FaClipboardList } from 'react-icons/fa';
import { MdDensitySmall } from 'react-icons/md';
import { BsFolderCheck, BsFolderX } from 'react-icons/bs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CreatedCheckInCard from './CreatedCheckInCard';
import useAdminService from '../../hooks/services/useAdminService';
import useCheckInStore from '../../store/checkin-store';
import ErrorMessage from '../shared/ErrorMesssage';
import SkeletonLoader from '../shared/SkeletonLoader';
import { useState } from 'react';

const AvailableCheckIn = () => {
  const {
    fetchAllAdminCheckIn,
    publishNewCheckIn,
    unPublishCheckIn,
    deleteCheckIn
  } = useAdminService();

  const openDeleteModal = useCheckInStore((state) => state.openDeleteModal);

  const resetAdminAction = useCheckInStore((state) => state.resetAdminAction);

  const queryCleint = useQueryClient();

  const toast = useToast();

  // Add state for filtering
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'unpublished'

  const { data, isFetching, isLoading, error, refetch } = useQuery({
    queryKey: ['allAdminCheckIn'],
    queryFn: fetchAllAdminCheckIn,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  // Add filter function
  const filteredCheckIns =
    data?.checkIns?.filter((checkIn) => {
      if (filter === 'published') return checkIn.published;
      if (filter === 'unpublished') return !checkIn.published;
      return true; // 'all'
    }) || [];

  const { mutate: publishCheckInMutate } = useMutation({
    mutationFn: publishNewCheckIn,
    onSuccess: (response) => {
      const message = response.message;

      if (response.checkIn) {
        // reset performing action
        resetAdminAction();

        // refetch data
        queryCleint.refetchQueries({ queryKey: ['allAdminCheckIn'] });
      }

      toast({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onError: (error) => {
      // reset performing action
      resetAdminAction();
      toast({
        title: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const { mutate: unPublishCheckInMutate } = useMutation({
    mutationFn: unPublishCheckIn,
    onSuccess: (response) => {
      const message = response.message;
      if (response.checkIn) {
        // reset performing action
        resetAdminAction();
        // refetch data
        queryCleint.refetchQueries({ queryKey: ['allAdminCheckIn'] });
      }

      toast({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onError: (error) => {
      // reset performing action
      resetAdminAction();
      console.error(error);
      toast({
        title: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const { mutate: deleteCheckInMutate } = useMutation({
    mutationFn: deleteCheckIn,
    onSuccess: (response) => {
      const message = response.message;

      // refetch data
      queryCleint.refetchQueries({ queryKey: ['allAdminCheckIn'] });
      toast({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      // reset performing action
      resetAdminAction();
    },
    onError: (error) => {
      // reset performing action
      resetAdminAction();
      toast({
        title: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const handlePublishCheckIn = (payload) => {
    // Call mutate() to trigger API call
    publishCheckInMutate(payload);
  };

  const handleUnPublishCheckIn = (payload) => {
    // Call mutate() to trigger API call
    unPublishCheckInMutate(payload);
  };

  const handleDeleteCheckIn = (checkInId) => {
    openDeleteModal({
      id: checkInId,
      header: `Delete ${checkInId.checkInToDelete}`,
      body: 'Are you sure you want to Delete this Check-in ? This removes it for all admin users.',
      onConfirm: (payload) => deleteCheckInMutate(payload)
    });
  };

  if (isLoading || isFetching) {
    return (
      <Box m={12}>
        <Stack spacing={8}>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </Stack>
      </Box>
    );
  }
  if (error) {
    return (
      <Box mt={8}>
        <ErrorMessage
          message={`Failed to fetch all admin Check-ins due to ${error.message}`}
          onRetry={refetch}
        />
      </Box>
    );
  }

  return (
    <Box mt={4} pt={4} px={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={4}>
        <Flex direction="column">
          <Flex align="center" gap={2}>
            <FaClipboardList size={18} color="#4A5568" />
            <Heading size="md" fontWeight="600" color="gray.700">
              My Check-ins
            </Heading>
          </Flex>
          <Text fontSize="sm" color="gray.500" mt={1} fontWeight="normal">
            Manage your check-in forms
          </Text>
        </Flex>

        <Flex align="center" gap={4}>
          <ButtonGroup isAttached variant="outline" size="sm">
            <Tooltip label="All check-ins">
              <IconButton
                aria-label="All check-ins"
                icon={<MdDensitySmall />}
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'solid' : 'outline'}
                colorScheme="blue"
              />
            </Tooltip>
            <Tooltip label="Published check-ins">
              <IconButton
                icon={<BsFolderCheck />}
                aria-label="Published check-ins"
                onClick={() => setFilter('published')}
                variant={filter === 'published' ? 'solid' : 'outline'}
                colorScheme="green"
              >
                Active
              </IconButton>
            </Tooltip>
            <Tooltip label="Unpublished check-ins">
              <IconButton
                icon={<BsFolderX />}
                aria-label="Unpublished check-ins"
                onClick={() => setFilter('unpublished')}
                variant={filter === 'unpublished' ? 'solid' : 'outline'}
                colorScheme="orange"
              >
                Drafts
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          {data?.checkIns?.length > 0 && (
            <Tooltip label="Refresh">
              <IconButton
                aria-label="Refresh check-ins"
                icon={<IoMdRefresh />}
                onClick={refetch}
                variant="ghost"
                colorScheme="gray"
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>

      {filteredCheckIns.length === 0 ? (
        <Box
          textAlign="center"
          p={8}
          borderRadius="lg"
          border="1px dashed"
          borderColor="gray.200"
          bgGradient="linear(to-b, gray.50, white)"
        >
          <Text color="gray.500" mb={2}>
            No {filter === 'all' ? '' : filter} Check-in forms created!
          </Text>
        </Box>
      ) : (
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)'
          }}
          gap={6}
          pb={6}
        >
          {filteredCheckIns.map((available, index) => {
            const isPublished = available.published;
            return (
              <Box
                key={index}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.100"
                bg="white"
                position="relative"
                overflow="hidden"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s ease"
              >
                {/* Accent bar */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="4px"
                  bg={isPublished ? 'green.400' : 'orange.300'}
                />

                <Box px={4} pb={4} mt={2}>
                  <CreatedCheckInCard
                    availableCheckIn={available}
                    publishCheckIn={handlePublishCheckIn}
                    unPublishCheckIn={handleUnPublishCheckIn}
                    deleteCheckIn={handleDeleteCheckIn}
                  />
                </Box>
              </Box>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default AvailableCheckIn;
