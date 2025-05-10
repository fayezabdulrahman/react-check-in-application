import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import useAdminService from './services/useAdminService';

export const useCreateCheckIn = (options = {}) => {
  const {
    afterSuccess,
    afterError,
    onSuccessMessage = 'Check-in Created!',
    onErrorMessage = 'Error Creating Check-in',
    customSuccessToast,
    customErrorToast,
    refetchQueryKeys = [['allAdminCheckIn']]
  } = options;

  const { createAdminCheckIn } = useAdminService();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createAdminCheckIn,
    onSuccess: () => {
      if (customSuccessToast) {
        toast(customSuccessToast());
      } else {
        toast({
          title: onSuccessMessage,
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      }

      refetchQueryKeys.forEach((key) => queryClient.refetchQueries(key));

      if (afterSuccess) afterSuccess();
    },
    onError: (error) => {
      if (customErrorToast) {
        toast(customErrorToast());
      } else {
        toast({
          title: onErrorMessage,
          description:
            error?.response?.data?.message || 'An unexpected error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }

      if (afterError) afterError();
    }
  });
};
