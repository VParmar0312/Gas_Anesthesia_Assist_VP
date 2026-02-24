import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Flame, ShieldAlert, Wind, Droplets, AlertTriangle, Syringe, Phone, Zap, HeartPulse } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { crisisProtocols } from '@/mocks/crisisProtocols';

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Flame,
  Syringe,
  ShieldAlert,
  Wind,
  Droplets,
  AlertTriangle,
  Zap,
  HeartPulse,
};

function CrisisCard({ id, title, subtitle, color, icon, onPress }: {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const IconComponent = iconMap[icon] || AlertTriangle;

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, { toValue: 0.96, duration: 60, useNativeDriver: true }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={[styles.crisisCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={`crisis-card-${id}`}
      >
        <View style={[styles.crisisIcon, { backgroundColor: color + '22' }]}>
          <IconComponent size={28} color={color} />
        </View>
        <View style={styles.crisisContent}>
          <Text style={styles.crisisTitle}>{title}</Text>
          <Text style={styles.crisisSubtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.goBtn, { backgroundColor: color + '22' }]}>
          <Text style={[styles.goBtnText, { color }]}>GO</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function CrisisScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.warningBanner}>
        <AlertTriangle size={20} color={Colors.warning} />
        <Text style={styles.warningText}>
          One-tap access to OR emergency protocols
        </Text>
      </View>

      <View style={styles.hotlineCard}>
        <Phone size={18} color={Colors.emergency} />
        <View style={styles.hotlineContent}>
          <Text style={styles.hotlineTitle}>MH Hotline</Text>
          <Text style={styles.hotlineNumber}>1-800-644-9737</Text>
        </View>
      </View>

      {crisisProtocols.map((protocol) => (
        <CrisisCard
          key={protocol.id}
          id={protocol.id}
          title={protocol.title}
          subtitle={protocol.subtitle}
          color={protocol.color}
          icon={protocol.icon}
          onPress={() => router.push(`/${protocol.id}` as any)}
        />
      ))}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.warningMuted,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warning,
  },
  hotlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.emergencyMuted,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.emergency,
  },
  hotlineContent: {
    flex: 1,
  },
  hotlineTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  hotlineNumber: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.emergency,
    letterSpacing: 1,
  },
  crisisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  crisisIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  crisisContent: {
    flex: 1,
  },
  crisisTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  crisisSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  goBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  goBtnText: {
    fontSize: 14,
    fontWeight: '800' as const,
  },
  bottomSpacer: {
    height: 20,
  },
});
