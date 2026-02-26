import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

const SimpleBottomSheet = () => {
  // snapPoints = các mức cao mà sheet có thể dừng lại (25%, 50%, 90% màn hình)
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  return (
    <BottomSheet
      snapPoints={snapPoints}
      index={1}                    // 1 = mở ở mức 50% ngay khi vào màn hình
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Hello BottomSheet! 👋</Text>
        <Text>Đây là nội dung đơn giản nhất.</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"red",
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});

export default SimpleBottomSheet;