import React from "react";
import { Tabs } from "expo-router";
import {
  Home,
  ClipboardList,
  Calculator,
  BookOpen,
  TriangleAlert,
} from "lucide-react-native";
import { useTheme } from "../../components/ui";
export default function Layout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.muted,
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopColor: t.line,
          height: 72,
          paddingBottom: 12,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="prepare"
        options={{
          title: "Prepare",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ color, size }) => (
            <Calculator color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="crisis"
        options={{
          title: "Crisis",
          tabBarIcon: ({ color, size }) => (
            <TriangleAlert color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="cases" options={{ href: null }} />
    </Tabs>
  );
}
