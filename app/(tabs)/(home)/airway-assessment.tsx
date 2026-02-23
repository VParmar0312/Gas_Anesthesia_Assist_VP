import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

const STOP_BANG_QUESTIONS = [
  { label: 'S – Snoring', detail: 'Do you snore loudly (louder than talking or heard through closed doors)?' },
  { label: 'T – Tired', detail: 'Do you feel tired, fatigued, or sleepy during the daytime?' },
  { label: 'O – Observed', detail: 'Has anyone observed you stop breathing during sleep?' },
  { label: 'P – Pressure', detail: 'Do you have or are being treated for high blood pressure?' },
  { label: 'B – BMI', detail: 'BMI > 35 kg/m²?' },
  { label: 'A – Age', detail: 'Age > 50 years?' },
  { label: 'N – Neck', detail: 'Neck circumference > 40 cm?' },
  { label: 'G – Gender', detail: 'Male gender?' },
];

const MALLAMPATI_DESCRIPTIONS = [
  { grade: 'Class I', detail: 'Soft palate, fauces, entire uvula, and tonsillar pillars visible', risk: 'Lowest difficulty', color: Colors.success },
  { grade: 'Class II', detail: 'Soft palate, fauces, and upper portion of uvula visible', risk: 'Low difficulty', color: Colors.accent },
  { grade: 'Class III', detail: 'Soft palate and base of uvula visible only', risk: 'Moderate difficulty', color: Colors.orange },
  { grade: 'Class IV', detail: 'Only hard palate visible — soft palate not visible at all', risk: 'High difficulty', color: Colors.emergency },
];

