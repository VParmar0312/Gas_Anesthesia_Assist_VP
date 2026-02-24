import { Tabs, useRouter } from "expo-router";
import { Home, Calculator, AlertTriangle, ClipboardList, BookOpen } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import Colors from "@/constants/colors";
export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        initialRouteName="(home)"
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
            title: "SOS",
            tabBarIcon: ({ size }) => <AlertTriangle color="#FF2D2D" size={size} />,
            tabBarActiveTintColor: "#FF2D2D",
            tabBarInactiveTintColor: "#FF2D2D",
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "800" as const,
              color: "#FF2D2D",
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
    </View>
  );
}

