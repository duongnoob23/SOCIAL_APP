import { Stack } from "expo-router";

export default function OnBoardingLayout() {
  return (
    // Tại sao lại có stack ở đây? vì chúng ta muốn có một stack navigator để quản lý các màn hình
    <Stack screenOptions={{ headerShown: false }}>
      // Tại sao lại cso stack screen options ở đây? vì chúng ta muốn ẩn header
      của stack navigator để có thể tùy chỉnh giao diện
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="get-started" />
    </Stack>
  );
}
