import React, { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../components/ui";
export default function Layout() {
  const t = useTheme();
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled()
      .then(setReducedMotion)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReducedMotion,
    );
    return () => sub.remove();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={t.dark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: reducedMotion ? "none" : "default",
          contentStyle: { backgroundColor: t.bg },
        }}
      />
    </GestureHandlerRootView>
  );
}
