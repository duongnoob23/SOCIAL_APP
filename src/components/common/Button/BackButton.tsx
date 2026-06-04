import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Box } from '@/components/common/Layout/Box';
import { ChevronLeft } from '@/assets/icons/svg/ChevronLeft';

interface BackButtonProps {
  onBackPress?: () => void;
  fallbackRoute?: Href;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onBackPress,
  fallbackRoute = '/',
}) => {
  const router = useRouter();
  const { colors } = useTheme();
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
        width={44}
        height={44}
        borderRadius={22}
        backgroundColor={colors.background}
        alignItems='center'
        justifyContent='center'
      >
        <ChevronLeft size={24} color={colors.text} />
      </Box>
    </TouchableOpacity>
  );
};
