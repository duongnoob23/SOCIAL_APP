import { queryClient } from "@/lib/react-query";
import { darkTheme, lightTheme } from "@/theme";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Giữ splash screen cho đến khi font load xong
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Font loading — dùng expo-font thay vì AsyncFont × 12
  // useFonts trả về [loaded, error], tự động handle async
  const [fontsLoaded, fontError] = useFonts({
    "Gotham-Thin": require("../assets/fonts/GOTHAM-THIN.ttf"),
    "Gotham-ThinItalic": require("../assets/fonts/GOTHAM-THINITALIC.ttf"),
    "Gotham-Light": require("../assets/fonts/GOTHAM-LIGHT.ttf"),
    "Gotham-LightItalic": require("../assets/fonts/GOTHAM-LIGHTITALIC.ttf"),
    "Gotham-Regular": require("../assets/fonts/Gotham-Book.otf"),
    "Gotham-RegularItalic": require("../assets/fonts/Gotham-BookItalic.otf"),
    "Gotham-Medium": require("../assets/fonts/GOTHAM-MEDIUM.ttf"),
    "Gotham-MediumItalic": require("../assets/fonts/GOTHAM-MEDIUMITALIC.ttf"),
    "Gotham-Bold": require("../assets/fonts/GOTHAM-BOLD.ttf"),
    "Gotham-BoldItalic": require("../assets/fonts/GOTHAM-BOLDITALIC.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // GestureHandlerRootView: PHẢI là root ngoài cùng
    // style flex:1 bắt buộc, thiếu sẽ gây layout bug trên Android
    <GestureHandlerRootView style={styles.container}>
      {/* SafeAreaProvider: cung cấp insets cho toàn app */}
      <SafeAreaProvider>
        {/* KeyboardProvider: xử lý keyboard behavior nhất quán iOS/Android */}
        <KeyboardProvider>
          {/* QueryClientProvider: để bất kỳ component nào cũng dùng được React Query */}
          <QueryClientProvider client={queryClient}>
            {/* ThemeProvider: dark/light mode */}
            <ThemeProvider
              value={colorScheme === "dark" ? darkTheme : lightTheme}
            >
              <Stack screenOptions={{ headerShown: false }}>
                {/* index.tsx: điều phối luồng auth, không render UI */}
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(main)" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
