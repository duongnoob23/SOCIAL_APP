/**
 * ============================================================
 * LEVEL 3 — PRODUCTION REUSABLE AppBottomSheetModal
 * ============================================================
 *
 * Đây là component bạn sẽ dùng ở MỌI NƠI trong app thực tế.
 * Chỉ viết 1 lần, dùng mãi mãi bằng cách truyền children vào.
 *
 * Những gì level này thêm vào:
 *  1. Wrapper tổng quát: nhận `children` prop → content bên trong linh hoạt
 *  2. Custom Handle: thay thanh kéo mặc định bằng design đẹp hơn
 *  3. Custom Backdrop: có animation opacity, bấm ngoài thì đóng
 *  4. Đầy đủ TypeScript: props interface rõ ràng, có default values
 *  5. Dynamic snap: truyền snapPoints từ ngoài vào, có default fallback
 *  6. Callbacks: onOpen, onClose để cha biết khi nào sheet mở/đóng
 *  7. Có thể lock: enablePanDownToClose={false} để ngăn kéo xuống đóng
 *
 * ✅ Cách dùng ở màn hình khác:
 *
 *   const modalRef = useRef<BottomSheetModal>(null)
 *
 *   <AppBottomSheetModal ref={modalRef} title="Chọn phương thức">
 *     <PaymentList />   ← bất kỳ component nào cũng được
 *   </AppBottomSheetModal>
 *
 * ============================================================
 */

import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
    forwardRef,
    ReactNode,
    useCallback,
    useMemo,
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ─── Props Interface ──────────────────────────────────────────────────────────
interface AppBottomSheetModalProps {
  /** Nội dung bên trong modal — bất kỳ component React nào */
  children: ReactNode;

  /** Tiêu đề hiển thị phía trên modal */
  title?: string;

  /** Các mức cao sheet dừng lại. Default: ['50%'] */
  snapPoints?: string[];

  /** Có hiện nút X (đóng) ở góc phải không. Default: true */
  showCloseButton?: boolean;

  /** Có cho phép kéo xuống để đóng không. Default: true */
  enablePanDownToClose?: boolean;

  /** Content bên trong có thể cuộn không. Default: false */
  scrollable?: boolean;

  /** Callback khi modal vừa mở xong */
  onOpen?: () => void;

  /** Callback khi modal vừa đóng */
  onClose?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
const AppBottomSheetModal = forwardRef<BottomSheetModal, AppBottomSheetModalProps>(
  (
    {
      children,
      title,
      snapPoints: snapPointsProp,
      showCloseButton = true,
      enablePanDownToClose = true,
      scrollable = false,
      onOpen,
      onClose,
    },
    ref
  ) => {
    // Dùng prop nếu có, không thì fallback về ['50%']
    const snapPoints = useMemo(
      () => snapPointsProp ?? ['50%'],
      [snapPointsProp]
    );

    // ─── Custom Backdrop ────────────────────────────────────────────────
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={enablePanDownToClose ? 'close' : 'none'}
          opacity={0.55}
        />
      ),
      [enablePanDownToClose]
    );

    // ─── Custom Handle ──────────────────────────────────────────────────
    // Thay thế thanh kéo mặc định (xám nhỏ) bằng design tùy chỉnh
    const renderHandle = useCallback(
      () => (
        <View style={styles.handleContainer}>
          {/* Thanh kéo */}
          <View style={styles.handleBar} />

          {/* Header: title + nút đóng */}
          {(title || showCloseButton) && (
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{title ?? ''}</Text>

              {showCloseButton && (
                <TouchableOpacity
                  style={styles.closeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() =>
                    (ref as React.RefObject<BottomSheetModal>).current?.dismiss()
                  }
                >
                  <Text style={styles.closeBtnIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      ),
      [title, showCloseButton, ref]
    );

    // ─── Render ─────────────────────────────────────────────────────────
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}      // Gắn custom handle
        enablePanDownToClose={enablePanDownToClose}
        onAnimate={(_, toIndex) => {
          // toIndex = -1 nghĩa là đang ĐÓNG
          // toIndex >= 0 nghĩa là đang MỞ
          if (toIndex === -1) onClose?.();
          if (toIndex >= 0) onOpen?.();
        }}
      >
        {/*
         * Nếu scrollable=true → dùng BottomSheetScrollView (cuộn được)
         * Nếu scrollable=false → dùng BottomSheetView (cố định)
         */}
        {scrollable ? (
          <BottomSheetScrollView contentContainerStyle={styles.content}>
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={styles.content}>
            {children}
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  }
);

export default AppBottomSheetModal;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Handle / Header
  handleContainer: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#fff',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnIcon: { fontSize: 12, color: '#555', fontWeight: '700' },

  // Content
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
