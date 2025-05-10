import {
  Button,
  CardFooter,
  Input,
  useToast,
  Text,
  Tooltip,
  Checkbox,
  Flex,
  Stack,
  Icon,
  Box
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useLocalAuth } from '../../context/LocalAuthProvider';
import { MdPublish, MdHelpOutline } from 'react-icons/md';
import useCheckInStore from '../../store/checkin-store';
import { useCreateCheckIn } from '../../hooks/useCreateCheckIn';

export const CheckInSubmitter = () => {
  const questions = useCheckInStore((state) => state.questions);
  const resetQuestions = useCheckInStore((state) => state.resetQuestions);

  const { userDetails } = useLocalAuth();
  const toast = useToast();
  const checkInNameRef = useRef();
  const [isCheckInAnonymous, setIsCheckInAnonymous] = useState(false);

  const { mutate: saveCheckIn, isPending} = useCreateCheckIn({
    refetchQueryKeys: [['allAdminCheckIn']],
    afterSuccess: resetQuestions
  });

  const handleSaveCheckIn = () => {
    if (!checkInNameRef.current.value.trim()) {
      toast({
        title: 'Check-in name is Required',
        status: 'error',
        duration: 2000
      });
      return;
    }

    const checkInToSave = {
      checkInId: checkInNameRef.current.value.trim(),
      createdBy: `${userDetails.firstName} ${userDetails.lastName}`,
      questions: questions,
      published: false,
      anonymous: isCheckInAnonymous
    };

    saveCheckIn(checkInToSave);
  };

  return (
    <>
      {questions.length > 0 ? (
        <Stack spacing={6} p={4} maxW="600px" mx="auto" w="full">
          <Box>
            <Input
              placeholder="Enter Check-in name"
              ref={checkInNameRef}
              size="lg"
              shadow="sm"
              borderColor="gray.300"
              _focus={{ borderColor: 'orange.400', shadow: 'md' }}
            />
          </Box>

          <Flex align="center" gap={2} wrap="wrap">
            <Checkbox
              isChecked={isCheckInAnonymous}
              onChange={(e) => setIsCheckInAnonymous(e.target.checked)}
              size="lg"
              colorScheme="orange"
            >
              Anonymous
            </Checkbox>
            <Tooltip
              label="Selecting this will make this check-in anonymous"
              fontSize="sm"
              hasArrow
              placement="bottom"
            >
              <span>
                <Icon
                  as={MdHelpOutline}
                  color="gray.500"
                  _hover={{ color: 'gray.700' }}
                  boxSize={5}
                  cursor="help"
                />
              </span>
            </Tooltip>
          </Flex>

          <CardFooter justifyContent={'center'} p={0}>
            <Button
              colorScheme="green"
              rightIcon={<MdPublish />}
              onClick={handleSaveCheckIn}
              isLoading={isPending}
              size="lg"
            >
              Create
            </Button>
          </CardFooter>
        </Stack>
      ) : (
        <Text textAlign="center" color="gray.500" fontSize="lg" >
          Add your first question to begin
        </Text>
      )}
    </>
  );
};
