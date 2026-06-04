import { ChevronLeft } from '@/assets/icons/svg/ChevronLeft';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { FontSize } from '@/theme/fonts';
import { useTheme } from '@react-navigation/native';
import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  fallbackRoute?: Href;
  backgroundColor?: ColorValue;
  iconSize?: number;
  paddingBottom?: number;
  textFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  height?: number;
  pt?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
  fallbackRoute = '/',
  backgroundColor,
  iconSize = 24,
  paddingBottom = 28,
  textFontWeight = 'bold',
  height = 44,
  pt = 16,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation('common');

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute);
    }
  };

  return (
    <Box
      backgroundColor={backgroundColor ?? colors.surface}
      pt={Math.max(top + pt, 24)}
      px={24}
      pb={paddingBottom}
    >
      <Box
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        position='relative'
      >
        <Box position='absolute' left={0}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              accessibilityRole='button'
              accessibilityLabel={t('back', { defaultValue: 'Back' })}
              accessibilityHint={t('goBackHint', {
                defaultValue: 'Go back to the previous screen',
              })}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Box
                boxSize={44}
                borderRadius={22}
                backgroundColor={colors.card}
                alignItems='center'
                justifyContent='center'
              >
                <ChevronLeft size={iconSize} color={colors.text} />
              </Box>
            </TouchableOpacity>
          )}
        </Box>

        <Box
          alignItems='center'
          justifyContent='center'
          pointerEvents='none'
          h={height}
          w='100%'
        >
          <Text
            fontSize={FontSize.EXTRA_LARGE}
            fontWeight={textFontWeight}
            color={colors.text}
            align='center'
            accessibilityRole='header'
          >
            {title}
          </Text>
        </Box>

        <Box
          height={height}
          alignItems='flex-end'
          position='absolute'
          right={0}
        >
          {rightComponent}
        </Box>
      </Box>
    </Box>
  );
};
