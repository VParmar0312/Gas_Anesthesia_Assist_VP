import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useCallback } from "react";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Shield } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { CaseLogProvider } from "@/contexts/CaseLogContext";
import { ChecklistProvider } from "@/contexts/ChecklistContext";
import Colors from "@/constants/colors";

const DISCLAIMER_KEY = "@anesthassist_disclaimer_accepted";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

const DISCLAIMER_BULLETS = [
  "For use by trained anesthesiology professionals only.",
  "Educational and reference tool only — not for clinical decision-making.",
  "Not a substitute for clinical judgment, institutional protocols, or package insert guidance.",
  "Not FDA-cleared or approved as a medical device.",
  "Always verify drug doses and protocols with authoritative sources before clinical use.",
];

function DisclaimerModal({ onAccept }: { onAccept: () => void }) {
  const handleAccept = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onAccept();
  }, [onAccept]);

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cardContent}
          >
            <View style={styles.iconContainer}>
              <Shield size={32} color={Colors.accent} />
            </View>

            <Text style={styles.title}>Before You Continue</Text>
            <Text style={styles.subtitle}>AnesthAssist: Medical Suite</Text>

            <View style={styles.bulletList}>
              {DISCLAIMER_BULLETS.map((text, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{text}</Text>
                </View>
              ))}
            </View>

            <Pressable style={styles.ctaButton} onPress={handleAccept}>
              <Text style={styles.ctaText}>I Understand — Continue</Text>
            </Pressable>

            <Text style={styles.footNote}>
              This confirmation is required once at first launch.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function RootLayout() {
  // null = storage not yet checked; true = show modal; false = already accepted
  const [showDisclaimer, setShowDisclaimer] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkDisclaimer() {
      try {
        const accepted = await AsyncStorage.getItem(DISCLAIMER_KEY);
        setShowDisclaimer(accepted !== "true");
      } catch {
        setShowDisclaimer(true);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    checkDisclaimer();
  }, []);

  const handleAccept = useCallback(async () => {
    try {
      await AsyncStorage.setItem(DISCLAIMER_KEY, "true");
    } catch {
      // Non-fatal: user will see modal again next launch
    }
    setShowDisclaimer(false);
  }, []);

  // Keep splash screen up while checking storage
  if (showDisclaimer === null) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CaseLogProvider>
          <ChecklistProvider>
            <RootLayoutNav />
            {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}
          </ChecklistProvider>
        </CaseLogProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: "88%" as any,
    width: "100%",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  cardContent: {
    padding: 28,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "600" as const,
    marginBottom: 24,
  },
  bulletList: {
    width: "100%",
    marginBottom: 28,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 7,
    marginRight: 12,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  ctaButton: {
    width: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.textInverse,
    letterSpacing: -0.2,
  },
  footNote: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: "center",
  },
});
