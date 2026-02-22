import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

const STOP_BANG_QUESTIONS = [
  'Snoring: Do you snore loudly?',
  'Tired: Do you feel tired or sleepy during the daytime?',
  'Observed: Has anyone observed you stop breathing during sleep?',
  'Pressure: Do you have/are being treated for high blood pressure?',
  'BMI: BMI > 35?',
  'Age: Age > 50?',
  'Neck: Neck circumference > 40 cm?',
  'Gender: Male?',
];

function SegmentedControl({ options, selected, onChange, color }: {
  options: string[];
  selected: number;
  onChange: (idx: number) => void;
  color: string;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((opt, idx) => (
        <Pressable
          key={opt}
          style={[
            styles.segmentItem,
            idx === selected && { backgroundColor: color },
          ]}
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onChange(idx);
          }}
        >
          <Text style={[
            styles.segmentText,
            idx === selected && styles.segmentTextActive,
          ]}>
            {opt}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ToggleRow({ label, options, selected, onChange }: {
  label: string;
  options: string[];
  selected: number;
  onChange: (idx: number) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleOptions}>
        {options.map((opt, idx) => (
          <Pressable
            key={opt}
            style={[
              styles.toggleBtn,
              idx === selected && styles.toggleBtnActive,
            ]}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onChange(idx);
            }}
          >
            <Text style={[
              styles.toggleBtnText,
              idx === selected && styles.toggleBtnTextActive,
            ]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function AirwayAssessmentScreen() {
  const [mallampati, setMallampati] = useState<number>(0);
  const [thyromental, setThyromental] = useState<number>(0);
  const [mouthOpening, setMouthOpening] = useState<number>(0);
  const [neckMobility, setNeckMobility] = useState<number>(0);
  const [stopBang, setStopBang] = useState<boolean[]>(new Array(8).fill(false));

  const toggleStopBang = useCallback((idx: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setStopBang(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const stopBangScore = useMemo(() => stopBang.filter(Boolean).length, [stopBang]);

  const riskLevel = useMemo(() => {
    const difficultyFactors = [
      mallampati >= 2,
      thyromental === 1,
      mouthOpening === 1,
      neckMobility === 1,
    ].filter(Boolean).length;

    if (difficultyFactors >= 3) return { level: 'HIGH RISK', color: Colors.emergency };
    if (difficultyFactors >= 2) return { level: 'MODERATE', color: Colors.orange };
    return { level: 'LOW RISK', color: Colors.success };
  }, [mallampati, thyromental, mouthOpening, neckMobility]);

  const stopBangRisk = useMemo(() => {
    if (stopBangScore >= 5) return { level: 'High Risk OSA', color: Colors.emergency };
    if (stopBangScore >= 3) return { level: 'Intermediate Risk', color: Colors.orange };
    return { level: 'Low Risk', color: Colors.success };
  }, [stopBangScore]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.riskBanner, { borderColor: riskLevel.color }]}>
        {riskLevel.level === 'HIGH RISK' ? (
          <AlertCircle size={22} color={riskLevel.color} />
        ) : (
          <CheckCircle2 size={22} color={riskLevel.color} />
        )}
        <Text style={[styles.riskText, { color: riskLevel.color }]}>
          Airway: {riskLevel.level}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Mallampati Score</Text>
      <SegmentedControl
        options={['I', 'II', 'III', 'IV']}
        selected={mallampati}
        onChange={setMallampati}
        color={Colors.accent}
      />
      <Text style={styles.hintText}>
        {mallampati === 0 && 'Soft palate, fauces, uvula, pillars visible'}
        {mallampati === 1 && 'Soft palate, fauces, uvula visible'}
        {mallampati === 2 && 'Soft palate, base of uvula visible'}
        {mallampati === 3 && 'Hard palate only visible'}
      </Text>

      <Text style={styles.sectionTitle}>Physical Exam</Text>
      <View style={styles.examCard}>
        <ToggleRow
          label="Thyromental Distance"
          options={['Normal (>6cm)', 'Short (<6cm)']}
          selected={thyromental}
          onChange={setThyromental}
        />
        <View style={styles.rowDivider} />
        <ToggleRow
          label="Mouth Opening"
          options={['Adequate (>3cm)', 'Limited (<3cm)']}
          selected={mouthOpening}
          onChange={setMouthOpening}
        />
        <View style={styles.rowDivider} />
        <ToggleRow
          label="Neck Mobility"
          options={['Full ROM', 'Limited']}
          selected={neckMobility}
          onChange={setNeckMobility}
        />
      </View>

      <View style={styles.stopBangHeader}>
        <Text style={styles.sectionTitle}>STOP-BANG Questionnaire</Text>
        <View style={[styles.scoreBadge, { backgroundColor: stopBangRisk.color }]}>
          <Text style={styles.scoreBadgeText}>{stopBangScore}/8</Text>
        </View>
      </View>
      <Text style={[styles.hintText, { color: stopBangRisk.color, marginBottom: 12 }]}>
        {stopBangRisk.level}
      </Text>

      {STOP_BANG_QUESTIONS.map((q, idx) => (
        <Pressable
          key={idx}
          style={[styles.stopBangItem, stopBang[idx] && styles.stopBangItemActive]}
          onPress={() => toggleStopBang(idx)}
        >
          <View style={[styles.stopBangCheck, stopBang[idx] && styles.stopBangCheckActive]}>
            {stopBang[idx] && <Text style={styles.stopBangCheckMark}>Y</Text>}
          </View>
          <Text style={[styles.stopBangText, stopBang[idx] && styles.stopBangTextActive]}>
            {q}
          </Text>
        </Pressable>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  riskBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    gap: 10,
    borderWidth: 1.5,
  },
  riskText: {
    fontSize: 18,
    fontWeight: '800' as const,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 10,
    marginTop: 8,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.textInverse,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 6,
    marginBottom: 8,
  },
  examCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  toggleRow: {
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  toggleOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtnActive: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accent,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: Colors.accent,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 6,
  },
  stopBangHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreBadgeText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '800' as const,
  },
  stopBangItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stopBangItemActive: {
    backgroundColor: Colors.emergencyMuted,
    borderColor: Colors.emergency,
  },
  stopBangCheck: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopBangCheckActive: {
    backgroundColor: Colors.emergency,
    borderColor: Colors.emergency,
  },
  stopBangCheckMark: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800' as const,
  },
  stopBangText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500' as const,
  },
  stopBangTextActive: {
    color: Colors.emergency,
  },
  bottomSpacer: {
    height: 20,
  },
});
