import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const POST_TYPES = ['📝 Văn bản', '📸 Ảnh', '🎥 Video', '📊 Thăm dò'];

export default function CreateScreen() {
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState(0);

  const charCount = content.length;
  const maxChars = 500;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Huỷ</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo bài viết</Text>
          <TouchableOpacity
            style={[styles.postBtn, content.length === 0 && styles.postBtnDisabled]}
            disabled={content.length === 0}
          >
            <Text style={styles.postBtnText}>Đăng</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Post type selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
            {POST_TYPES.map((type, i) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, selectedType === i && styles.typeChipActive]}
                onPress={() => setSelectedType(i)}
              >
                <Text style={[styles.typeText, selectedType === i && styles.typeTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* User row */}
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🧑‍💻</Text>
            </View>
            <View>
              <Text style={styles.userName}>Bạn</Text>
              <TouchableOpacity style={styles.audienceBtn}>
                <Text style={styles.audienceText}>🌍 Công khai ▾</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Text area */}
          <TextInput
            style={styles.textArea}
            placeholder="Bạn đang nghĩ gì vậy?"
            placeholderTextColor="#444"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={maxChars}
            textAlignVertical="top"
            autoFocus
          />

          {/* Char counter */}
          <Text style={[styles.charCount, charCount > maxChars * 0.9 && styles.charCountWarn]}>
            {charCount}/{maxChars}
          </Text>

          {/* Toolbar */}
          <View style={styles.toolbar}>
            {['📷', '📹', '😊', '🔖', '📍'].map((icon) => (
              <TouchableOpacity key={icon} style={styles.toolbarBtn}>
                <Text style={styles.toolbarIcon}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1E2E' },
  cancelText: { color: '#888', fontSize: 16 },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  postBtn: { backgroundColor: '#6C63FF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  scroll: { flex: 1 },
  typeRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  typeChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#2A2A3E', backgroundColor: '#1A1A2E' },
  typeChipActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  typeText: { color: '#888', fontSize: 13, fontWeight: '600' },
  typeTextActive: { color: '#FFF' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22 },
  userName: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  audienceBtn: { marginTop: 3 },
  audienceText: { color: '#6C63FF', fontSize: 12, fontWeight: '600' },
  textArea: { color: '#E0E0E0', fontSize: 16, lineHeight: 24, paddingHorizontal: 18, minHeight: 200 },
  charCount: { color: '#555', fontSize: 12, textAlign: 'right', paddingRight: 18, marginTop: 8 },
  charCountWarn: { color: '#FF6B35' },
  toolbar: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#1E1E2E', gap: 8, marginTop: 20 },
  toolbarBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },
  toolbarIcon: { fontSize: 20 },
});
