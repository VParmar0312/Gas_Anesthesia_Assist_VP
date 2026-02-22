import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' as const },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="preflight" options={{ title: "Pre-Flight Check" }} />
      <Stack.Screen name="pediatric-setup" options={{ title: "Pediatric Setup" }} />
      <Stack.Screen name="airway-assessment" options={{ title: "Airway Assessment" }} />
    </Stack>
  );
}
