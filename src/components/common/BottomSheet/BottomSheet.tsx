import React, {
  forwardRef,
} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetModalProps,
  type BottomSheetBackdropProps,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const BackdropWithBlur = (props: BottomSheetBackdropProps) => {
  const { dark } = useTheme();

  const animatedProps = useAnimatedProps(() => {
    const intensity = interpolate(
      props.animatedIndex.value,
      [-1, 0],
      [0, 2],
      Extrapolation.CLAMP,
    );

    return {
      intensity,
    } as any;
  });

  return (
    <>
      {Platform.OS === 'ios' && (
        <AnimatedBlurView
          animatedProps={animatedProps}
          tint={dark ? 'dark' : 'light'}
          style={[StyleSheet.absoluteFillObject, props.style]}
          pointerEvents='none'
        />
      )}
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    </>
  );
};

export interface AppBottomSheetProps
  extends Omit<BottomSheetModalProps, 'children' | 'ref' | 'index'> {
  children?: React.ReactNode;
  initialIndex?: number;
  topInset?: number;
  backdropOpacity?: number;
  backdropColor?: string;
}

const BottomSheet = forwardRef<BottomSheetModal, AppBottomSheetProps>(
  (
    {
      children,
      initialIndex = 0,
      topInset,
      backdropOpacity,
      backdropColor,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const calculatedTopInset = topInset !== undefined ? topInset : insets.top;

    return (
      <BottomSheetModal
        ref={ref}
        index={initialIndex}
        // enablePanDownToClose={true}
        backdropComponent={BackdropWithBlur}
        backgroundStyle={{
          backgroundColor: colors.card,
          borderRadius: 20,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        topInset={calculatedTopInset}
        {...rest}
      >
        
        <BottomSheetView
          style={{ paddingBottom: Math.max(insets.bottom, 16), flex: 1 }}
        >
          {children}
        </BottomSheetView>

      </BottomSheetModal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
