import { useCallback, useEffect, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import {
  cancelAnimation,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import useLatest from '@/hooks/useLatest';
import { useTheme } from '@react-navigation/native';
import type { ButtonVariant } from './types';
import { withOpacity } from '@/utils/colors';

const useButtonBehavior = ({
  loading,
  elevated,
  disabled,
  variant = 'primary',
  onPressAction,
  onPressInAction,
  onPressOutAction,
  outlineBaseColor,
  outlineAlpha = 0.2,
}: {
  loading?: boolean;
  elevated?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  onPressAction?: (event: GestureResponderEvent) => void;
  onPressInAction?: (event: GestureResponderEvent) => void;
  onPressOutAction?: (event: GestureResponderEvent) => void;
  outlineBaseColor?: string;
  outlineAlpha?: number;
}) => {
  const theme = useTheme();

  const buttonConfig = theme.components?.button;
  const maxElevationLevel = buttonConfig?.maxElevationLevel ?? 4;
  const minElevationLevel = buttonConfig?.minElevationLevel ?? 0;
  const animationConfig = buttonConfig?.animationConfig ?? { duration: 200 };
  const colors = theme.components.button.colors[variant];

  const flat = variant === 'text' || variant === 'text-inline';
  // elevation
  const elevation = useSharedValue(
    elevated && !flat ? maxElevationLevel : minElevationLevel,
  );
  useEffect(() => {
    if (elevated && !flat) {
      elevation.value = maxElevationLevel;
    } else {
      elevation.value = minElevationLevel;
    }
  }, [elevated, elevation, flat, maxElevationLevel, minElevationLevel]);

  // colors
  const progress = useSharedValue(disabled ? -1 : 0);
  const [textColor, setTextColor] = useState(
    disabled ? colors.labelDisabled : colors.label,
  );
  useEffect(() => {
    cancelAnimation(progress);
    progress.value = withTiming(disabled ? -1 : 0, animationConfig);
    setTextColor(disabled ? colors.labelDisabled : colors.label);
  }, [colors.label, colors.labelDisabled, disabled, progress, animationConfig]);

  const latestDisabled = useLatest(disabled);
  const runDisabledAnimation = useCallback(() => {
    if (latestDisabled.current) {
      progress.value = withTiming(-1, animationConfig);
      setTextColor(colors.labelDisabled);
    }
  }, [animationConfig, colors.labelDisabled]);

  // actions
  const onPress = (event: GestureResponderEvent) => {
    if (!disabled && !loading) {
      onPressAction?.(event);
    }
  };

  const onPressIn = (event: GestureResponderEvent) => {
    if (disabled || loading) return;
    if (!elevated && !flat) {
      elevation.value = withTiming(maxElevationLevel, animationConfig);
    }
    progress.value = withTiming(1, animationConfig);
    setTextColor(colors.labelHighlight);
    onPressInAction?.(event);
  };

  const onPressOut = (event: GestureResponderEvent) => {
    if (disabled || loading) return;
    if (!elevated && !flat) {
      elevation.value = withTiming(minElevationLevel, animationConfig);
    }
    progress.value = withTiming(0, animationConfig, finished => {
      if (finished) {
        runOnJS(runDisabledAnimation)();
      }
    });
    setTextColor(colors.label);
    onPressOutAction?.(event);
  };

  const applyAlphaToHexColor = (color: string, alpha: number) => {
    const a = Math.max(0, Math.min(1, alpha));
    if (typeof color !== 'string') return color as any;
    const m = color
      .trim()
      .match(
        /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i,
      );
    if (m) {
      const r = Math.min(255, parseInt(m[1], 10));
      const g = Math.min(255, parseInt(m[2], 10));
      const b = Math.min(255, parseInt(m[3], 10));
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    try {
      return withOpacity(color, a, { format: 'RRGGBBAA' });
    } catch {
      return color;
    }
  };

  const highlightColor = (() => {
    if (variant === 'tertiary-outline') {
      const baseCandidate =
        outlineBaseColor ??
        (colors as any)?.border ??
        (colors as any)?.borderHighlight ??
        theme.colors.border;
      const base =
        typeof baseCandidate === 'string' ? baseCandidate : undefined;
      const alphaRaw = typeof outlineAlpha === 'number' ? outlineAlpha : 0.2;
      const alpha = Math.max(0, Math.min(1, alphaRaw));
      const tinted = base ? applyAlphaToHexColor(base, alpha) : null;
      return tinted ?? colors.backgroundHighlight;
    }
    return colors.backgroundHighlight;
  })();

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [-1, 0, 1],
        [colors.background, colors.background, highlightColor],
      ),
    };
  }, [colors.background, highlightColor]);

  return {
    onPress,
    onPressIn,
    onPressOut,
    buttonAnimatedStyle,
    textColor,
    loadingColor: colors.label,
  };
};

export default useButtonBehavior;
