import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/authStore";
import { SplashScreen, useRootNavigationState, useRouter } from "expo-router";
import React from "react";

export default function Index() {
  const { token, isHydrated } = useAuthStore();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  console.log("AAAA", token);
  React.useEffect(() => {
    // Điều kiện 1: Navigator chưa sẵn sàng → chờ
    if (!navigationState?.key) return;

    // Điều kiện 2: MMKV chưa load xong → chờ
    if (!isHydrated) return;

    const timer = setTimeout(async () => {
      router.replace(token ? ROUTES.MAIN_STORY : ROUTES.SIGN_IN);
      await SplashScreen.hideAsync();
    });

    // setTimeout 0ms: đẩy điều hướng ra ngoài render cycle hiện tại
    // tránh warning "Cannot update a component while rendering a different component"
    return () => clearTimeout(timer);
  }, [isHydrated, navigationState, token]);

  return null;
}
