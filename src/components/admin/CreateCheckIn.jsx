import {
  Container,
  Card,
  CardBody,
  Box,
  Flex,
  useBreakpointValue
} from '@chakra-ui/react';
import { QuestionsList } from '../checkinBuilder/QuestionList';
import { QuestionTypesPanel } from '../checkinBuilder/QuestionTypesPanel';
import { CheckInSubmitter } from '../checkinBuilder/CheckInSubmitter';

export const CreateCheckIn = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={8}
        align="start"
        w="100%"
      >
        {/* Question Type Panel */}
        <Card
          w={{ base: '100%', md: '300px' }}
          position={isMobile ? 'relative' : 'sticky'}
          top={isMobile ? '0' : '8'}
          zIndex={1}
          borderLeft="6px solid"
          borderColor="orange.400"
          borderRadius="2xl"
          boxShadow="lg"
        >
          <CardBody>
            <QuestionTypesPanel />
          </CardBody>
        </Card>

        {/* Main Area */}
        <Box flex={1} w="100%">
          <Card
            mb={8}
            borderLeft="6px solid"
            borderColor="orange.400"
            borderRadius="2xl"
            boxShadow="lg"
          >
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
