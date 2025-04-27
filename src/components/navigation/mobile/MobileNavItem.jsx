import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Icon } from '@chakra-ui/react';

const MobileNavItem = ({ icon, label, to, onClick }) => {
  const isLink = Boolean(to);
  const Wrapper = isLink ? RouterLink : Box;

  return (
    <Flex
      as={Wrapper}
      to={to}
      onClick={onClick}
      align="center"
      gap="2"
      p={2}
      borderRadius="md"
      _hover={{ bg: 'gray.100' }}
      fontSize="lg"
    >
      <Icon as={icon} boxSize={6} />
      {label}
    </Flex>
  );
};

export default MobileNavItem;
