import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './colors';
import { spacing } from './typography';

interface ScreenProps {
  children:        ReactNode;
  scrollable?:     boolean;
  padding?:        number;
  backgroundColor?: string;
  style?:          ViewStyle;
  // SafeArea edges tuỳ chỉnh
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

/**
 * Screen — wrapper cho mọi màn hình
 *
 * Dùng:
 *   <Screen>...</Screen>                    → không scroll, padding mặc định
 *   <Screen scrollable>...</Screen>         → có scroll
 *   <Screen padding={24}>...</Screen>       → padding riêng
 *   <Screen backgroundColor="#f5f5f5">...  → bg riêng
 */
export function Screen({
  children,
  scrollable     = false,
  padding        = spacing.lg,
  backgroundColor = colors.background,
  style,
  edges          = ['top', 'bottom'],
}: ScreenProps) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={edges}>
      {scrollable ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[{ padding, flexGrow: 1 }, style]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, { padding }, style]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
