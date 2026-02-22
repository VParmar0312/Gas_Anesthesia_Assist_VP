import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { crisisProtocols } from '@/mocks/crisisProtocols';

export default function ProtocolDetailScreen() {
  const { protocolId } = useLocalSearchParams<{ protocolId: string }>();
  const protocol = crisisProtocols.find(p => p.id === protocolId);

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [dantroleneWeight, setDantroleneWeight] = useState<number>(70);

  const toggleStep = useCallback((stepId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  }, []);

  const dantroleneDose = useMemo(() => {
    return {
      bolus: (2.5 * dantroleneWeight).toFixed(0),
      maxTotal: (10 * dantroleneWeight).toFixed(0),
      vials: Math.ceil((2.5 * dantroleneWeight) / 20),
    };
  }, [dantroleneWeight]);

  if (!protocol) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Protocol not found</Text>
      </View>
    );
  }

  const isMH = protocol.id === 'malignant-hyperthermia';

  return (
    <>
      <Stack.Screen
        options={{
          title: protocol.title,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerBanner, { borderColor: protocol.color }]}>
          <Text style={[styles.headerTitle, { color: protocol.color }]}>{protocol.title}</Text>
          <Text style={styles.headerSubtitle}>{protocol.subtitle}</Text>
        </View>

        {isMH && (
          <View style={styles.dantroleneCard}>
            <Text style={styles.dantroleneTitle}>Dantrolene Calculator</Text>
            <View style={styles.dantroleneRow}>
              <Text style={styles.dantroleneLabel}>Patient Weight</Text>
              <Text style={styles.dantroleneWeight}>{dantroleneWeight} kg</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={20}
              maximumValue={180}
              step={1}
              value={dantroleneWeight}
              onValueChange={setDantroleneWeight}
              minimumTrackTintColor={Colors.emergency}
              maximumTrackTintColor={Colors.border}
              thumbTintColor={Colors.emergency}
            />
            <View style={styles.dantroleneResults}>
              <View style={styles.dantroleneResult}>
                <Text style={styles.dantroleneResultLabel}>Bolus Dose</Text>
                <Text style={styles.dantroleneResultValue}>{dantroleneDose.bolus} mg</Text>
              </View>
              <View style={styles.dantroleneResult}>
                <Text style={styles.dantroleneResultLabel}>Max Total</Text>
                <Text style={styles.dantroleneResultValue}>{dantroleneDose.maxTotal} mg</Text>
              </View>
              <View style={styles.dantroleneResult}>
                <Text style={styles.dantroleneResultLabel}>Vials (20mg ea)</Text>
                <Text style={styles.dantroleneResultValue}>{dantroleneDose.vials}</Text>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.stepsHeader}>
          Steps ({completedSteps.size}/{protocol.steps.length})
        </Text>

        {protocol.steps.map((step) => {
          const isDone = completedSteps.has(step.id);
          return (
            <Pressable
              key={step.id}
              style={[
                styles.stepCard,
                step.isCritical && styles.stepCardCritical,
                isDone && styles.stepCardDone,
              ]}
              onPress={() => toggleStep(step.id)}
            >
              <View style={styles.stepLeft}>
                <View style={[
                  styles.stepNumber,
                  { backgroundColor: step.isCritical ? Colors.emergency : Colors.accent },
                  isDone && { opacity: 0.5 },
                ]}>
                  {isDone ? (
                    <CheckCircle2 size={18} color="#FFF" />
                  ) : (
                    <Text style={styles.stepNumberText}>{step.order}</Text>
                  )}
                </View>
              </View>
              <View style={styles.stepContent}>
                <Text style={[
                  styles.stepAction,
                  step.isCritical && styles.stepActionCritical,
                  isDone && styles.stepActionDone,
                ]}>
                  {step.action}
                </Text>
                {step.detail && (
                  <Text style={[styles.stepDetail, isDone && styles.stepDetailDone]}>
                    {step.detail}
                  </Text>
                )}
              </View>
              {step.isCritical && !isDone && (
                <AlertCircle size={18} color={Colors.emergency} style={styles.criticalIcon} />
              )}
            </Pressable>
          );
        })}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </>
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
  errorText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center' as const,
    marginTop: 40,
  },
  headerBanner: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  dantroleneCard: {
    backgroundColor: Colors.emergencyMuted,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.emergency,
  },
  dantroleneTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.emergency,
    marginBottom: 10,
  },
  dantroleneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dantroleneLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  dantroleneWeight: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  slider: {
    width: '100%',
    height: 36,
    marginBottom: 10,
  },
  dantroleneResults: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dantroleneResult: {
    flex: 1,
    alignItems: 'center',
  },
  dantroleneResultLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dantroleneResultValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.emergency,
  },
  stepsHeader: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepCardCritical: {
    borderColor: Colors.emergency + '44',
    backgroundColor: Colors.emergencyMuted,
  },
  stepCardDone: {
    opacity: 0.6,
  },
  stepLeft: {
    marginRight: 12,
    paddingTop: 2,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800' as const,
  },
  stepContent: {
    flex: 1,
  },
  stepAction: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  stepActionCritical: {
    color: Colors.emergency,
  },
  stepActionDone: {
    textDecorationLine: 'line-through' as const,
    color: Colors.textTertiary,
  },
  stepDetail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  stepDetailDone: {
    color: Colors.textTertiary,
  },
  criticalIcon: {
    marginLeft: 8,
    alignSelf: 'center' as const,
  },
  bottomSpacer: {
    height: 20,
  },
});
