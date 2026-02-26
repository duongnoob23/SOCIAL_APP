import { Redirect } from 'expo-router';

// Entry point - redirect to auth or tabs
export default function Index() {
  // Giả lập chưa đăng nhập -> vào auth
  const isLoggedIn = false;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
