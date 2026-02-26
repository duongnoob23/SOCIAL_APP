import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // TODO: integrate register logic
    router.replace('/(tabs)/home');
  };

  return (
    <LinearGradient colors={['#0F0F0F', '#1A1A2E', '#16213E']} style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Gia nhập cộng đồng SocialApp</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#555"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#555"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} activeOpacity={0.85}>
              <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.btnGradient}>
                <Text style={styles.btnText}>Đăng ký</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <Link href="/(auth)/login">
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 6 },
  form: { gap: 16 },
  inputWrapper: { gap: 6 },
  label: { color: '#AAA', fontSize: 13, fontWeight: '600', marginLeft: 4 },
  input: {
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: '#FFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  registerBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 36 },
  footerText: { color: '#888', fontSize: 14 },
  loginLink: { color: '#6C63FF', fontSize: 14, fontWeight: '700' },
});
