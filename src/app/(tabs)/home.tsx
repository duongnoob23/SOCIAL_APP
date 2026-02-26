import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ---- Mock Data ----
const MOCK_STORIES = [
  { id: '1', name: 'Hải', avatar: '👦', seen: false },
  { id: '2', name: 'Linh', avatar: '👧', seen: false },
  { id: '3', name: 'Nam', avatar: '🧑', seen: true },
  { id: '4', name: 'Hoa', avatar: '👩', seen: true },
  { id: '5', name: 'Tuấn', avatar: '👨', seen: true },
];

const MOCK_POSTS = [
  {
    id: '1',
    user: { name: 'Nguyễn Hải', avatar: '🧑‍💻', username: 'nguyenhai' },
    time: '5 phút trước',
    content: 'Hôm nay là một ngày tuyệt vời! Đang học React Native và cảm thấy rất thú vị 🚀',
    likes: 48,
    comments: 12,
    shares: 3,
    liked: false,
  },
  {
    id: '2',
    user: { name: 'Trần Linh', avatar: '👩‍🎨', username: 'tranlinh' },
    time: '1 giờ trước',
    content: 'Chia sẻ một chút về công việc freelance design. Dự án lần này khá thú vị, client rất professional! 💼✨',
    likes: 124,
    comments: 34,
    shares: 18,
    liked: true,
  },
  {
    id: '3',
    user: { name: 'Lê Nam', avatar: '🧑‍🍳', username: 'lenam' },
    time: '3 giờ trước',
    content: 'Tự nấu bữa tối xong, cảm giác thật self-sufficient 🍜 Ai biết nấu không dạy mình với!',
    likes: 89,
    comments: 21,
    shares: 5,
    liked: false,
  },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>SocialApp</Text>
        <TouchableOpacity style={styles.msgBtn} onPress={() => router.push('/messages')}>
          <Text style={styles.msgIcon}>✉️</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />}
      >
        {/* Stories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stories} contentContainerStyle={styles.storiesContent}>
          {/* My Story */}
          <TouchableOpacity style={styles.storyItem}>
            <View style={[styles.storyAvatar, styles.myStoryAvatar]}>
              <Text style={styles.storyAvatarText}>➕</Text>
            </View>
            <Text style={styles.storyName}>Tin của bạn</Text>
          </TouchableOpacity>

          {MOCK_STORIES.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyItem}>
              <View style={[styles.storyAvatarRing, !story.seen && styles.storyUnseen]}>
                <View style={styles.storyAvatar}>
                  <Text style={styles.storyAvatarText}>{story.avatar}</Text>
                </View>
              </View>
              <Text style={styles.storyName}>{story.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function PostCard({ post, onLike }: { post: (typeof MOCK_POSTS)[0]; onLike: () => void }) {
  return (
    <View style={styles.card}>
      {/* Post Header */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{post.user.avatar}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{post.user.name}</Text>
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Text style={styles.moreText}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>❤️ {post.likes} lượt thích</Text>
        <Text style={styles.statsText}>{post.comments} bình luận · {post.shares} chia sẻ</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
          <Text style={[styles.actionText, post.liked && styles.likedText]}>
            {post.liked ? '❤️' : '🤍'} Thích
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>💬 Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>↗️ Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingBottom: 12, backgroundColor: '#121212', borderBottomWidth: 1, borderBottomColor: '#1E1E2E' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#6C63FF' },
  msgBtn: { position: 'relative', padding: 4 },
  msgIcon: { fontSize: 22 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FF4757', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  scroll: { flex: 1 },
  stories: { borderBottomWidth: 1, borderBottomColor: '#1E1E2E' },
  storiesContent: { paddingHorizontal: 12, paddingVertical: 14, gap: 16 },
  storyItem: { alignItems: 'center', gap: 6 },
  storyAvatarRing: { width: 66, height: 66, borderRadius: 33, padding: 3, borderWidth: 2, borderColor: '#333' },
  storyUnseen: { borderColor: '#6C63FF' },
  storyAvatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' },
  myStoryAvatar: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: '#2A2A3E', borderStyle: 'dashed' },
  storyAvatarText: { fontSize: 26 },
  storyName: { color: '#AAA', fontSize: 11, width: 66, textAlign: 'center' },
  card: { backgroundColor: '#121212', marginTop: 10, paddingTop: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20 },
  userName: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  postTime: { color: '#666', fontSize: 12, marginTop: 1 },
  moreBtn: { padding: 4 },
  moreText: { color: '#666', fontSize: 16, letterSpacing: 2 },
  postContent: { color: '#E0E0E0', fontSize: 14, lineHeight: 22, paddingHorizontal: 16, marginBottom: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  statsText: { color: '#666', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#1E1E2E', marginHorizontal: 16 },
  actionsRow: { flexDirection: 'row', paddingVertical: 4 },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  actionText: { color: '#888', fontSize: 13, fontWeight: '600' },
  likedText: { color: '#FF4757' },
});
