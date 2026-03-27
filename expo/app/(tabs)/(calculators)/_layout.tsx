import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function CalculatorsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' as const },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Calculators" }} />
    </Stack>
  );
}
