import React from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ChevronLeft } from '@/assets/icons/ChevronLeft';

type GoBackButtonProps = {
  size?: number;
  onBack?: () => void;
};

export function GoBackButton({ size = 17, onBack }: GoBackButtonProps) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onBack ?? router.back}
      activeOpacity={0.7}
    >
      <ChevronLeft size={24} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
