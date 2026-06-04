import React, { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

import type { ViewStyle, StyleProp } from 'react-native';

interface ToggleSwitchProps {
  value: boolean;
  onToggle?: (newValue: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  activeColor?: string;
  inactiveColor?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onToggle,
  containerStyle,
  activeColor,
  inactiveColor,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  const CONTAINER_WIDTH = 44;
  const PADDING = 2;
  const CIRCLE_SIZE = 20;
  const TRANSLATE_DISTANCE = CONTAINER_WIDTH - CIRCLE_SIZE - PADDING * 2;

  const activeTrack = activeColor ?? colors.primary;
  const inactiveTrack = inactiveColor ?? colors.toggleInactive;
  const disabledTrack = colors.border;

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value]);

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRANSLATE_DISTANCE }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveTrack, activeTrack],
    ),
  }));

  const handleToggle = () => {
    if (disabled) return;
    onToggle?.(!value);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleToggle}
      accessibilityRole='switch'
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={[
          styles.container,
          containerAnimatedStyle,
          disabled && { backgroundColor: disabledTrack },
          containerStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            { backgroundColor: colors.card },
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default ToggleSwitch;
