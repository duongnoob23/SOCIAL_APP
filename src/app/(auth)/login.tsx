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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: integrate auth logic
    router.replace('/(tabs)/home');
  };

  return (
    <LinearGradient colors={['#0F0F0F', '#1A1A2E', '#16213E']} style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo / Title */}
          <View style={styles.header}>
            <Text style={styles.logo}>🔥</Text>
            <Text style={styles.title}>SocialApp</Text>
            <Text style={styles.subtitle}>Kết nối thế giới của bạn</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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

            <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </Link>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
              <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.btnGradient}>
                <Text style={styles.btnText}>Đăng nhập</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              <Text style={styles.socialBtnText}>🌐  Tiếp tục với Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <Link href="/(auth)/register">
              <Text style={styles.registerLink}>Đăng ký</Text>
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
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 60, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
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
  forgotLink: { alignSelf: 'flex-end' },
  forgotText: { color: '#6C63FF', fontSize: 13 },
  loginBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2A2A3E' },
  dividerText: { color: '#555', fontSize: 13 },
  socialBtn: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
  },
  socialBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 36 },
  footerText: { color: '#888', fontSize: 14 },
  registerLink: { color: '#6C63FF', fontSize: 14, fontWeight: '700' },
});
