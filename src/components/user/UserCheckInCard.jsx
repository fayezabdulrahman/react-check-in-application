import {
  ButtonGroup,
  Button,
  Icon,
  Badge,
  Flex,
  Text,
  Box
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineQuestionAnswer } from 'react-icons/md';

const UserCheckInCard = ({ checkIn }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/home/availableCheckIn', {
      state: {
        publishedCheckIn: checkIn
      }
    });
  };
  return (
    <Box
      p={5}
      bgGradient="linear(to-br, white, gray.50)"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.100"
      transition="all 0.25s ease-in-out"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      minHeight="160px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
    >
      {/* Accent bar */}
      <Box
        position="absolute"
        top={0}
        left={0}
        height="4px"
        width="100%"
        bgGradient="linear(to-r, orange.400, orange.300)"
        borderTopRadius="2xl"
      />

      {/* Header Section */}
      <Box>
        <Flex
          wrap="wrap"
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'start', sm: 'center' }}
          gap={2}
          mb={2}
        >
          <Box>
            <Text
              fontSize={{ base: 'md', sm: 'lg' }}
              fontWeight="bold"
              color="gray.700"
              maxWidth={{ base: '100%', sm: '100%' }}
              whiteSpace={{ base: 'nowrap', md: 'normal' }}
              overflow={{ base: 'hidden', md: 'visible' }}
              textOverflow={{ base: 'ellipsis', md: 'initial' }}
            >
              Name: {checkIn.checkInId}
            </Text>
            {checkIn.anonymous && (
              <Text fontSize="sm" color="gray.500" fontStyle="italic" mt={1}>
                This check-in is anonymous
              </Text>
            )}
          </Box>

          <Badge
            colorScheme="gray"
            variant="solid"
            fontSize="xs"
            px={2}
            py={0.5}
            alignSelf={{ base: 'flex-start', sm: 'center' }}
          >
            Unsubmitted
          </Badge>
        </Flex>
      </Box>

      {/* Footer with Actions */}
      <Flex
        justify="space-between"
        align="center"
        borderTop="1px solid"
        borderColor="gray.200"
        pt={3}
        flexDirection={'row'}
        gap={{ base: 3, sm: 0 }}
      >
        <Flex align="center" gap={2}>
          <Icon as={MdOutlineQuestionAnswer} color="gray.500" boxSize={5} />
          <Text fontSize="sm" color="gray.600">
            {checkIn.questions.length} question
            {checkIn.questions.length !== 1 ? 's' : ''}
          </Text>
        </Flex>

        <ButtonGroup variant="solid" size="sm" spacing={2}>
          <Button
            colorScheme="orange"
            onClick={() => handleViewDetails()}
            px={4}
            borderRadius="md"
          >
            View
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default UserCheckInCard;
