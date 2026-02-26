import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRENDING_TAGS = ['#ReactNative', '#Expo', '#JavaScript', '#TypeScript', '#Mobile', '#OpenSource'];

const SUGGESTED_USERS = [
  { id: '1', name: 'Anna Dev', username: 'annadev', avatar: '👩‍💻', followers: '12.4K', bio: 'Mobile developer & UI lover' },
  { id: '2', name: 'Minh Code', username: 'minhcode', avatar: '🧑‍💻', followers: '8.2K', bio: 'Full-stack | React Native enthusiast' },
  { id: '3', name: 'Sara Design', username: 'saradesign', avatar: '👩‍🎨', followers: '34K', bio: 'UX/UI Designer at Tech Co.' },
  { id: '4', name: 'Tom Builder', username: 'tombuilder', avatar: '🧑‍🔧', followers: '5.1K', bio: 'Building apps for the future' },
];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>Khám phá</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm người dùng, bài viết..."
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Trending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Đang thịnh hành</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
            {TRENDING_TAGS.map((tag) => (
              <TouchableOpacity key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Suggested Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Gợi ý kết bạn</Text>
          {SUGGESTED_USERS.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>{user.avatar}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userUsername}>@{user.username}</Text>
                <Text style={styles.userBio} numberOfLines={1}>{user.bio}</Text>
              </View>
              <View style={styles.userRight}>
                <Text style={styles.followers}>{user.followers}</Text>
                <Text style={styles.followersLabel}>followers</Text>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followBtnText}>Theo dõi</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  header: { backgroundColor: '#121212', borderBottomWidth: 1, borderBottomColor: '#1E1E2E', paddingHorizontal: 18, paddingBottom: 14 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E2E', borderRadius: 14, paddingHorizontal: 14, gap: 10 },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 14, paddingVertical: 12 },
  scroll: { flex: 1 },
  section: { paddingTop: 24, paddingHorizontal: 18, gap: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  tagsRow: { gap: 10, paddingRight: 4 },
  tagChip: { backgroundColor: 'rgba(108,99,255,0.15)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(108,99,255,0.3)' },
  tagText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 16, padding: 14, gap: 12 },
  userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { fontSize: 24 },
  userInfo: { flex: 1, gap: 2 },
  userName: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  userUsername: { color: '#6C63FF', fontSize: 12 },
  userBio: { color: '#888', fontSize: 12, marginTop: 2 },
  userRight: { alignItems: 'center', gap: 2 },
  followers: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  followersLabel: { color: '#666', fontSize: 11 },
  followBtn: { backgroundColor: '#6C63FF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, marginTop: 4 },
  followBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
