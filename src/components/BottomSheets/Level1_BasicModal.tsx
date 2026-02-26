/**
 * ============================================================
 * LEVEL 1 — BASIC BottomSheetModal
 * ============================================================
 *
 * Những gì cần biết ở level này:
 *  1. BottomSheetModal KHÁC BottomSheet ở chỗ:
 *     - Mặc định ẨN hoàn toàn, không render gì lên màn hình
 *     - Chỉ hiện khi mình gọi ref.current?.present()
 *     - Đóng khi: kéo xuống / gọi ref.current?.dismiss()
 *
 *  2. forwardRef: tại sao phải dùng?
 *     - ref được tạo ở component CHA (learn.tsx) → truyền vào đây
 *     - forwardRef cho phép component CON "nhận" ref từ cha
 *     - Nếu không có forwardRef → ref sẽ không hoạt động
 *
 *  3. snapPoints + useMemo:
 *     - Luôn bọc trong useMemo để tránh re-create mảng mỗi lần render
 *     - Đây là best practice của Gorhom
 * ============================================================
 */

import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// forwardRef<KiểuRef, KiểuProps>
// - KiểuRef = BottomSheetModal (để TypeScript biết ref.current có những method gì)
// - KiểuProps = {} (chưa cần props gì ở level này)
const Level1_BasicModal = forwardRef<BottomSheetModal, {}>((_, ref) => {
  // ✅ Best practice: luôn bọc snapPoints trong useMemo
  const snapPoints = useMemo(() => ['40%'], []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      // index mặc định là 0 khi present() được gọi
    >
      {/*
       * BottomSheetView: dùng khi nội dung CỐ ĐỊNH, không cần cuộn
       * ĐỪNG dùng View thường của RN ở đây!
       */}
      <BottomSheetView style={styles.container}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>Basic BottomSheetModal</Text>
        <Text style={styles.desc}>
          Đây là modal đơn giản nhất.{'\n'}
          Kéo xuống hoặc bấm nút để đóng.
        </Text>

        {/* Gọi dismiss() để đóng sheet từ bên trong */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => (ref as React.RefObject<BottomSheetModal>).current?.dismiss()}
        >
          <Text style={styles.closeBtnText}>Đóng Modal</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default Level1_BasicModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  emoji: { fontSize: 48 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  desc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22 },
  closeBtn: {
    marginTop: 8,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
