import { Stack, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable, Platform } from 'react-native';
import { Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

export default function HomeLayout() {
  const router = useRouter();

  const handleInfo = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/(home)/about' as any);
  }, [router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' as const },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerRight: () => (
            <Pressable onPress={handleInfo} hitSlop={12} style={{ marginRight: 4 }}>
              <Info size={22} color={Colors.textSecondary} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="preflight" options={{ title: 'Pre-Flight Check' }} />
      <Stack.Screen name="pediatric-setup" options={{ title: 'Pediatric Setup' }} />
      <Stack.Screen name="airway-assessment" options={{ title: 'Airway Assessment' }} />
      <Stack.Screen
        name="about"
        options={{
          title: 'About & Legal',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.surface },
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
    </Stack>
  );
}
