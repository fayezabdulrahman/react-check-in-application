import { Container, Card, CardBody, Box, Flex } from '@chakra-ui/react';
import { QuestionsList } from '../checkinBuilder/QuestionList';
import { QuestionTypesPanel } from '../checkinBuilder/QuestionTypesPanel';
import { CheckInSubmitter } from '../checkinBuilder/CheckInSubmitter';

export const CreateCheckIn = () => {
  return (
    <Container
      maxW="container.xl"
      py={8}
      px={{ base: 4, md: 8 }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Flex gap={8} align="start">
        {/* Left Panel */}
        <Card w={{ base: '100%', md: '300px' }} position="sticky" top="8">
          <CardBody>
            <QuestionTypesPanel />
          </CardBody>
        </Card>

        {/* Main Content */}
        <Box flex={1} w="100%">
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
