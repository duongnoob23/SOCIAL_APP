import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'like', avatar: '👩‍💻', name: 'Anna Dev', action: 'đã thích bài viết của bạn', time: '2p', read: false },
  { id: '2', type: 'comment', avatar: '🧑‍💻', name: 'Minh Code', action: 'đã bình luận: "Tuyệt vời lắm!"', time: '15p', read: false },
  { id: '3', type: 'follow', avatar: '👩‍🎨', name: 'Sara Design', action: 'đã bắt đầu theo dõi bạn', time: '1g', read: false },
  { id: '4', type: 'like', avatar: '🧑‍🔧', name: 'Tom Builder', action: 'đã thích bình luận của bạn', time: '2g', read: true },
  { id: '5', type: 'mention', avatar: '👦', name: 'Hải Nguyễn', action: 'đã nhắc đến bạn trong một bài viết', time: '5g', read: true },
  { id: '6', type: 'share', avatar: '👩', name: 'Hoa Trần', action: 'đã chia sẻ bài viết của bạn', time: '1ng', read: true },
];

const TYPE_ICON: Record<string, string> = {
  like: '❤️',
  comment: '💬',
  follow: '👥',
  mention: '@',
  share: '↗️',
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const displayed = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Thông báo</Text>
            {unreadCount > 0 && <Text style={styles.unreadCount}>{unreadCount} chưa đọc</Text>}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.markAllText}>Đánh dấu đã đọc</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {(['all', 'unread'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'Tất cả' : 'Chưa đọc'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {displayed.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[styles.notifCard, !notif.read && styles.notifUnread]}
            >
              <View style={styles.notifAvatarWrap}>
                <View style={styles.notifAvatar}>
                  <Text style={styles.notifAvatarText}>{notif.avatar}</Text>
                </View>
                <View style={styles.typeIcon}>
                  <Text style={styles.typeIconText}>{TYPE_ICON[notif.type]}</Text>
                </View>
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifText}>
                  <Text style={styles.notifName}>{notif.name}</Text>
                  {' '}{notif.action}
                </Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              {!notif.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}

          {displayed.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔔</Text>
              <Text style={styles.emptyText}>Không có thông báo chưa đọc</Text>
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1E2E' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  unreadCount: { color: '#6C63FF', fontSize: 12, marginTop: 2 },
  markAllText: { color: '#6C63FF', fontSize: 13, fontWeight: '600', marginTop: 6 },
  filterRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingVertical: 14 },
  filterChip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#1A1A2E', borderWidth: 1, borderColor: '#2A2A3E' },
  filterChipActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  filterText: { color: '#888', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  scroll: { flex: 1 },
  notifCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, gap: 14, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  notifUnread: { backgroundColor: 'rgba(108,99,255,0.05)' },
  notifAvatarWrap: { position: 'relative' },
  notifAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' },
  notifAvatarText: { fontSize: 22 },
  typeIcon: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  typeIconText: { fontSize: 11 },
  notifContent: { flex: 1, gap: 3 },
  notifText: { color: '#CCC', fontSize: 13, lineHeight: 19 },
  notifName: { color: '#FFF', fontWeight: '700' },
  notifTime: { color: '#666', fontSize: 12 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6C63FF' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { color: '#666', fontSize: 15 },
});
