import { Tabs } from "expo-router";
import { Home, Calculator, AlertTriangle, ClipboardList, BookOpen } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
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
          fontWeight: '600' as const,
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
          tabBarBadge: '',
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
  );
}
