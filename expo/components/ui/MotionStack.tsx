import React, { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from ".";

/** Every navigator observes the preference, including nested case/crisis stacks. */
export default function MotionStack() {
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
    <Stack
      screenOptions={{
        headerShown: false,
        animation: reducedMotion ? "none" : "default",
        contentStyle: { backgroundColor: t.bg },
      }}
    />
  );
}