const LEMON_CRITERIA = [
  {
    label: 'L – Look externally',
    detail: 'Facial trauma, beard, obesity, large tongue, buck teeth, short/thick neck, receding chin',
    key: 'lemon_look',
  },
  {
    label: 'E – Evaluate 3-3-2',
    detail: 'Mouth opening < 3 finger-breadths, chin-to-hyoid < 3 fingers, hyoid-to-thyroid notch < 2 fingers',
    key: 'lemon_332',
  },
  {
    label: 'M – Mallampati ≥ III',
    detail: 'Mallampati class III or IV from assessment above',
    key: 'lemon_mp',
  },
  {
    label: 'O – Obstruction',
    detail: 'Epiglottitis, peritonsillar abscess, trauma, tumor, foreign body, Ludwig\'s angina',
    key: 'lemon_obs',
  },
  {
    label: 'N – Neck mobility',
    detail: 'Limited neck extension (cervical spondylosis, halo collar, rheumatoid arthritis, ankylosing spondylitis)',
    key: 'lemon_neck',
  },
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
          style={[styles.segmentItem, idx === selected && { backgroundColor: color }]}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(idx);
          }}
        >
          <Text style={[styles.segmentText, idx === selected && styles.segmentTextActive]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ToggleRow({ label, options, selected, onChange, abnormalIndex = 1 }: {
  label: string;
  options: string[];
  selected: number;
  onChange: (idx: number) => void;
  abnormalIndex?: number;
}) {
  const isAbnormal = selected === abnormalIndex;
  return (
    <View style={styles.toggleRow}>
      <Text style={[styles.toggleLabel, isAbnormal && { color: Colors.orange }]}>{label}</Text>
      <View style={styles.toggleOptions}>
        {options.map((opt, idx) => {
          const isAbnormalOption = idx === abnormalIndex;
          return (
            <Pressable
              key={opt}
              style={[
                styles.toggleBtn,
                idx === selected && (isAbnormalOption ? styles.toggleBtnAbnormal : styles.toggleBtnActive),
              ]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onChange(idx);
              }}
            >
              <Text style={[
                styles.toggleBtnText,
                idx === selected && (isAbnormalOption ? styles.toggleBtnTextAbnormal : styles.toggleBtnTextActive),
              ]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AirwayAssessmentScreen() {
  const [mallampati, setMallampati] = useState<number>(0);
  const [thyromental, setThyromental] = useState<number>(0);
  const [mouthOpening, setMouthOpening] = useState<number>(0);
  const [neckMobility, setNeckMobility] = useState<number>(0);
  const [interincisor, setInterincisor] = useState<number>(0);
  const [stopBang, setStopBang] = useState<boolean[]>(new Array(8).fill(false));
  const [lemon, setLemon] = useState<boolean[]>(new Array(5).fill(false));
  const [activeSection, setActiveSection] = useState<'airway' | 'lemon' | 'osa'>('airway');

  const toggleStopBang = useCallback((idx: number) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStopBang(prev => { const next = [...prev]; next[idx] = !next[idx]; return next; });
  }, []);

  const toggleLemon = useCallback((idx: number) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLemon(prev => { const next = [...prev]; next[idx] = !next[idx]; return next; });
  }, []);

  const stopBangScore = useMemo(() => stopBang.filter(Boolean).length, [stopBang]);
  const lemonScore = useMemo(() => lemon.filter(Boolean).length, [lemon]);

  const difficultyFactors = useMemo(() => [
    mallampati >= 2,
    thyromental === 1,
    mouthOpening === 1,
    neckMobility === 1,
    interincisor === 1,
  ].filter(Boolean).length, [mallampati, thyromental, mouthOpening, neckMobility, interincisor]);

  const riskLevel = useMemo(() => {
    const totalFactors = difficultyFactors + lemonScore;
    if (difficultyFactors >= 3 || lemonScore >= 3 || mallampati === 3) {
      return { level: 'HIGH RISK', color: Colors.emergency, numericScore: totalFactors };
    }
    if (difficultyFactors >= 2 || lemonScore >= 2 || mallampati === 2) {
      return { level: 'MODERATE', color: Colors.orange, numericScore: totalFactors };
    }
    return { level: 'LOW RISK', color: Colors.success, numericScore: totalFactors };
  }, [difficultyFactors, lemonScore, mallampati]);

  const backupPlan = useMemo(() => {
    if (riskLevel.level === 'HIGH RISK') {
      return {
        title: 'Recommended Preparation',
        items: [
          'Video laryngoscope available and preferred as first attempt',
          'Supraglottic airway (LMA) immediately available',
          'Awake fiber-optic intubation (FOI) if multiple high-risk features',
          'Surgical airway (cricothyrotomy) kit opened and on field',
          'Senior/attending anesthesiologist at bedside',
          'Notify surgeon of difficult airway plan',
        ],
      };
    }
    if (riskLevel.level === 'MODERATE') {
      return {
        title: 'Recommended Preparation',
        items: [
          'Video laryngoscope in room and ready',
          'Bougie available on intubation tray',
          'Supraglottic airway (LMA) backup at bedside',
          'Communicate plan to OR team',
        ],
      };
    }
    return {
      title: 'Standard Preparation',
      items: [
        'Standard intubation tray with bougie',
        'Video laryngoscope available if desired',
        'Proceed with routine airway management',
      ],
    };
  }, [riskLevel]);

  const stopBangRisk = useMemo(() => {
    if (stopBangScore >= 5) return { level: 'High Risk OSA', color: Colors.emergency, implication: 'Discuss CPAP, avoid deep sedation, extended PACU monitoring. Optimize sleep apnea pre-op if elective.' };
    if (stopBangScore >= 3) return { level: 'Intermediate Risk', color: Colors.orange, implication: 'Judicious sedation. Avoid benzodiazepines in elderly. Have reversal agents ready.' };
    return { level: 'Low Risk', color: Colors.success, implication: 'Standard monitoring. Routine PACU care.' };
  }, [stopBangScore]);

  const tabs = [
    { key: 'airway' as const, label: 'Airway Exam' },
    { key: 'lemon' as const, label: 'LEMON Score' },
    { key: 'osa' as const, label: 'STOP-BANG' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Overall Risk Banner */}
      <View style={[styles.riskBanner, { borderColor: riskLevel.color }]}>
        {riskLevel.level === 'HIGH RISK'
          ? <AlertCircle size={22} color={riskLevel.color} />
          : riskLevel.level === 'MODERATE'
            ? <AlertTriangle size={22} color={riskLevel.color} />
            : <CheckCircle2 size={22} color={riskLevel.color} />}
        <View style={{ flex: 1 }}>
          <Text style={[styles.riskText, { color: riskLevel.color }]}>Airway: {riskLevel.level}</Text>
          <Text style={styles.riskSubtext}>
            {difficultyFactors} exam factor{difficultyFactors !== 1 ? 's' : ''} · LEMON {lemonScore}/5 · STOP-BANG {stopBangScore}/8
          </Text>
        </View>
      </View>

      {/* Section Tabs */}
      <View style={styles.sectionTabRow}>
        {tabs.map(t => (
          <Pressable
            key={t.key}
            style={[styles.sectionTab, activeSection === t.key && styles.sectionTabActive]}
            onPress={() => setActiveSection(t.key)}
          >
            <Text style={[styles.sectionTabText, activeSection === t.key && styles.sectionTabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* ─── Airway Exam ───────────────────────────────────────── */}
      {activeSection === 'airway' && (
        <>
          <Text style={styles.sectionTitle}>Mallampati Score</Text>
          <SegmentedControl options={['I', 'II', 'III', 'IV']} selected={mallampati} onChange={setMallampati} color={MALLAMPATI_DESCRIPTIONS[mallampati].color} />
          <View style={[styles.mpDescCard, { borderColor: MALLAMPATI_DESCRIPTIONS[mallampati].color }]}>
            <Text style={[styles.mpGrade, { color: MALLAMPATI_DESCRIPTIONS[mallampati].color }]}>
              {MALLAMPATI_DESCRIPTIONS[mallampati].grade}
            </Text>
            <Text style={styles.mpDetail}>{MALLAMPATI_DESCRIPTIONS[mallampati].detail}</Text>
            <Text style={[styles.mpRisk, { color: MALLAMPATI_DESCRIPTIONS[mallampati].color }]}>
              {MALLAMPATI_DESCRIPTIONS[mallampati].risk}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Physical Examination</Text>
          <View style={styles.examCard}>
            <ToggleRow label="Thyromental distance" options={['Normal (>6 cm)', 'Short (<6 cm)']} selected={thyromental} onChange={setThyromental} />
            <View style={styles.rowDivider} />
            <ToggleRow label="Mouth opening (interincisor)" options={['Adequate (>3 cm)', 'Limited (<3 cm)']} selected={mouthOpening} onChange={setMouthOpening} />
            <View style={styles.rowDivider} />
            <ToggleRow label="Neck mobility / extension" options={['Full ROM', 'Limited']} selected={neckMobility} onChange={setNeckMobility} />
            <View style={styles.rowDivider} />
            <ToggleRow label="Upper lip bite test / prognathism" options={['Class I/II (can bite lip)', 'Class III (cannot)']} selected={interincisor} onChange={setInterincisor} />
          </View>

          {/* Backup Plan */}
          <View style={[styles.backupCard, { borderColor: riskLevel.color }]}>
            <View style={styles.backupHeader}>
              <ShieldAlert size={16} color={riskLevel.color} />
              <Text style={[styles.backupTitle, { color: riskLevel.color }]}>{backupPlan.title}</Text>
            </View>
            {backupPlan.items.map((item, idx) => (
              <View key={idx} style={styles.backupItem}>
                <Text style={[styles.backupBullet, { color: riskLevel.color }]}>•</Text>
                <Text style={styles.backupText}>{item}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ─── LEMON Score ───────────────────────────────────────── */}
      {activeSection === 'lemon' && (
        <>
          <View style={styles.scoreHeaderRow}>
            <Text style={styles.sectionTitle}>LEMON Airway Assessment</Text>
            <View style={[styles.scoreBadge, { backgroundColor: lemonScore >= 3 ? Colors.emergency : lemonScore >= 2 ? Colors.orange : Colors.success }]}>
              <Text style={styles.scoreBadgeText}>{lemonScore}/5</Text>
            </View>
          </View>
          <Text style={styles.lemonSubtitle}>
            {lemonScore >= 3 ? 'HIGH probability of difficult laryngoscopy'
              : lemonScore >= 2 ? 'MODERATE probability of difficulty'
              : 'Low probability — proceed routinely'}
          </Text>
          {LEMON_CRITERIA.map((item, idx) => (
            <Pressable
              key={item.key}
              style={[styles.lemonItem, lemon[idx] && styles.lemonItemActive]}
              onPress={() => toggleLemon(idx)}
            >
              <View style={[styles.lemonCheck, lemon[idx] && styles.lemonCheckActive]}>
                {lemon[idx] && <Text style={styles.lemonCheckMark}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.lemonLabel, lemon[idx] && styles.lemonLabelActive]}>{item.label}</Text>
                <Text style={styles.lemonDetail}>{item.detail}</Text>
              </View>
            </Pressable>
          ))}
          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>LEMON Tool</Text>
            <Text style={styles.formulaText}>Score ≥ 2 = anticipate difficult laryngoscopy</Text>
            <Text style={styles.formulaText}>Originally validated in Emergency Medicine</Text>
            <Text style={styles.formulaText}>Sensitivity ~85%, Specificity ~65%</Text>
          </View>
        </>
      )}

      {/* ─── STOP-BANG ─────────────────────────────────────────── */}
      {activeSection === 'osa' && (
        <>
          <View style={styles.scoreHeaderRow}>
            <View style={styles.stopBangHeader}>
              <Text style={styles.sectionTitle}>STOP-BANG Questionnaire</Text>
            </View>
            <View style={[styles.scoreBadge, { backgroundColor: stopBangRisk.color }]}>
              <Text style={styles.scoreBadgeText}>{stopBangScore}/8</Text>
            </View>
          </View>
          <Text style={[styles.lemonSubtitle, { color: stopBangRisk.color }]}>{stopBangRisk.level}</Text>

          {STOP_BANG_QUESTIONS.map((q, idx) => (
            <Pressable
              key={idx}
              style={[styles.stopBangItem, stopBang[idx] && styles.stopBangItemActive]}
              onPress={() => toggleStopBang(idx)}
            >
              <View style={[styles.stopBangCheck, stopBang[idx] && styles.stopBangCheckActive]}>
                {stopBang[idx] && <Text style={styles.stopBangCheckMark}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stopBangLabel, stopBang[idx] && styles.stopBangLabelActive]}>{q.label}</Text>
                <Text style={styles.stopBangDetail}>{q.detail}</Text>
              </View>
            </Pressable>
          ))}

          <View style={[styles.backupCard, { borderColor: stopBangRisk.color, marginTop: 12 }]}>
            <View style={styles.backupHeader}>
              <AlertTriangle size={16} color={stopBangRisk.color} />
              <Text style={[styles.backupTitle, { color: stopBangRisk.color }]}>Clinical Implication</Text>
            </View>
            <Text style={styles.backupText}>{stopBangRisk.implication}</Text>
          </View>

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>STOP-BANG Risk Thresholds</Text>
            <Text style={styles.formulaText}>0–2: Low risk OSA (~10%)</Text>
            <Text style={styles.formulaText}>3–4: Intermediate risk (~30%)</Text>
            <Text style={styles.formulaText}>5–8: High risk OSA (~60–90%)</Text>
            <Text style={styles.formulaText}>Score ≥5 = 70% sensitive for severe OSA</Text>
          </View>
        </>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  riskBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1.5,
  },
  riskText: { fontSize: 18, fontWeight: '800' as const },
  riskSubtext: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  sectionTabRow: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  sectionTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTabActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  sectionTabText: { fontSize: 12, fontWeight: '700' as const, color: Colors.textSecondary },
  sectionTabTextActive: { color: Colors.accent },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.textPrimary, marginBottom: 10, marginTop: 4 },
  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentItem: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  segmentText: { fontSize: 16, fontWeight: '700' as const, color: Colors.textSecondary },
  segmentTextActive: { color: Colors.textInverse },
  mpDescCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    marginTop: 10,
    marginBottom: 16,
  },
  mpGrade: { fontSize: 16, fontWeight: '800' as const },
  mpDetail: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  mpRisk: { fontSize: 12, fontWeight: '700' as const, marginTop: 6, textTransform: 'uppercase' },
  examCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  toggleRow: { paddingVertical: 8 },
  toggleLabel: { fontSize: 14, fontWeight: '600' as const, color: Colors.textPrimary, marginBottom: 8 },
  toggleOptions: { flexDirection: 'row', gap: 8 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtnActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  toggleBtnAbnormal: { backgroundColor: Colors.orangeMuted, borderColor: Colors.orange },
  toggleBtnText: { fontSize: 11, fontWeight: '600' as const, color: Colors.textSecondary, textAlign: 'center' as const },
  toggleBtnTextActive: { color: Colors.accent },
  toggleBtnTextAbnormal: { color: Colors.orange },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  backupCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    marginTop: 4,
    marginBottom: 10,
  },
  backupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  backupTitle: { fontSize: 13, fontWeight: '700' as const, textTransform: 'uppercase', letterSpacing: 0.4 },
  backupItem: { flexDirection: 'row', gap: 8, marginBottom: 6, alignItems: 'flex-start' },
  backupBullet: { fontSize: 14, fontWeight: '700' as const, marginTop: 1 },
  backupText: { fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
  scoreHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  stopBangHeader: { flex: 1 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  scoreBadgeText: { color: Colors.textInverse, fontSize: 14, fontWeight: '800' as const },
  lemonSubtitle: { fontSize: 13, color: Colors.textTertiary, marginBottom: 14, lineHeight: 18 },
  lemonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lemonItemActive: { backgroundColor: Colors.orangeMuted, borderColor: Colors.orange },
  lemonCheck: {
    width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: Colors.border,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  lemonCheckActive: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  lemonCheckMark: { color: Colors.textInverse, fontSize: 13, fontWeight: '800' as const },
  lemonLabel: { fontSize: 14, fontWeight: '700' as const, color: Colors.textPrimary, marginBottom: 2 },
  lemonLabelActive: { color: Colors.orange },
  lemonDetail: { fontSize: 12, color: Colors.textTertiary, lineHeight: 16 },
  stopBangItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stopBangItemActive: { backgroundColor: Colors.emergencyMuted, borderColor: Colors.emergency },
  stopBangCheck: {
    width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: Colors.textTertiary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stopBangCheckActive: { backgroundColor: Colors.emergency, borderColor: Colors.emergency },
  stopBangCheckMark: { color: Colors.textPrimary, fontSize: 13, fontWeight: '800' as const },
  stopBangLabel: { fontSize: 14, fontWeight: '700' as const, color: Colors.textPrimary, marginBottom: 2 },
  stopBangLabelActive: { color: Colors.emergency },
  stopBangDetail: { fontSize: 12, color: Colors.textTertiary, lineHeight: 16 },
  formulaCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
    marginBottom: 10,
  },
  formulaTitle: { fontSize: 12, fontWeight: '700' as const, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  formulaText: { fontSize: 12, color: Colors.textTertiary, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginBottom: 3 },
  bottomSpacer: { height: 20 },
});
