import type {
  ColorValue,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type React from 'react';
import type { MaskOptions } from 'react-native-mask-text/lib/typescript/src/@types';

export type MaskParams = {
  pattern?: string | string[];
  type?: 'custom' | 'currency';
   
  options?: MaskOptions;
};

export interface TextFieldProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  isError?: boolean;
  isOptional?: boolean;
  error?: string;
  hint?: string;
  left?: React.ReactElement<unknown> | React.ComponentType<unknown>;
  right?: React.ReactElement<unknown> | React.ComponentType<unknown>;
  innerInputWrapper?: ViewStyle;
  inputStyle?: TextStyle;
  inputErrorStyle?: TextStyle;
  disabled?: boolean;
  value?: string;
  autoExpand?: boolean;
  onChange?: (value: string, unMaskedValue?: string) => void;
  onChangeEvent?: TextInputProps['onChange'];
  onFocus?: () => void;
  onBlur?: () => void;
  onPressIconRight?: () => void;
  onPressIconLeft?: () => void;
  redText?: boolean;
  labelColor?: string;
  containerStyle?: ViewStyle;
  mask?: MaskParams;
  borderBottomColor?: ColorValue;
  iconRightStyle?: ViewStyle;
  toolTipStyle?: ViewStyle;
  useBottomSheetInput?: boolean;
  toolTip?: React.ReactElement<unknown> | React.ComponentType<unknown> | null;
  onPressToolTip?: () => void;
}

export type CounterPosition =
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right';

export interface TextAreaWithCounterProps
  extends Omit<
    TextFieldProps,
    'multiline' | 'numberOfLines' | 'textAlignVertical' | 'innerInputWrapper'
  > {
  maxLength?: number;
  counterPosition?: CounterPosition;
  showCounter?: boolean;
  textAreaStyle?: ViewStyle;
  counterStyle?: TextStyle;
  counterColor?: string;
  backgroundColor?: string;
  visibleLines?: number;
  lineHeightPx?: number;
  counterHeightPx?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  margin?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  isRequired?: boolean;
}
