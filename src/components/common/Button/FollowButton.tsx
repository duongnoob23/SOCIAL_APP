import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Text } from '../Text/Text';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface FollowButtonProps {
  initialState?: 'follow' | 'following';
  onToggle?: (state: 'follow' | 'following') => void;
  size?: 'small' | 'medium' | 'default';
}

export default function FollowButton({
  initialState = 'follow',
  onToggle,
  size = 'small',
}: FollowButtonProps) {
  const { colors } = useTheme();
  const [state, setState] = useState<'follow' | 'following'>(initialState);
  const { t } = useTranslation('common');

  const styles = state === 'follow' ? colors.follow : colors.following;

  const paddings = {
    small: { paddingVertical: 8, paddingHorizontal: 12 },
    medium: { paddingVertical: 10, paddingHorizontal: 16 },
    default: { paddingVertical: 12, paddingHorizontal: 20 },
  }[size];

  const handlePress = () => {
    const next = state === 'follow' ? 'following' : 'follow';
    setState(next);
    onToggle?.(next);
  };

  return (
    <Pressable
      accessibilityRole='button'
      onPress={handlePress}
      style={[
        {
          borderWidth: 1,
          borderColor: styles.border,
          backgroundColor: styles.bgColor,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        },
        paddings,
      ]}
    >
      <Text color={styles.text} fontWeight='bold'>
        {state === 'follow' ? t('follow') : t('following')}
      </Text>
    </Pressable>
  );
}
