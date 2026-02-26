import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SETTINGS_SECTIONS = [
  {
    title: 'Tài khoản',
    items: [
      { icon: '👤', label: 'Chỉnh sửa hồ sơ', route: '/edit-profile' },
      { icon: '🔐', label: 'Đổi mật khẩu', route: '/change-password' },
      { icon: '📧', label: 'Email & Số điện thoại', route: '/account-info' },
    ],
  },
  {
    title: 'Quyền riêng tư',
    items: [
      { icon: '🔒', label: 'Tài khoản riêng tư', toggle: true, value: false },
      { icon: '👁️', label: 'Ai có thể thấy bài viết', route: '/privacy' },
      { icon: '🚫', label: 'Danh sách chặn', route: '/blocked' },
    ],
  },
  {
    title: 'Thông báo',
    items: [
      { icon: '🔔', label: 'Thông báo đẩy', toggle: true, value: true },
      { icon: '📩', label: 'Email thông báo', toggle: true, value: false },
    ],
  },
  {
    title: 'Khác',
    items: [
      { icon: '❓', label: 'Trợ giúp & Hỗ trợ', route: '/help' },
      { icon: 'ℹ️', label: 'Về ứng dụng', route: '/about' },
    ],
  },
];

export default function SettingsScreen() {
  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => router.replace('/(auth)/login') },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cài đặt</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {SETTINGS_SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.settingItem, index < section.items.length - 1 && styles.itemBorder]}
                    onPress={item.route ? () => router.push(item.route as any) : undefined}
                  >
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>🚪 Đăng xuất</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1E2E' },
  backText: { color: '#6C63FF', fontSize: 22, width: 40 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 18, paddingTop: 24 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  sectionCard: { backgroundColor: '#1A1A2E', borderRadius: 16, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 14 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: '#111' },
  itemIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  itemLabel: { flex: 1, color: '#DDD', fontSize: 15 },
  itemArrow: { color: '#555', fontSize: 20 },
  logoutBtn: { backgroundColor: 'rgba(255,71,87,0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,71,87,0.3)', paddingVertical: 16, alignItems: 'center' },
  logoutText: { color: '#FF4757', fontSize: 15, fontWeight: '700' },
});
