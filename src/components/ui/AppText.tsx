import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors } from './colors';
import { TextVariant, typography } from './typography';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  bold?: boolean;
  italic?: boolean;
}

export function AppText({
  variant = 'body',
  color = colors.textPrimary,
  align,
  bold,
  italic,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        typography[variant],
        { color },
        align   && { textAlign: align },
        bold    && { fontWeight: '700' },
        italic  && { fontStyle: 'italic' },
        style,
      ]}
      {...props}
    />
  );
}
