import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { colors } from './colors';
import { borderRadius, spacing } from './typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  label?: string;
  onPress: () => void;
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  disabled?:  boolean;
  fullWidth?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  style?:     ViewStyle;
}

const variantStyle: Record<ButtonVariant, ViewStyle> = {
  primary:   { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface },
  outline:   { backgroundColor: colors.transparent, borderWidth: 1.5, borderColor: colors.primary },
  ghost:     { backgroundColor: colors.transparent },
  danger:    { backgroundColor: colors.error },
};

const labelStyle: Record<ButtonVariant, TextStyle> = {
  primary:   { color: colors.textInverse },
  secondary: { color: colors.textPrimary },
  outline:   { color: colors.textPrimary },
  ghost:     { color: colors.textPrimary },
  danger:    { color: colors.textInverse },
};

const sizeStyle: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: spacing.xs,  paddingHorizontal: spacing.md,  borderRadius: borderRadius.sm },
  md: { paddingVertical: spacing.md,  paddingHorizontal: spacing.lg,  borderRadius: borderRadius.md },
  lg: { paddingVertical: spacing.lg,  paddingHorizontal: spacing.xl,  borderRadius: borderRadius.lg },
};

export function AppButton({
  label,
  onPress,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const spinnerColor = variant === 'primary' || variant === 'danger' ? colors.white : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyle[variant],
        sizeStyle[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed    && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <>
          {leftIcon}
          {label && (
            <AppText variant="label" style={[styles.label, labelStyle[variant]]}>
              {label}
            </AppText>
          )}
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.4 },
  pressed:   { opacity: 0.75 },
  label:     { fontWeight: '600' },
});
