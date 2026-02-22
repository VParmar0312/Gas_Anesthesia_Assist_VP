import React, { useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { RotateCcw, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useChecklist } from '@/contexts/ChecklistContext';
import ChecklistToggle from '@/components/ChecklistToggle';

export default function PreflightScreen() {
  const {
    msmaids,
    emergencyDrugs,
    toggleMSMAIDS,
    toggleEmergencyDrug,
    resetAll,
    msmaidsDone,
    emergencyDrugsDone,
    allComplete,
  } = useChecklist();

  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (allComplete) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      successAnim.setValue(0);
    }
  }, [allComplete, successAnim]);

  const handleReset = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    resetAll();
  }, [resetAll]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {allComplete && (
        <Animated.View
          style={[
            styles.successBanner,
            {
              opacity: successAnim,
              transform: [{ scale: successAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
            },
          ]}
        >
          <CheckCircle size={28} color={Colors.success} />
          <Text style={styles.successText}>Room Ready</Text>
        </Animated.View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MSMAIDS Checklist</Text>
        <View style={styles.sectionBadge}>
          <Text style={[styles.sectionBadgeText, msmaidsDone && { color: Colors.success }]}>
            {msmaids.filter(i => i.completed).length}/{msmaids.length}
          </Text>
        </View>
      </View>
      <Text style={styles.sectionDesc}>Machine, Suction, Monitors, Airway, IV, Drugs, Special</Text>

      {msmaids.map((item) => (
        <ChecklistToggle
          key={item.id}
          label={item.label}
          description={item.description}
          completed={item.completed}
          onToggle={() => toggleMSMAIDS(item.id)}
        />
      ))}

      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Emergency Drug Prep</Text>
        <View style={styles.sectionBadge}>
          <Text style={[styles.sectionBadgeText, emergencyDrugsDone && { color: Colors.success }]}>
            {emergencyDrugs.filter(i => i.completed).length}/{emergencyDrugs.length}
          </Text>
        </View>
      </View>
      <Text style={styles.sectionDesc}>Confirm rescue drugs drawn, labeled, and ready</Text>

      {emergencyDrugs.map((item) => (
        <ChecklistToggle
          key={item.id}
          label={item.label}
          description={item.description}
          completed={item.completed}
          onToggle={() => toggleEmergencyDrug(item.id)}
        />
      ))}

      <Pressable style={styles.resetButton} onPress={handleReset}>
        <RotateCcw size={18} color={Colors.textSecondary} />
        <Text style={styles.resetText}>Reset All Checklists</Text>
      </Pressable>

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
    paddingTop: 16,
    paddingBottom: 40,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.successMuted,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  successText: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  sectionBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionBadgeText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700' as const,
  },
  sectionDesc: {
    color: Colors.textTertiary,
    fontSize: 13,
    marginBottom: 14,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 24,
    gap: 8,
  },
  resetText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  bottomSpacer: {
    height: 20,
  },
});
