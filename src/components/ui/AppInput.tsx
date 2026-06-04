import React, { forwardRef, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import { AppText } from './AppText';
import { colors } from './colors';
import { borderRadius, spacing } from './typography';

interface AppInputProps extends TextInputProps {
  label?:       string;
  error?:       string;
  hint?:        string;
  leftIcon?:    React.ReactNode;
  rightIcon?:   React.ReactNode;
  onPressRight?: () => void;
  containerStyle?: ViewStyle;
  disabled?:    boolean;
  isPassword?:  boolean;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onPressRight,
  containerStyle,
  disabled  = false,
  isPassword = false,
  style,
  ...props
}, ref) => {
  const [focused,      setFocused]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.borderFocus
      : colors.border;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {/* Label */}
      {label && (
        <AppText variant="label" color={colors.textSecondary} style={styles.label}>
          {label}
        </AppText>
      )}

      {/* Input container */}
      <View style={[styles.inputBox, { borderColor }, disabled && styles.disabledBox]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          style={[styles.input, disabled && styles.disabledText, style]}
          placeholderTextColor={colors.textMuted}
          editable={!disabled}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          autoCorrect={false}
          {...props}
        />

        {/* Right icon / eye toggle */}
        {isPassword ? (
          <Pressable onPress={() => setShowPassword(v => !v)} style={styles.iconRight}>
            <AppText variant="caption" color={colors.textMuted}>
              {showPassword ? 'Ẩn' : 'Hiện'}
            </AppText>
          </Pressable>
        ) : rightIcon ? (
          <Pressable onPress={onPressRight} style={styles.iconRight}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>

      {/* Error / Hint */}
      {error && <AppText variant="caption" color={colors.error}>{error}</AppText>}
      {!error && hint && <AppText variant="caption" color={colors.textMuted}>{hint}</AppText>}
    </View>
  );
});

AppInput.displayName = 'AppInput';

const styles = StyleSheet.create({
  wrapper:       { gap: spacing.xs },
  label:         { marginBottom: 2 },
  inputBox: {
    flexDirection:  'row',
    alignItems:     'center',
    borderWidth:    1.5,
    borderRadius:   borderRadius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex:       1,
    fontSize:   15,
    color:      colors.textPrimary,
    paddingVertical: spacing.md,
  },
  iconLeft:      { marginRight: spacing.sm },
  iconRight:     { marginLeft:  spacing.sm },
  disabledBox:   { backgroundColor: colors.surface, borderColor: colors.border },
  disabledText:  { color: colors.textMuted },
});
