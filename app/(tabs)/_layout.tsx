import { Tabs, useRouter } from "expo-router";
import { Home, Calculator, AlertTriangle, ClipboardList, BookOpen } from "lucide-react-native";
import React, { useRef, useCallback } from "react";
import { View, Pressable, Text, StyleSheet, Animated, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

function FloatingEmergencyButton() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 900, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push("/(tabs)/(crisis)");
  }, [router]);

  return (
    <View style={styles.fabContainer} pointerEvents="box-none">
      <Animated.View style={[styles.fabPulse, { transform: [{ scale: pulse }] }]} />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={styles.fab}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          accessibilityLabel="Emergency Protocols"
          accessibilityHint="Opens crisis protocol list"
        >
          <AlertTriangle size={20} color={Colors.textInverse} />
          <Text style={styles.fabText}>SOS</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.accent,
          tabBarInactiveTintColor: Colors.textTertiary,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600" as const,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="(calculators)"
          options={{
            title: "Calcs",
            tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="(crisis)"
          options={{
            title: "Crisis",
            tabBarIcon: ({ color, size }) => <AlertTriangle color={color} size={size} />,
            tabBarBadge: "",
            tabBarBadgeStyle: {
              backgroundColor: Colors.emergency,
              minWidth: 8,
              maxHeight: 8,
              borderRadius: 4,
              top: 6,
            },
          }}
        />
        <Tabs.Screen
          name="(cases)"
          options={{
            title: "Cases",
            tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="(references)"
          options={{
            title: "Reference",
            tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
          }}
        />
      </Tabs>
      <FloatingEmergencyButton />
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 88,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  fabPulse: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.emergency,
    opacity: 0.25,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.emergency,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    gap: 1,
  },
  fabText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: "900" as const,
    letterSpacing: 0.5,
  },
});
