import {
  Container,
  Card,
  CardBody,
  Box,
  Flex
} from '@chakra-ui/react';
import { QuestionsList } from '../checkinBuilder/QuestionList';
import { QuestionTypesPanel } from '../checkinBuilder/QuestionTypesPanel';
import { CheckInSubmitter } from '../checkinBuilder/CheckInSubmitter';

export const CreateCheckIn = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Flex gap={8} align="start">
        {/* Left Panel */}
        <Card w="300px" position="sticky" top="8">
          <CardBody>
            <QuestionTypesPanel />
          </CardBody>
        </Card>

        {/* Main Content */}
        <Box flex={1}>
          <Card mb={8}>
            <CardBody>
              <CheckInSubmitter />
            </CardBody>
          </Card>
          <QuestionsList />
        </Box>
      </Flex>
    </Container>
  );
};
export default CreateCheckIn;
