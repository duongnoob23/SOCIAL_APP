import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { BorderRadius } from '@/theme/borderRadius';
import { FontSize } from '@/theme/fonts';
import { useTheme } from '@react-navigation/native';

export interface RadioButtonProps {
  label: string;
  isSelected: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  circleStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  isSelected,
  onPress,
  style,
  circleStyle,
  labelStyle,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box flexDirection='row' alignItems='center' gap={8} style={style}>
        <Box
          style={[
            styles.radioCircle,
            {
              borderColor: isSelected
                ? colors.palette.orange[1]
                : colors.border,
              borderWidth: isSelected ? 5 : 1,
            },
            circleStyle,
          ]}
        />

        <Text fontSize={FontSize.LARGE} color={colors.text} style={labelStyle}>
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.FULL,
  },
});

export default RadioButton;
