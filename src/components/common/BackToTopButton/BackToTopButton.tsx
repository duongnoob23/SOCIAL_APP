import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { Text } from '@/components/common/Text/Text';
import { FontSize } from '@/theme/fonts';

const SCROLL_THRESHOLD = 500; 

interface BackToTopButtonProps {
  scrollY: Animated.SharedValue<number>;
  onPress: () => void;
  threshold?: number;
  position?: {
    bottom?: number;
    right?: number;
    left?: number;
    top?: number;
  };
  size?: {
    width?: number;
    height?: number;
  };
  fontSize?: number;
}

export default function BackToTopButton({
  scrollY,
  onPress,
  threshold = SCROLL_THRESHOLD,
  position = { bottom: 30, right: 30 },
  size = { width: 48, height: 48 },
  fontSize = FontSize.EXTRA_LARGE,
}: BackToTopButtonProps) {
  const { colors } = useTheme();

  const buttonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [threshold - 200, threshold], 
      [0, 1], 
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [threshold - 200, threshold],
      [100, 0], 
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [threshold - 200, threshold],
      [0.5, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [
        { translateY },
        { scale: withSpring(scale) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, position, buttonStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size.width,
            height: size.height,
            borderRadius: Math.min(size.width || 48, size.height || 48) / 2,
            backgroundColor: colors.primary,
            shadowColor: colors.text,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Scroll to top"
        accessibilityHint="Scrolls the list back to the top"
      >
        <Text style={[styles.buttonText, { color: colors.onPrimary, fontSize }]}>
          ↑
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
