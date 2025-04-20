import { Box, Skeleton } from '@chakra-ui/react';

const SkeletonLoader = ({
  width = '100%',
  height = '20px',
  count = 3,
  spacing = 4
}) => {
  return (
    <Box
      width={width}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
      p={8}
      textAlign="center"
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} height={height} width="80%" mb={spacing} />
      ))}
    </Box>
  );
};

export default SkeletonLoader;
