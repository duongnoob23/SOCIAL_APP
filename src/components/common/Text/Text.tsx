import { fonts } from '@/theme/fonts';
import { useTheme } from '@react-navigation/native';
import React, { useMemo } from 'react';
import type { ColorValue, TextProps as RNTextProps } from 'react-native';
import { Text as RNText } from 'react-native';

export type FontWeight =
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';

export interface TextProps extends RNTextProps {
  fontSize?: number;
  fontWeight?: FontWeight;
  italic?: boolean;
  underline?: boolean;
  align?: 'auto' | 'left' | 'right' | 'center' | undefined;
  color?: ColorValue;
}

export const getFontFamily = (
  fontWeight: FontWeight = 'normal',
  italic = false,
): string => {
  switch (fontWeight) {
    case 'light':
      return italic ? fonts.Gotham.LightItalic : fonts.Gotham.Light;
    case 'normal':
      return italic ? fonts.Gotham.RegularItalic : fonts.Gotham.Regular;
    case 'medium':
      return italic ? fonts.Gotham.MediumItalic : fonts.Gotham.Medium;
    case 'semibold':
      return italic ? fonts.Gotham.SemiBoldItalic : fonts.Gotham.SemiBold;
    case 'bold':
      return italic ? fonts.Gotham.BoldItalic : fonts.Gotham.Bold;
    case 'extrabold':
      return italic ? fonts.Gotham.BoldItalic : fonts.Gotham.Bold; // Gotham doesn't have ExtraBold, default to Bold
    default:
      return italic ? fonts.Gotham.RegularItalic : fonts.Gotham.Regular;
  }
};

export const Text: React.FC<TextProps> = ({
  children,
  fontSize,
  fontWeight,
  italic,
  underline,
  align = 'auto',
  color,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const fontFamily = useMemo(
    () => getFontFamily(fontWeight, italic),
    [fontWeight, italic],
  );

  return (
    <RNText
      style={[
        { fontFamily },
        { color: color ?? colors.text },
        { textAlign: align ?? align },
        { textDecorationLine: underline ? 'underline' : 'none' },
        fontSize
          ? {
              fontSize,
              lineHeight: fontSize * 1.4,
            }
          : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
