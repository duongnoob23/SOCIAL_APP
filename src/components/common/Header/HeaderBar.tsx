import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import React from 'react';
import { GoBackButton } from './HeaderGoBack';
import { MoreButton } from './HeaderMoreButton';

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  onMorePress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  title = 'Trending',
  showBack = true,
  onMorePress,
}) => {
  return (
    <Box
      flexDirection='row'
      alignItems='center'
      height={56}
      paddingX={24}
      accessibilityRole='header'
    >
      <Box width={44} alignItems='flex-start'>
        {showBack && <GoBackButton />}
      </Box>
      <Box flex={1} justifyContent='center' alignItems='center'>
        <Text numberOfLines={1} fontSize={18} fontWeight='semibold'>
          {title}
        </Text>
      </Box>
      <Box width={44} alignItems='flex-end'>
        {onMorePress && <MoreButton onPressIn={onMorePress} />}
      </Box>
    </Box>
  );
};
