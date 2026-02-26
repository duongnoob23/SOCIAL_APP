/**
 * ============================================================
 * LEVEL 2 — BottomSheetModal với FlatList + Custom Backdrop
 * ============================================================
 *
 * Những gì mới ở level này:
 *  1. BottomSheetFlatList:
 *     - Thay thế FlatList thường khi dùng bên trong BottomSheet
 *     - Giúp scroll và gesture không bị xung đột nhau
 *
 *  2. Custom Backdrop:
 *     - Lớp mờ phía sau sheet
 *     - Click vào backdrop → đóng modal
 *     - Dùng BottomSheetBackdrop có sẵn của Gorhom
 *
 *  3. Multiple snapPoints:
 *     - Sheet có thể dừng ở nhiều mức
 *     - User kéo lên/xuống để chuyển giữa các mức
 *
 *  4. Props thực tế:
 *     - onDismiss: callback khi modal đóng → dùng để reset state
 * ============================================================
 */

import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Dữ liệu giả ---
const MOCK_BANKS = [
  { id: '1', name: 'Vietcombank', icon: '🏦', color: '#006400' },
  { id: '2', name: 'Techcombank', icon: '🔴', color: '#c0392b' },
  { id: '3', name: 'MB Bank', icon: '💜', color: '#8e44ad' },
  { id: '4', name: 'VPBank', icon: '🟢', color: '#27ae60' },
  { id: '5', name: 'BIDV', icon: '🔵', color: '#2980b9' },
  { id: '6', name: 'Agribank', icon: '🟡', color: '#f39c12' },
  { id: '7', name: 'ACB', icon: '🟠', color: '#e67e22' },
  { id: '8', name: 'SHB', icon: '🟣', color: '#9b59b6' },
];

// Kiểu dữ liệu cho mỗi item trong list
interface BankItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Props của component này
interface Props {
  onSelectBank?: (bank: BankItem) => void; // callback khi chọn ngân hàng
  onDismiss?: () => void;                  // callback khi modal đóng
}

const Level2_ListModal = forwardRef<BottomSheetModal, Props>(
  ({ onSelectBank, onDismiss }, ref) => {
    // Nhiều mức: 50% lúc mở, 90% khi kéo lên
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    /**
     * Custom Backdrop — lớp mờ phía sau modal
     * useCallback: tránh re-create function mỗi lần render (best practice của Gorhom)
     * disappearsOnIndex={-1}: backdrop mờ đi khi modal đóng
     * appearsOnIndex={0}: backdrop hiện khi modal ở vị trí đầu tiên
     * pressBehavior="close": bấm vào backdrop thì đóng modal
     */
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
          opacity={0.5}
        />
      ),
      []
    );

    // renderItem cho FlatList — hàm render từng ngân hàng
    const renderBankItem = useCallback(
      ({ item }: { item: BankItem }) => (
        <TouchableOpacity
          style={styles.bankItem}
          onPress={() => {
            onSelectBank?.(item); // Gọi callback nếu có
            (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
          }}
        >
          <View style={[styles.bankIcon, { backgroundColor: item.color + '20' }]}>
            <Text style={styles.bankIconText}>{item.icon}</Text>
          </View>
          <Text style={styles.bankName}>{item.name}</Text>
          <Text style={styles.bankArrow}>›</Text>
        </TouchableOpacity>
      ),
      [onSelectBank, ref]
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop} // Gắn custom backdrop vào
        onDismiss={onDismiss}              // Gọi callback khi đóng
        // Handle mặc định của Gorhom (thanh kéo ở trên cùng)
      >
        {/* Header của modal */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chọn Ngân Hàng</Text>
          <Text style={styles.headerSub}>{MOCK_BANKS.length} ngân hàng</Text>
        </View>

        {/*
         * BottomSheetFlatList thay thế FlatList thường
         * API giống hệt FlatList — chỉ đổi tên import thôi!
         */}
        <BottomSheetFlatList
          data={MOCK_BANKS}
          keyExtractor={(item) => item.id}
          renderItem={renderBankItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheetModal>
    );
  }
);

export default Level2_ListModal;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  headerSub: { fontSize: 13, color: '#999', marginTop: 2 },
  listContent: { paddingBottom: 32 },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bankIconText: { fontSize: 22 },
  bankName: { flex: 1, fontSize: 15, fontWeight: '500', color: '#222' },
  bankArrow: { fontSize: 22, color: '#ccc' },
});
