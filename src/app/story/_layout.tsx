import { Stack } from "expo-router";
import React from "react";

const MainStoryLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="main-story" />
      <Stack.Screen name="select-photos" />
    </Stack>
  );
};

export default MainStoryLayout;
