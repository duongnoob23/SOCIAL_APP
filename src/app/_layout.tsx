import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // 1️⃣ GestureHandlerRootView: Bắt buộc phải là root ngoài cùng, bắt toàn bộ gesture
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 2️⃣ BottomSheetModalProvider: Quản lý tất cả BottomSheetModal trong app */}
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="messages" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="edit-profile" />
              <Stack.Screen name="learn" />
            </Stack>
          </QueryClientProvider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
