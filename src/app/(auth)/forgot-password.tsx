import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  return (
    <LinearGradient colors={['#0F0F0F', '#1A1A2E', '#16213E']} style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Khôi phục mật khẩu</Text>
        <Text style={styles.subtitle}>Nhập email để nhận link đặt lại mật khẩu</Text>

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

        <TouchableOpacity style={styles.btn} activeOpacity={0.85}>
          <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.btnGradient}>
            <Text style={styles.btnText}>Gửi link khôi phục</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 28, paddingTop: 80, gap: 16 },
  backBtn: { marginBottom: 24 },
  backText: { color: '#6C63FF', fontSize: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 8 },
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
  btn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
