import { Skeleton } from 'moti/skeleton';
import { Box } from '../Layout/Box';
import { Spacer } from './Spacer';
import { useTheme } from '@react-navigation/native';

export const NewsItemSkeleton = () => {
  const {  dark } = useTheme();
  const colorMode = dark ? 'dark' : 'light';

  return (
    <Box flexDirection='row' gap={12} paddingY={12}>
      <Skeleton height={80} width={80} radius={8} colorMode={colorMode} />
      <Box flex={1} justifyContent='space-between'>
        <Box>
          <Skeleton height={16} width='95%' radius={4} colorMode={colorMode} />
          <Spacer height={6} />
          <Skeleton height={16} width='80%' radius={4} colorMode={colorMode} />
        </Box>
        <Spacer height={8} />
        <Box flexDirection='row' gap={8}>
          <Skeleton height={14} width={60} radius={4} colorMode={colorMode} />
          <Skeleton height={14} width={80} radius={4} colorMode={colorMode} />
        </Box>
      </Box>
    </Box>
  );
};
