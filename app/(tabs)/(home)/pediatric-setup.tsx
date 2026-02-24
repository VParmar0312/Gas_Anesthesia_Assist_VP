import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

function ResultCard({ label, value, unit, color, wide }: { label: string; value: string; unit?: string; color: string; wide?: boolean }) {
  return (
    <View style={[styles.resultCard, wide && styles.resultCardWide]}>
      <Text style={styles.resultLabel}>{label}</Text>
      <View style={styles.resultValueRow}>
        <Text style={[styles.resultValue, { color }]}>{value}</Text>
        {unit && <Text style={styles.resultUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, color ? { color } : undefined]}>{value}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const VITAL_SIGNS: { ageLabel: string; minAge: number; maxAge: number; hr: string; rr: string; sbp: string; dbp: string }[] = [
  { ageLabel: 'Neonate (0–28d)', minAge: 0, maxAge: 0.08, hr: '100–160', rr: '30–60', sbp: '60–90', dbp: '30–60' },
  { ageLabel: 'Infant (1–12 mo)', minAge: 0.08, maxAge: 1, hr: '100–160', rr: '25–50', sbp: '70–100', dbp: '50–65' },
  { ageLabel: 'Toddler (1–2 yr)', minAge: 1, maxAge: 3, hr: '90–150', rr: '20–30', sbp: '80–110', dbp: '50–80' },
  { ageLabel: 'Preschool (3–5 yr)', minAge: 3, maxAge: 6, hr: '80–120', rr: '20–25', sbp: '80–115', dbp: '55–78' },
  { ageLabel: 'School age (6–12 yr)', minAge: 6, maxAge: 13, hr: '70–110', rr: '18–22', sbp: '90–120', dbp: '60–80' },
  { ageLabel: 'Adolescent (>12 yr)', minAge: 13, maxAge: 99, hr: '60–100', rr: '12–18', sbp: '100–135', dbp: '60–85' },
];

export default function PediatricSetupScreen() {
  const [age, setAge] = useState<number>(5);
  const [weight, setWeight] = useState<number>(20);
  const [activeSection, setActiveSection] = useState<'airway' | 'drugs' | 'vitals'>('airway');

  const calculations = useMemo(() => {
    // Airway
    const ettUncuffed = (age / 4) + 4;
    const ettCuffed = (age / 4) + 3.5;
    const ettDepth = (age / 2) + 12;

    let bladeRec = '';
    if (age < 1) bladeRec = 'Miller 0 or 1';
    else if (age < 3) bladeRec = 'Miller 1';
    else if (age < 8) bladeRec = 'Miller 2 or Macintosh 2';
    else bladeRec = 'Macintosh 3';

    let circuitType = '';
    if (weight < 10) circuitType = 'Mapleson D / Jackson-Rees';
    else if (weight < 20) circuitType = 'Mapleson D or Circle';
    else circuitType = 'Adult Circle System';

    let lmaSize = '';
    if (weight < 5) lmaSize = '1';
    else if (weight < 10) lmaSize = '1.5';
    else if (weight < 20) lmaSize = '2';
    else if (weight < 30) lmaSize = '2.5';
    else if (weight < 50) lmaSize = '3';
    else lmaSize = '4';

    const maintenanceFluid = weight <= 10 ? weight * 4 : weight <= 20 ? 40 + (weight - 10) * 2 : 60 + (weight - 20) * 1;

    // APLS estimated weight
    const aplsWeight = age < 1 ? (age * 12 * 0.5 + 4) : Math.round(3 * age + 7);

    // Drug doses
    const atropine = Math.max(0.02 * weight, 0.1);  // min 0.1 mg
    const atropineMax = Math.min(atropine, 0.5);
    const succinylcholine = weight < 2 ? weight * 2 : weight * 1.5;
    const propofol = weight * 2.5;
    const ketamine = weight * 2;
    const fentanyl = weight * 2;
    const rocuronium = weight * 0.6;
    const morphine = weight * 0.1;

    // CPR / Resus
    const defibInitial = weight * 2;
    const defibSubsequent = weight * 4;
    const fluidBolus10 = weight * 10;
    const fluidBolus20 = weight * 20;
    const epiACLS = weight * 0.01;

    return {
      ettUncuffed: ettUncuffed.toFixed(1),
      ettCuffed: ettCuffed.toFixed(1),
      ettDepth: ettDepth.toFixed(1),
      bladeRec,
      circuitType,
      lmaSize,
      maintenanceFluid,
      aplsWeight: aplsWeight.toFixed(0),
      atropine: atropine.toFixed(2),
      atropineMax: atropineMax.toFixed(2),
      succinylcholine: succinylcholine.toFixed(0),
      propofol: propofol.toFixed(0),
      ketamine: ketamine.toFixed(0),
      fentanyl: fentanyl.toFixed(0),
      rocuronium: rocuronium.toFixed(1),
      morphine: morphine.toFixed(1),
      defibInitial: defibInitial.toFixed(0),
      defibSubsequent: defibSubsequent.toFixed(0),
      fluidBolus10: fluidBolus10.toFixed(0),
      fluidBolus20: fluidBolus20.toFixed(0),
      epiACLS: epiACLS.toFixed(2),
    };
  }, [age, weight]);

  const vitalSigns = useMemo(() => {
    return VITAL_SIGNS.find(v => age >= v.minAge && age < v.maxAge) ?? VITAL_SIGNS[VITAL_SIGNS.length - 1];
  }, [age]);

  const sectionTabs = [
    { key: 'airway' as const, label: 'Airway' },
    { key: 'drugs' as const, label: 'Drug Doses' },
    { key: 'vitals' as const, label: 'Vitals' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Inputs */}
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Age</Text>
          <Text style={styles.inputValue}>{age === 0 ? 'Neonate' : `${age} yr`}</Text>
        </View>
        <Slider style={styles.slider} minimumValue={0} maximumValue={16} step={1} value={age}
          onValueChange={(v) => setAge(Math.round(v))}
          minimumTrackTintColor={Colors.accent} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.accent} />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Weight</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
            <Text style={styles.aplsHint}>APLS est. ≈ {calculations.aplsWeight} kg</Text>
          </View>
        </View>
        <Slider style={styles.slider} minimumValue={1} maximumValue={80} step={0.5} value={weight}
          onValueChange={(v) => setWeight(Math.round(v * 2) / 2)}
          minimumTrackTintColor={Colors.blue} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.blue} />
      </View>

      {/* Section Tabs */}
      <View style={styles.sectionTabRow}>
        {sectionTabs.map(t => (
          <Pressable
            key={t.key}
            style={[styles.sectionTab, activeSection === t.key && styles.sectionTabActive]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveSection(t.key);
            }}
          >
            <Text style={[styles.sectionTabText, activeSection === t.key && styles.sectionTabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* ── Airway ── */}
      {activeSection === 'airway' && (
        <>
          <SectionHeader title="ETT & Airway Sizing" />
          <View style={styles.resultsGrid}>
            <ResultCard label="ETT Uncuffed" value={calculations.ettUncuffed} unit="mm" color={Colors.accent} />
            <ResultCard label="ETT Cuffed" value={calculations.ettCuffed} unit="mm" color={Colors.accent} />
            <ResultCard label="ETT Depth" value={calculations.ettDepth} unit="cm" color={Colors.blue} />
            <ResultCard label="LMA Size" value={calculations.lmaSize} color={Colors.blue} />
          </View>

          <View style={styles.infoCard}>
            <InfoRow label="Laryngoscope blade" value={calculations.bladeRec} color={Colors.orange} />
            <View style={styles.infoDivider} />
            <InfoRow label="Circuit" value={calculations.circuitType} color={Colors.accent} />
            <View style={styles.infoDivider} />
            <InfoRow label="Maintenance fluids" value={`${calculations.maintenanceFluid} mL/hr`} color={Colors.blue} />
          </View>

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>Formulas</Text>
            <Text style={styles.formulaText}>ETT Uncuffed = (Age/4) + 4</Text>
            <Text style={styles.formulaText}>ETT Cuffed   = (Age/4) + 3.5</Text>
            <Text style={styles.formulaText}>ETT Depth    = (Age/2) + 12</Text>
            <Text style={styles.formulaText}>Weight (APLS) = 3×Age + 7 (1–12yr)</Text>
          </View>
        </>
      )}

      {/* ── Drug Doses ── */}
      {activeSection === 'drugs' && (
        <>
          <SectionHeader title="Induction & Airway" />
          <View style={styles.infoCard}>
            <InfoRow label="Propofol" value={`${calculations.propofol} mg IV`} color={Colors.blue} />
            <View style={styles.infoDivider} />
            <InfoRow label="Ketamine" value={`${calculations.ketamine} mg IV`} color={Colors.purple} />
            <View style={styles.infoDivider} />
            <InfoRow label="Succinylcholine" value={`${calculations.succinylcholine} mg IV (${weight < 2 ? '2' : '1.5'} mg/kg)`} color={Colors.emergency} />
            <View style={styles.infoDivider} />
            <InfoRow label="Rocuronium" value={`${calculations.rocuronium} mg IV (0.6 mg/kg)`} color={Colors.orange} />
            <View style={styles.infoDivider} />
            <InfoRow label="Fentanyl" value={`${calculations.fentanyl} mcg IV (2 mcg/kg)`} color={Colors.orange} />
          </View>

          <SectionHeader title="Resuscitation" />
          <View style={styles.infoCard}>
            <InfoRow label="Epinephrine (ACLS)" value={`${calculations.epiACLS} mg IV (0.01 mg/kg)`} color={Colors.emergency} />
            <View style={styles.infoDivider} />
            <InfoRow label="Atropine" value={`${calculations.atropine} mg IV (min 0.1 mg)`} color={Colors.accent} />
            <View style={styles.infoDivider} />
            <InfoRow label="Fluid bolus" value={`${calculations.fluidBolus10}–${calculations.fluidBolus20} mL (10–20 mL/kg)`} color={Colors.blue} />
            <View style={styles.infoDivider} />
            <InfoRow label="Defibrillation" value={`${calculations.defibInitial} J initial → ${calculations.defibSubsequent} J (2 J/kg → 4 J/kg)`} color={Colors.warning} />
          </View>

          <SectionHeader title="Analgesia" />
          <View style={styles.infoCard}>
            <InfoRow label="Morphine" value={`${calculations.morphine} mg IV (0.1 mg/kg)`} color={Colors.orange} />
            <View style={styles.infoDivider} />
            <InfoRow label="Acetaminophen IV" value={`${Math.round(weight * 15)} mg IV (15 mg/kg)`} color={Colors.accent} />
            <View style={styles.infoDivider} />
            <InfoRow label="Ketorolac" value={`${(weight * 0.5).toFixed(1)} mg IV (0.5 mg/kg, max 30 mg)`} color={Colors.blue} />
          </View>

          <View style={[styles.formulaCard, { borderColor: Colors.warningMuted }]}>
            <Text style={styles.formulaTitle}>Safety Reminders</Text>
            <Text style={styles.formulaText}>• Always verify weight — doses are weight-based</Text>
            <Text style={styles.formulaText}>• Check max adult dose caps (do not exceed)</Text>
            <Text style={styles.formulaText}>• Succinylcholine IM: 4 mg/kg if no IV access</Text>
            <Text style={styles.formulaText}>• Neonates: succinylcholine 2 mg/kg (higher dose)</Text>
          </View>
        </>
      )}

      {/* ── Vitals ── */}
      {activeSection === 'vitals' && (
        <>
          <View style={[styles.infoCard, { borderColor: Colors.accentMuted, borderWidth: 1.5 }]}>
            <Text style={styles.vitalsAgeLabel}>{vitalSigns.ageLabel}</Text>
            <View style={styles.vitalsGrid}>
              <View style={styles.vitalsCell}>
                <Text style={styles.vitalsLabel}>Heart Rate</Text>
                <Text style={[styles.vitalsValue, { color: Colors.emergency }]}>{vitalSigns.hr}</Text>
                <Text style={styles.vitalsUnit}>bpm</Text>
              </View>
              <View style={styles.vitalsCell}>
                <Text style={styles.vitalsLabel}>Resp Rate</Text>
                <Text style={[styles.vitalsValue, { color: Colors.blue }]}>{vitalSigns.rr}</Text>
                <Text style={styles.vitalsUnit}>breaths/min</Text>
              </View>
              <View style={styles.vitalsCell}>
                <Text style={styles.vitalsLabel}>SBP</Text>
                <Text style={[styles.vitalsValue, { color: Colors.orange }]}>{vitalSigns.sbp}</Text>
                <Text style={styles.vitalsUnit}>mmHg</Text>
              </View>
              <View style={styles.vitalsCell}>
                <Text style={styles.vitalsLabel}>DBP</Text>
                <Text style={[styles.vitalsValue, { color: Colors.purple }]}>{vitalSigns.dbp}</Text>
                <Text style={styles.vitalsUnit}>mmHg</Text>
              </View>
            </View>
          </View>

          <SectionHeader title="Blood Pressure — Min Acceptable" />
          <View style={styles.infoCard}>
            <InfoRow label="Min SBP (5th percentile)" value={`${70 + (2 * age)} mmHg`} color={Colors.warning} />
            <View style={styles.infoDivider} />
            <InfoRow label="Formula" value="70 + (2 × Age in years)" />
          </View>

          <SectionHeader title="All Age Groups" />
          {VITAL_SIGNS.map((v, idx) => (
            <View key={idx} style={[styles.vitalsAgeRow, vitalSigns.ageLabel === v.ageLabel && styles.vitalsAgeRowActive]}>
              <Text style={[styles.vitalsAgeRowLabel, vitalSigns.ageLabel === v.ageLabel && { color: Colors.accent }]}>{v.ageLabel}</Text>
              <Text style={styles.vitalsAgeRowValues}>HR {v.hr} · RR {v.rr} · BP {v.sbp}/{v.dbp}</Text>
            </View>
          ))}

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>Key Pediatric Reminders</Text>
            <Text style={styles.formulaText}>SpO2 target: 95–99% (93–96% in premature/CHD)</Text>
            <Text style={styles.formulaText}>ETCO2 target: 35–45 mmHg</Text>
            <Text style={styles.formulaText}>Temp: maintain normothermia 36–37.5°C</Text>
            <Text style={styles.formulaText}>Glucose: monitor in neonates (target 70–100)</Text>
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
  inputSection: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  inputLabel: { fontSize: 16, fontWeight: '600' as const, color: Colors.textPrimary },
  inputValue: { fontSize: 26, fontWeight: '800' as const, color: Colors.textPrimary },
  inputUnit: { fontSize: 14, fontWeight: '500' as const, color: Colors.textSecondary },
  aplsHint: { fontSize: 11, color: Colors.textTertiary, textAlign: 'right' as const, marginTop: 2 },
  slider: { width: '100%', height: 40 },
  sectionTabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  sectionTab: {
    flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: Colors.card,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  sectionTabActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  sectionTabText: { fontSize: 13, fontWeight: '700' as const, color: Colors.textSecondary },
  sectionTabTextActive: { color: Colors.accent },
  sectionTitle: { fontSize: 14, fontWeight: '700' as const, color: Colors.textSecondary, marginTop: 12, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  resultCard: {
    width: '48%', backgroundColor: Colors.card, borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
  },
  resultCardWide: { width: '100%' },
  resultLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' as const, marginBottom: 4 },
  resultValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  resultValue: { fontSize: 28, fontWeight: '800' as const },
  resultUnit: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' as const },
  infoCard: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 8,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  infoLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' as const, flex: 1 },
  infoValue: { fontSize: 14, fontWeight: '700' as const, color: Colors.textPrimary, textAlign: 'right' as const, flex: 1 },
  infoDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 2 },
  formulaCard: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginTop: 8, marginBottom: 10,
  },
  formulaTitle: { fontSize: 12, color: Colors.textSecondary, fontWeight: '700' as const, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  formulaText: { fontSize: 12, color: Colors.textTertiary, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginBottom: 4 },
  vitalsAgeLabel: { fontSize: 15, fontWeight: '700' as const, color: Colors.accent, marginBottom: 14 },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  vitalsCell: { flex: 1, minWidth: '40%', backgroundColor: Colors.surface, borderRadius: 12, padding: 12, alignItems: 'center' },
  vitalsLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600' as const, textTransform: 'uppercase', marginBottom: 4 },
  vitalsValue: { fontSize: 22, fontWeight: '800' as const },
  vitalsUnit: { fontSize: 10, color: Colors.textTertiary, marginTop: 2 },
  vitalsAgeRow: {
    backgroundColor: Colors.card, borderRadius: 10, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  vitalsAgeRowActive: { borderColor: Colors.accent, backgroundColor: Colors.accentMuted },
  vitalsAgeRowLabel: { fontSize: 13, fontWeight: '700' as const, color: Colors.textPrimary, marginBottom: 3 },
  vitalsAgeRowValues: { fontSize: 12, color: Colors.textTertiary },
  bottomSpacer: { height: 20 },
});
