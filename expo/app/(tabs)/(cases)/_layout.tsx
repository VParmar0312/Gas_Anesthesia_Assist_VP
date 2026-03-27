import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function CasesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' as const },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Case Log" }} />
      <Stack.Screen
        name="new-case"
        options={{
          title: "Log New Case",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
