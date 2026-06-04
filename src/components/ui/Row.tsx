import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface RowProps {
  children:  ReactNode;
  justify?:  ViewStyle['justifyContent'];
  align?:    ViewStyle['alignItems'];
  gap?:      number;
  wrap?:     boolean;
  style?:    ViewStyle;
}

/**
 * Row — shortcut cho flexDirection: 'row'
 *
 * Thay thế cho:
 *   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
 *
 * Dùng:
 *   <Row justify="space-between" align="center">
 *     <Text>Left</Text>
 *     <Text>Right</Text>
 *   </Row>
 */
export function Row({
  children,
  justify = 'flex-start',
  align   = 'center',
  gap     = 0,
  wrap    = false,
  style,
}: RowProps) {
  return (
    <View
      style={[
        styles.row,
        { justifyContent: justify, alignItems: align, gap },
        wrap && { flexWrap: 'wrap' },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Spacer — đẩy content ra 2 phía, hoặc tạo khoảng trống
 *
 * Dùng:
 *   <Row>
 *     <Text>Left</Text>
 *     <Spacer />           ← đẩy "Right" sang phải
 *     <Text>Right</Text>
 *   </Row>
 *
 *   <Spacer h={24} />     ← khoảng trống dọc 24px
 */
interface SpacerProps {
  h?: number;
  w?: number;
}
export function Spacer({ h, w }: SpacerProps) {
  return <View style={{ height: h, width: w, flex: h == null && w == null ? 1 : undefined }} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
});
