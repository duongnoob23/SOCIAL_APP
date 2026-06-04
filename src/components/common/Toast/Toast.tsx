import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Text } from '@/components/common/Text/Text';
import { useTheme } from '@react-navigation/native';
import { Box } from '../Layout/Box';
import GreenSuccess from '@/assets/icons/svg/GreenSuccess';
import AlertIcon from '@/assets/svg/AlertIcon';
import { ToastType } from '@/features/toast/types';
import { FontSize } from '@/theme/fonts';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) => {
  const { colors } = useTheme();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const loadingOpacity = useSharedValue(1);

  useEffect(() => {
  translateY.value = withTiming(0, { duration: 400 });
  opacity.value = withTiming(1, { duration: 400 });
  loadingOpacity.value = 1;

  const timeoutId = setTimeout(() => {
    loadingOpacity.value = withTiming(0, { duration: 200 });
    iconOpacity.value = withTiming(1, { duration: 300 });
    iconScale.value = withSequence(
      withSpring(1.3, { damping: 8 }),
      withSpring(1, { damping: 10 }),
    );
  }, 500);

  translateY.value = withSequence(
    withTiming(0, { duration: 400 }),
    withDelay(
      duration,
      withTiming(-100, { duration: 300 }, finished =>  {
        if (finished) {
          runOnJS(onClose)();
        }
      }),
    ),
  );

  opacity.value = withSequence(
    withTiming(1, { duration: 400 }),
    withDelay(duration, withTiming(0, { duration: 300 })),
  );

  return () => {
    clearTimeout(timeoutId);
  };
}, [duration, onClose]);

  const animatedToastStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const animatedLoadingStyle = useAnimatedStyle(() => {
    return {
      opacity: loadingOpacity.value,
      position: 'absolute',
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
      marginRight: 8,
      transform: [{ scale: iconScale.value }],
    };
  });

  const getBackgroundColor = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return colors.toast.backgroundSuccess;
      case ToastType.ERROR:
        return colors.toast.backgroundError;
      default:
        return colors.toast.backgroundSuccess;
    }
  };

  const getIcon = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return <GreenSuccess width={30} height={30} />;
      case ToastType.ERROR:
        return (
          <Box borderRadius={100} width={30} height={30} padding={2}>
            <AlertIcon />
          </Box>
        );

      default:
        return <GreenSuccess />;
    }
  };

  const getLoadingColor = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return colors.toast.success;
      case ToastType.ERROR:
        return colors.toast.error;
      default:
        return colors.toast.success;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          shadowColor: colors.card,
        },
        animatedToastStyle,
      ]}
    >
      <Box flexDirection='row' alignItems='center' justifyContent='center'>
        <Box mr={8} style={styles.iconWrapper}>
          <Animated.View style={animatedLoadingStyle}>
            <ActivityIndicator size='large' color={getLoadingColor()} />
          </Animated.View>

          <Animated.View style={animatedIconStyle}>{getIcon()}</Animated.View>
        </Box>

        <Text
          fontSize={FontSize.SMALL}
          fontWeight='semibold'
          color={getLoadingColor()}
        >
          {message}
        </Text>
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    alignSelf: 'center',
    minWidth: '50%',
    maxWidth: '90%',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 999,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
