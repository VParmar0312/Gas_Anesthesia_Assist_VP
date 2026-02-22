import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ClipboardCheck,
  Baby,
  Stethoscope,
  Activity,
  TrendingUp,
  Shield,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useCaseLogs } from '@/contexts/CaseLogContext';
import ProgressRing from '@/components/ProgressRing';

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onPress: () => void;
  badge?: string;
}

function QuickAction({ title, subtitle, icon, color, bgColor, onPress, badge }: QuickActionProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [onPress]);

  return (
    <Animated.View style={[styles.actionCard, { transform: [{ scale }] }]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.actionCardInner}
      >
        <View style={[styles.actionIcon, { backgroundColor: bgColor }]}>
          {icon}
        </View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
        {badge && (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { msmaidsPct, emergencyPct, allComplete } = useChecklist();
  const { totalCases, requirements } = useCaseLogs();

  const overallChecklistPct = (msmaidsPct + emergencyPct) / 2;
  const totalRequired = requirements.reduce((sum, r) => sum + r.minimum, 0);
  const totalCompleted = requirements.reduce((sum, r) => sum + r.completed, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Anesthesia</Text>
        <Text style={styles.subGreeting}>Clinical Companion</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusCard}>
          <ProgressRing
            progress={overallChecklistPct}
            size={68}
            strokeWidth={5}
            color={allComplete ? Colors.success : Colors.accent}
            label={`${Math.round(overallChecklistPct * 100)}%`}
          />
          <Text style={styles.statusLabel}>Room Setup</Text>
        </View>
        <View style={styles.statusCard}>
          <View style={styles.statNumber}>
            <Text style={styles.statValue}>{totalCases}</Text>
          </View>
          <Text style={styles.statusLabel}>Cases Logged</Text>
        </View>
        <View style={styles.statusCard}>
          <ProgressRing
            progress={totalRequired > 0 ? totalCompleted / totalRequired : 0}
            size={68}
            strokeWidth={5}
            color={Colors.blue}
            label={`${totalCompleted}`}
            sublabel={`/${totalRequired}`}
          />
          <Text style={styles.statusLabel}>ACGME</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionsGrid}>
        <QuickAction
          title="Pre-Flight"
          subtitle="MSMAIDS + Drugs"
          icon={<ClipboardCheck size={24} color={Colors.accent} />}
          color={Colors.accent}
          bgColor={Colors.accentMuted}
          onPress={() => router.push('/preflight' as any)}
          badge={allComplete ? 'READY' : undefined}
        />
        <QuickAction
          title="Peds Setup"
          subtitle="ETT, Blades, Circuit"
          icon={<Baby size={24} color={Colors.blue} />}
          color={Colors.blue}
          bgColor={Colors.blueMuted}
          onPress={() => router.push('/pediatric-setup' as any)}
        />
        <QuickAction
          title="Airway"
          subtitle="Assessment Tools"
          icon={<Stethoscope size={24} color={Colors.orange} />}
          color={Colors.orange}
          bgColor={Colors.orangeMuted}
          onPress={() => router.push('/airway-assessment' as any)}
        />
        <QuickAction
          title="Vitals Calc"
          subtitle="Hemodynamics"
          icon={<Activity size={24} color={Colors.purple} />}
          color={Colors.purple}
          bgColor={Colors.purpleMuted}
          onPress={() => router.push('/(calculators)' as any)}
        />
        <QuickAction
          title="Log Case"
          subtitle="Quick Entry"
          icon={<TrendingUp size={24} color={Colors.warning} />}
          color={Colors.warning}
          bgColor={Colors.warningMuted}
          onPress={() => router.push('/new-case' as any)}
        />
        <QuickAction
          title="Crisis"
          subtitle="Emergency Protocols"
          icon={<Shield size={24} color={Colors.emergency} />}
          color={Colors.emergency}
          bgColor={Colors.emergencyMuted}
          onPress={() => router.push('/(crisis)' as any)}
        />
      </View>

      <Text style={styles.sectionTitle}>ACGME Progress</Text>
      <View style={styles.progressList}>
        {requirements.slice(0, 6).map((req) => {
          const pct = req.minimum > 0 ? Math.min(req.completed / req.minimum, 1) : 0;
          return (
            <View key={req.id} style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{req.subcategory}</Text>
                <Text style={[styles.progressCount, { color: req.color }]}>
                  {req.completed}/{req.minimum}
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${pct * 100}%`, backgroundColor: req.color },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

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
    paddingBottom: 30,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
    marginTop: 8,
  },
  statNumber: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.accent,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionCard: {
    width: '48%',
    marginBottom: 12,
  },
  actionCardInner: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 120,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '700' as const,
  },
  progressList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  progressCount: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  bottomSpacer: {
    height: 20,
  },
});
