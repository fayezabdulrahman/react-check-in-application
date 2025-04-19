import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Box
} from '@chakra-ui/react';
import useCheckInStore from '../../store/checkin-store';
import QuestionCard from '../checkinBuilder/QuestionCard';

const ViewSubmittedCheckInModal = () => {
  const toggleUserViewSubmittedCheckInModal = useCheckInStore(
    (state) => state.toggleUserViewSubmittedCheckInModal
  );
  const setToggleUserViewSubmittedCheckInModal = useCheckInStore(
    (state) => state.setToggleUserViewSubmittedCheckInModal
  );

  const userViewSubmittedCheckIn = useCheckInStore(
    (state) => state.userViewSubmittedCheckIn
  );

  const transformedQuestionsWithAnswers = userViewSubmittedCheckIn?.data?.questions?.map(
    (question) => {
      // Find matching answer for this question label
      const matchingAnswer = userViewSubmittedCheckIn?.data?.answers?.find(
        (answer) => answer.question === question.label
      );

      return {
        ...question,
        answer: matchingAnswer ? matchingAnswer.answer : null
      };
    }
  );

  return (
    <Modal
      isOpen={toggleUserViewSubmittedCheckInModal}
      onClose={setToggleUserViewSubmittedCheckInModal}
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.100">
          Submitted Check-in
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <Stack spacing={5}>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600" mb={1}>
                Check-in Name
              </FormLabel>
              <Input
                value={userViewSubmittedCheckIn?.data?.checkInId}
                isDisabled={true}
              />
            </FormControl>

            <Box>
              <FormLabel fontSize="sm" color="gray.600" mb={2}>
                Questions ({userViewSubmittedCheckIn?.data?.answers?.length})
              </FormLabel>
              {transformedQuestionsWithAnswers?.map(
                (question) => (
                  <QuestionCard key={question.id} question={question} />
                )
              )}
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.100">
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={setToggleUserViewSubmittedCheckInModal}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewSubmittedCheckInModal;
