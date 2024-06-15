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
import { useAdminQuestion } from '../context/AdminProvider';
const QuestionsSummary = () => {
  const { questions } = useAdminQuestion();
  return (
    <>
      <Card mt='1rem'>
        <CardHeader>
          <Heading size="md">Summary of your questions</Heading>
        </CardHeader>

        <CardBody>
          {questions?.map((question, index) => (
            <Stack key={index} divider={<StackDivider />} spacing="4">
              <Box mt="1rem">
                <Heading size="xs">{question.label}</Heading>

                <Text pt="2" fontSize="sm">
                  Question Required: {question.isRequired ? 'Yes' : 'No'}
                </Text>

                {question.selectOptions.length > 0 ? 'Select Options' : null}
                <UnorderedList>
                  {question.selectOptions?.map((selectOption, index) => (
                    <ListItem key={index}>{selectOption}</ListItem>
                  ))}
                </UnorderedList>

                {question.radioOptions.length > 0 ? 'Radio Options' : null}

                <UnorderedList>
                  {question.radioOptions?.map((radioOption, index) => (
                    <ListItem key={index}>{radioOption}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
            </Stack>
          ))}
        </CardBody>
      </Card>
    </>
  );
};

export default QuestionsSummary;
