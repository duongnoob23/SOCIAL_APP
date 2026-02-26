/**
 * ============================================================
 * Lab Học Tập: BottomSheetModal
 * ============================================================
 * Màn hình này là "sân tập" — mỗi button mở một level khác nhau
 * để bạn so sánh từ đơn giản → production
 * ============================================================
 */

import AppBottomSheetModal from '@/components/BottomSheets/AppBottomSheetModal';
import Level1_BasicModal from '@/components/BottomSheets/Level1_BasicModal';
import Level2_ListModal from '@/components/BottomSheets/Level2_ListModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LogEntry {
  time: string;
  message: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
const LearnScreen = () => {
  // ── Refs — mỗi modal cần 1 ref riêng ────────────────────────────────────
  const level1Ref = useRef<BottomSheetModal>(null);
  const level2Ref = useRef<BottomSheetModal>(null);
  const level3_basicRef = useRef<BottomSheetModal>(null);
  const level3_scrollRef = useRef<BottomSheetModal>(null);

  // ── State — log events để xem callback hoạt động ─────────────────────────
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('Chưa chọn');

  const addLog = useCallback((message: string) => {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs((prev) => [{ time, message }, ...prev].slice(0, 5)); // giữ 5 log gần nhất
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openLevel1 = useCallback(() => level1Ref.current?.present(), []);
  const openLevel2 = useCallback(() => level2Ref.current?.present(), []);
  const openLevel3_basic = useCallback(() => level3_basicRef.current?.present(), []);
  const openLevel3_scroll = useCallback(() => level3_scrollRef.current?.present(), []);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>📚</Text>
          <Text style={styles.headerTitle}>BottomSheetModal Lab</Text>
          <Text style={styles.headerSub}>Học từ cơ bản → Production</Text>
        </View>

        {/* ── Level 1 ─────────────────────────────────────────────── */}
        <LessonCard
          level="01"
          color="#3498db"
          title="Basic Modal"
          description="forwardRef + snapPoints + present() + dismiss(). Không backdrop, không props."
          concepts={['forwardRef', 'snapPoints', 'present()', 'dismiss()', 'BottomSheetView']}
          onPress={openLevel1}
        />

        {/* ── Level 2 ─────────────────────────────────────────────── */}
        <LessonCard
          level="02"
          color="#9b59b6"
          title="List + Backdrop"
          description="Danh sách với FlatList, backdrop mờ bấm ngoài để đóng, và callback props."
          concepts={['BottomSheetFlatList', 'BottomSheetBackdrop', 'Props', 'onDismiss']}
          onPress={openLevel2}
        />
        {selectedBank !== 'Chưa chọn' && (
          <View style={styles.resultBadge}>
            <Text style={styles.resultText}>✅ Đã chọn: {selectedBank}</Text>
          </View>
        )}

        {/* ── Level 3 ─────────────────────────────────────────────── */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>LEVEL 03 — PRODUCTION</Text>
          <Text style={styles.sectionTitleSub}>AppBottomSheetModal: 1 component dùng mọi nơi</Text>
        </View>

        <LessonCard
          level="3a"
          color="#27ae60"
          title="Nội dung cố định (không cuộn)"
          description='scrollable={false} — dùng khi content vừa với màn hình.'
          concepts={['scrollable={false}', 'custom handle', 'custom backdrop', 'onOpen/onClose']}
          onPress={openLevel3_basic}
        />

        <LessonCard
          level="3b"
          color="#e67e22"
          title="Nội dung dài (có cuộn)"
          description='scrollable={true} — dùng khi content dài hơn màn hình.'
          concepts={['scrollable={true}', 'BottomSheetScrollView', 'snapPoints={[70%]}']}
          onPress={openLevel3_scroll}
        />

        {/* ── Event Log ───────────────────────────────────────────── */}
        {logs.length > 0 && (
          <View style={styles.logBox}>
            <Text style={styles.logTitle}>📡 Event Log</Text>
            {logs.map((log, i) => (
              <Text key={i} style={styles.logEntry}>
                <Text style={styles.logTime}>[{log.time}]</Text> {log.message}
              </Text>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ================================================================
          MODAL COMPONENTS
          Đặt ở NGOÀI ScrollView, TRONG SafeAreaView
          để chúng hiển thị đúng z-index trên toàn màn hình
          ================================================================ */}

      {/* Level 1: Basic không có gì extra */}
      <Level1_BasicModal ref={level1Ref} />

      {/* Level 2: FlatList + Backdrop + Props */}
      <Level2_ListModal
        ref={level2Ref}
        onSelectBank={(bank) => {
          setSelectedBank(bank.name);
          addLog(`Chọn ngân hàng: ${bank.name}`);
        }}
        onDismiss={() => addLog('Level 2 modal đóng')}
      />

      {/* Level 3a: AppBottomSheetModal — fixed content */}
      <AppBottomSheetModal
        ref={level3_basicRef}
        title="Xác nhận thanh toán"
        snapPoints={['45%']}
        onOpen={() => addLog('Level 3a modal MỞ')}
        onClose={() => addLog('Level 3a modal ĐÓNG')}
      >
        {/* ← children: bất kỳ UI nào cũng được */}
        <View style={styles.paymentContent}>
          <Text style={styles.paymentAmount}>500,000 ₫</Text>
          <Text style={styles.paymentLabel}>Thanh toán đến Vietcombank</Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#27ae60' }]}
            onPress={() => {
              addLog('✅ Xác nhận thanh toán!');
              level3_basicRef.current?.dismiss();
            }}
          >
            <Text style={styles.actionBtnText}>Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#f0f0f0', marginTop: 8 }]}
            onPress={() => level3_basicRef.current?.dismiss()}
          >
            <Text style={[styles.actionBtnText, { color: '#666' }]}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      </AppBottomSheetModal>

      {/* Level 3b: AppBottomSheetModal — scrollable content */}
      <AppBottomSheetModal
        ref={level3_scrollRef}
        title="Điều khoản sử dụng"
        snapPoints={['70%']}
        scrollable={true}   // ← BẬT cuộn
        onOpen={() => addLog('Level 3b modal MỞ')}
        onClose={() => addLog('Level 3b modal ĐÓNG')}
      >
        {/* Content dài → cần scrollable */}
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={styles.termItem}>
            <Text style={styles.termNumber}>{i + 1}.</Text>
            <Text style={styles.termText}>
              Điều khoản số {i + 1}: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </Text>
          </View>
        ))}
      </AppBottomSheetModal>
    </SafeAreaView>
  );
};

// ─── Sub-component: LessonCard ────────────────────────────────────────────────
interface LessonCardProps {
  level: string;
  color: string;
  title: string;
  description: string;
  concepts: string[];
  onPress: () => void;
}

const LessonCard = ({ level, color, title, description, concepts, onPress }: LessonCardProps) => (
  <View style={styles.card}>
    <View style={[styles.cardLevelBadge, { backgroundColor: color }]}>
      <Text style={styles.cardLevelText}>LV {level}</Text>
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{description}</Text>
    <View style={styles.conceptsRow}>
      {concepts.map((c) => (
        <View key={c} style={styles.conceptTag}>
          <Text style={styles.conceptTagText}>{c}</Text>
        </View>
      ))}
    </View>
    <TouchableOpacity style={[styles.openBtn, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.openBtnText}>▶ Mở Modal</Text>
    </TouchableOpacity>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8fc' },
  scroll: { padding: 16, gap: 12 },

  // Header
  header: { alignItems: 'center', paddingVertical: 20 },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a2e' },
  headerSub: { fontSize: 14, color: '#888', marginTop: 4 },

  // Lesson Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLevelBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardLevelText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  cardDesc: { fontSize: 13, color: '#666', lineHeight: 20 },
  conceptsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  conceptTag: {
    backgroundColor: '#f0f4ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  conceptTagText: { fontSize: 11, color: '#3b5bdb', fontWeight: '600' },
  openBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  openBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Section title
  sectionTitle: { paddingTop: 8, paddingBottom: 4 },
  sectionTitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#aaa',
    letterSpacing: 1.5,
  },
  sectionTitleSub: { fontSize: 13, color: '#555', marginTop: 2 },

  // Result badge
  resultBadge: {
    backgroundColor: '#eafaf1',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#a9dfbf',
  },
  resultText: { fontSize: 14, color: '#27ae60', fontWeight: '600' },

  // Event log
  logBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    gap: 6,
    marginTop: 4,
  },
  logTitle: { color: '#aaa', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  logEntry: { color: '#e0e0e0', fontSize: 12, lineHeight: 18 },
  logTime: { color: '#7fc8f8', fontFamily: 'monospace' },

  // Level 3 content examples
  paymentContent: { alignItems: 'center', gap: 8, paddingTop: 12 },
  paymentAmount: { fontSize: 36, fontWeight: '800', color: '#1a1a2e' },
  paymentLabel: { fontSize: 15, color: '#888' },
  actionBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  actionBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  termItem: { flexDirection: 'row', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  termNumber: { fontSize: 14, fontWeight: '700', color: '#3b5bdb', minWidth: 24 },
  termText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 22 },
});

export default LearnScreen;