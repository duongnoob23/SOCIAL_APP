import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_POSTS = [
  { id: '1', content: 'Đang học React Native và rất thú vị! 🚀', likes: 48, comments: 12 },
  { id: '2', content: 'Coffee và code - combo hoàn hảo ☕💻', likes: 91, comments: 7 },
  { id: '3', content: 'Cuối tuần deploy success! Không còn gì tuyệt hơn 🎉', likes: 134, comments: 24 },
];

const STATS = [
  { label: 'Bài viết', value: '42' },
  { label: 'Người theo dõi', value: '1.2K' },
  { label: 'Đang theo dõi', value: '384' },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cover + Avatar */}
        <LinearGradient colors={['#1A1A2E', '#6C63FF', '#8B5CF6']} style={styles.cover} />

        <SafeAreaView edges={['top']} style={styles.safeArea} />

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🧑‍💻</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.editRow}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/edit-profile')}>
              <Text style={styles.editBtnText}>✏️ Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.displayName}>Nguyễn Văn A</Text>
          <Text style={styles.username}>@nguyenvana</Text>
          <Text style={styles.bio}>Mobile developer 📱 | Coffee lover ☕ | Building cool apps every day 🔥</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>📍 Hà Nội, Việt Nam</Text>
            <Text style={styles.metaItem}>🔗 github.com/nguyenvana</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {STATS.map((stat) => (
              <TouchableOpacity key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Posts */}
        <View style={styles.postsSection}>
          <Text style={styles.postsSectionTitle}>Bài viết</Text>
          {MOCK_POSTS.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>❤️ {post.likes}</Text>
                <Text style={styles.postStat}>💬 {post.comments}</Text>
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
  scroll: { flex: 1 },
  cover: { height: 150 },
  safeArea: { position: 'absolute', top: 0, left: 0, right: 0 },
  profileSection: { paddingHorizontal: 18, paddingBottom: 4 },
  avatarContainer: { marginTop: -44, position: 'relative', width: 88 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#0F0F0F' },
  avatarText: { fontSize: 44 },
  onlineDot: { position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#00D26A', borderWidth: 3, borderColor: '#0F0F0F' },
  editRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  editBtn: { borderRadius: 20, borderWidth: 1, borderColor: '#2A2A3E', paddingHorizontal: 16, paddingVertical: 8 },
  editBtnText: { color: '#CCC', fontSize: 13, fontWeight: '600' },
  settingsBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#2A2A3E', alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 16 },
  displayName: { color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 12 },
  username: { color: '#6C63FF', fontSize: 14, marginTop: 2 },
  bio: { color: '#AAA', fontSize: 14, lineHeight: 21, marginTop: 10 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 10 },
  metaItem: { color: '#888', fontSize: 13 },
  statsRow: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-around', backgroundColor: '#1A1A2E', borderRadius: 16, paddingVertical: 16 },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 12 },
  postsSection: { paddingHorizontal: 18, paddingTop: 24, gap: 12 },
  postsSectionTitle: { color: '#FFF', fontSize: 17, fontWeight: '700', marginBottom: 4 },
  postCard: { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16, gap: 10 },
  postContent: { color: '#CCC', fontSize: 14, lineHeight: 21 },
  postStats: { flexDirection: 'row', gap: 16 },
  postStat: { color: '#888', fontSize: 13 },
});
