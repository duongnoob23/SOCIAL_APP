import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import button from '@/theme/button';
import { colors } from '@/theme/colors';

export const lightColors = {
  primary: colors.primary[60],
  secondary: colors.secondary[60],
  accent: colors.accent[60],
  grey: colors.grey[60],

  divider: colors.grey[80],

  placeholder: colors.grey[30],

  background: colors.neutral.background,
  backgroundWhite: colors.neutral.white,
  black: colors.neutral.black,
  white: colors.neutral.white,
  success: colors.action.success,
  error: colors.action.error,
  warning: colors.action.warning,

  palette: colors,
  text: colors.neutral.black,
  textSecondary: colors.secondary['30'],
  blackTransparent: colors.blackTransparent,
  pureWhite: colors.white,
  pureBlack: colors.black,
};

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...lightColors,
  },
  components: {
    button: button(lightColors),
  },
};

export const darkColors: ColorType = {
  primary: colors.primary[60],
  secondary: colors.secondary[60],
  accent: colors.accent[60],
  grey: colors.grey[60],

  divider: colors.grey[80],

  placeholder: colors.grey[30],

  background: colors.neutral.background,
  backgroundWhite: colors.neutral.white,
  black: colors.neutral.black,
  white: colors.neutral.white,
  success: colors.action.success,
  error: colors.action.error,
  warning: colors.action.warning,

  palette: colors,
  text: colors.neutral.black,
  textSecondary: colors.secondary['30'],
  blackTransparent: colors.blackTransparent,
  pureWhite: colors.white,
  pureBlack: colors.black,
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...darkColors,
  },
  components: {
    button: button(darkColors),
  },
};

export type ColorType = typeof lightColors;
export type ComponentThemeType = typeof lightTheme.components;
