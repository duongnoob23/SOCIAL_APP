import IconMoreDetail from '@/assets/icons/IconMoreDetail';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onPressIn?: (event: any) => void;
  size?: number;
};

export function MoreButton({ onPressIn, size }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPressIn={onPressIn}
      activeOpacity={0.7}
    >
      <IconMoreDetail size={24} color={colors.text} />
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
