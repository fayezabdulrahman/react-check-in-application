import {
  Box,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Heading,
  CardHeader,
  Text,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import EditQuestion from './EditQuestion';
const QuestionsSummary = ({ checkIn, setCheckIn, isSubmitted }) => {
  return (
    <>
      <Card mt="1rem" overflowY="auto" maxH='500px'>
        <CardHeader>
          <Heading size="md">Summary of Your Questions</Heading>
        </CardHeader>

        <CardBody>
          {checkIn?.questions?.map((question, index) => (
            <Stack key={index} divider={<StackDivider />} spacing="4">
              <Box mt="1rem">
                <Heading size="xs">{question.label}</Heading>

                <Text pt="2" fontSize="sm">
                  Question Required: {question.isRequired ? 'Yes' : 'No'}
                </Text>

                {question.selectOptions?.length > 0 ? 'Select Options' : null}
                <UnorderedList>
                  {question.selectOptions?.map((selectOption, index) => (
                    <ListItem key={index}>{selectOption}</ListItem>
                  ))}
                </UnorderedList>

                {question.radioOptions?.length > 0 ? 'Radio Options' : null}

                <UnorderedList>
                  {question.radioOptions?.map((radioOption, index) => (
                    <ListItem key={index}>{radioOption}</ListItem>
                  ))}
                </UnorderedList>
                <Box display="flex" justifyContent="flex-end">
                  <EditQuestion
                    questionId={index}
                    checkIn={checkIn}
                    setCheckIn={setCheckIn}
                    isSubmitted={isSubmitted}
                  />
                </Box>
              </Box>
            </Stack>
          ))}
        </CardBody>
      </Card>
    </>
  );
};

export default QuestionsSummary;
