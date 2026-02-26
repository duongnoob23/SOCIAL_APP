import { LinearGradient } from 'expo-linear-gradient';
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

export default function EditProfileScreen() {
  const [name, setName] = useState('Nguyễn Văn A');
  const [username, setUsername] = useState('nguyenvana');
  const [bio, setBio] = useState('Mobile developer 📱 | Coffee lover ☕ | Building cool apps every day 🔥');
  const [website, setWebsite] = useState('github.com/nguyenvana');
  const [location, setLocation] = useState('Hà Nội, Việt Nam');

  const handleSave = () => {
    // TODO: save profile
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Huỷ</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>🧑‍💻</Text>
              </View>
            </LinearGradient>
            <TouchableOpacity style={styles.changeAvatarBtn}>
              <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          <View style={styles.fields}>
            {[
              { label: 'Tên hiển thị', value: name, onChange: setName, placeholder: 'Tên của bạn' },
              { label: 'Tên người dùng', value: username, onChange: setUsername, placeholder: '@username', prefix: '@' },
              { label: 'Website', value: website, onChange: setWebsite, placeholder: 'website.com' },
              { label: 'Địa điểm', value: location, onChange: setLocation, placeholder: 'Thành phố, Quốc gia' },
            ].map((field) => (
              <View key={field.label} style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={field.placeholder}
                  placeholderTextColor="#444"
                />
              </View>
            ))}

            {/* Bio */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Giới thiệu</Text>
              <TextInput
                style={[styles.fieldInput, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Mô tả về bạn..."
                placeholderTextColor="#444"
                multiline
                maxLength={150}
                textAlignVertical="top"
              />
              <Text style={styles.bioCounter}>{bio.length}/150</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
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
  saveText: { color: '#6C63FF', fontSize: 16, fontWeight: '700' },
  scroll: { flex: 1 },
  avatarSection: { alignItems: 'center', paddingVertical: 28, gap: 12 },
  avatarRing: { width: 100, height: 100, borderRadius: 50, padding: 3 },
  avatar: { flex: 1, borderRadius: 47, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 48 },
  changeAvatarBtn: {},
  changeAvatarText: { color: '#6C63FF', fontSize: 15, fontWeight: '600' },
  fields: { paddingHorizontal: 18, gap: 18 },
  fieldWrapper: { gap: 8 },
  fieldLabel: { color: '#AAA', fontSize: 13, fontWeight: '600', marginLeft: 4 },
  fieldInput: { backgroundColor: '#1E1E2E', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: '#2A2A3E' },
  bioInput: { minHeight: 100, paddingTop: 14 },
  bioCounter: { color: '#555', fontSize: 12, textAlign: 'right' },
});
