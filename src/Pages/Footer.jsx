import { Box, Text, Flex } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" py={4} mt="auto" w="100%">
      <Flex
        maxW="6xl"
        mx="auto"
        px={4}
        justify="center"
        align="center"
        textAlign="center"
      >
        <Text fontSize="sm" color="gray.600">
          &copy; {new Date().getFullYear()} Ez Check-Ins™. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
