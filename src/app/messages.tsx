import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_CHATS = [
  { id: '1', name: 'Anna Dev', avatar: '👩‍💻', lastMsg: 'Hẹn thứ 2 review code nha!', time: '2p', unread: 3, online: true },
  { id: '2', name: 'Nhóm React Native VN', avatar: '👥', lastMsg: 'Có ai dùng Expo SDK 52 chưa?', time: '15p', unread: 12, online: false },
  { id: '3', name: 'Minh Code', avatar: '🧑‍💻', lastMsg: 'Ok, tối mày xem lại nha', time: '1g', unread: 0, online: true },
  { id: '4', name: 'Sara Design', avatar: '👩‍🎨', lastMsg: 'Design mới đây nè 👇', time: '3g', unread: 0, online: false },
  { id: '5', name: 'Tom Builder', avatar: '🧑‍🔧', lastMsg: 'Merge thành công rồi 🎉', time: '1ng', unread: 0, online: false },
];

export default function MessagesScreen() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CHATS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tin nhắn</Text>
          <TouchableOpacity>
            <Text style={styles.newChat}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm tin nhắn..."
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {filtered.map((chat) => (
            <TouchableOpacity key={chat.id} style={styles.chatRow} onPress={() => router.push(`/chat/${chat.id}`)}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{chat.avatar}</Text>
                </View>
                {chat.online && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.lastMsg} numberOfLines={1}>{chat.lastMsg}</Text>
              </View>
              <View style={styles.chatMeta}>
                <Text style={styles.chatTime}>{chat.time}</Text>
                {chat.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{chat.unread > 9 ? '9+' : chat.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1E2E' },
  backText: { color: '#6C63FF', fontSize: 22 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  newChat: { fontSize: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E2E', borderRadius: 14, marginHorizontal: 18, marginVertical: 12, paddingHorizontal: 14, gap: 10 },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 14, paddingVertical: 12 },
  scroll: { flex: 1 },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, gap: 14, borderBottomWidth: 1, borderBottomColor: '#141414' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 26 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 13, height: 13, borderRadius: 6.5, backgroundColor: '#00D26A', borderWidth: 2, borderColor: '#0F0F0F' },
  chatInfo: { flex: 1, gap: 4 },
  chatName: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  lastMsg: { color: '#666', fontSize: 13 },
  chatMeta: { alignItems: 'flex-end', gap: 6 },
  chatTime: { color: '#555', fontSize: 12 },
  unreadBadge: { backgroundColor: '#6C63FF', borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  unreadText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
});
