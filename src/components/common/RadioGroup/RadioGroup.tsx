import React from 'react';
import { Box } from '@/components/common/Layout/Box';
import RadioButton from '../Button/RadioButton';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

export interface RadioGroupOption<T = string> {
  key: T;
  label: string;
}

export interface RadioGroupProps<T = string> {
  options: RadioGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

export function RadioGroup<T = string>({
  options,
  value,
  onChange,
  style,
  itemStyle,
}: RadioGroupProps<T>) {
  const { colors } = useTheme();

  return (
    <Box style={style}>
      {options.map((opt, idx) => (
        <Box key={String(opt.key)} mb={idx < options.length - 1 ? 12 : 0} style={itemStyle}>
          <RadioButton
            label={opt.label}
            isSelected={value === opt.key}
            onPress={() => onChange(opt.key)}
            style={{ paddingVertical: 10 }}
          />
          {idx < options.length ? (
            <Box height={1} backgroundColor={colors.border} mt={10} />
          ) : null}
        </Box>
      ))}
    </Box>
  );
}

export default RadioGroup;