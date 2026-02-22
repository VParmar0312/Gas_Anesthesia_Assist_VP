import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Scale, Droplets, Heart, Syringe } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { localAnesthetics } from '@/mocks/drugs';
import { Gender } from '@/types/anesthesia';

type CalcTab = 'weight' | 'fluids' | 'blood' | 'local';

function TabButton({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon: React.ReactNode }) {
  return (
    <Pressable
      style={[styles.tabBtn, active && styles.tabBtnActive]}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      {icon}
      <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ResultRow({ label, value, unit, color }: { label: string; value: string; unit?: string; color?: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <View style={styles.resultRight}>
        <Text style={[styles.resultValue, color ? { color } : undefined]}>{value}</Text>
        {unit && <Text style={styles.resultUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

export default function CalculatorsScreen() {
  const [activeTab, setActiveTab] = useState<CalcTab>('weight');
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(40);
  const [npoHours, setNpoHours] = useState<number>(8);
  const [hctInitial, setHctInitial] = useState<number>(40);
  const [hctMinimum, setHctMinimum] = useState<number>(25);
  const [selectedLA, setSelectedLA] = useState<number>(0);
  const [useEpi, setUseEpi] = useState<boolean>(false);

  const bodyWeightMetrics = useMemo(() => {
    const heightCm = height;
    const heightIn = heightCm / 2.54;
    const inchesOver5ft = Math.max(heightIn - 60, 0);

    const ibw = gender === 'male'
      ? 50 + 2.3 * inchesOver5ft
      : 45.5 + 2.3 * inchesOver5ft;

    const lbm = gender === 'male'
      ? 1.1 * weight - 128 * (weight / heightCm) * (weight / heightCm)
      : 1.07 * weight - 148 * (weight / heightCm) * (weight / heightCm);

    const abw = ibw + 0.4 * (weight - ibw);
    const bmi = weight / ((heightCm / 100) * (heightCm / 100));

    return {
      ibw: Math.max(ibw, 0).toFixed(1),
      lbm: Math.max(lbm, 0).toFixed(1),
      abw: Math.max(abw, 0).toFixed(1),
      bmi: bmi.toFixed(1),
    };
  }, [weight, height, gender]);

  const fluidCalcs = useMemo(() => {
    const hourlyRate = weight <= 10
      ? weight * 4
      : weight <= 20
        ? 40 + (weight - 10) * 2
        : 60 + (weight - 20) * 1;

    const npoDeficit = hourlyRate * npoHours;
    const firstHour = (npoDeficit / 2) + hourlyRate;
    const secondHour = (npoDeficit / 4) + hourlyRate;

    return {
      hourlyRate: Math.round(hourlyRate),
      npoDeficit: Math.round(npoDeficit),
      firstHour: Math.round(firstHour),
      secondHour: Math.round(secondHour),
    };
  }, [weight, npoHours]);

  const bloodCalcs = useMemo(() => {
    let ebv: number;
    if (age < 1) ebv = weight * 80;
    else if (age < 12) ebv = weight * 75;
    else if (gender === 'male') ebv = weight * 70;
    else ebv = weight * 65;

    const abl = hctInitial > 0
      ? ebv * ((hctInitial - hctMinimum) / hctInitial)
      : 0;

    return {
      ebv: Math.round(ebv),
      abl: Math.round(Math.max(abl, 0)),
    };
  }, [weight, age, gender, hctInitial, hctMinimum]);

  const laCalcs = useMemo(() => {
    const la = localAnesthetics[selectedLA];
    const maxDose = useEpi ? la.maxDoseWith : la.maxDoseWithout;
    const totalDose = maxDose * weight;
    return {
      name: la.name,
      maxPerKg: maxDose,
      totalMax: Math.round(totalDose),
      concentrations: la.concentration,
    };
  }, [selectedLA, useEpi, weight]);

  const renderWeightCalc = () => (
    <View>
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Weight</Text>
          <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={20}
          maximumValue={200}
          step={1}
          value={weight}
          onValueChange={setWeight}
          minimumTrackTintColor={Colors.accent}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.accent}
        />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Height</Text>
          <Text style={styles.inputValue}>{height} <Text style={styles.inputUnit}>cm</Text></Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={100}
          maximumValue={220}
          step={1}
          value={height}
          onValueChange={setHeight}
          minimumTrackTintColor={Colors.blue}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.blue}
        />
      </View>

      <View style={styles.genderRow}>
        <Pressable
          style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}
          onPress={() => setGender('male')}
        >
          <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
        </Pressable>
        <Pressable
          style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}
          onPress={() => setGender('female')}
        >
          <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
        </Pressable>
      </View>

      <View style={styles.resultsCard}>
        <ResultRow label="BMI" value={bodyWeightMetrics.bmi} unit="kg/m2" color={Colors.accent} />
        <View style={styles.divider} />
        <ResultRow label="Ideal Body Weight" value={bodyWeightMetrics.ibw} unit="kg" color={Colors.blue} />
        <View style={styles.divider} />
        <ResultRow label="Lean Body Mass" value={bodyWeightMetrics.lbm} unit="kg" color={Colors.purple} />
        <View style={styles.divider} />
        <ResultRow label="Adjusted Body Weight" value={bodyWeightMetrics.abw} unit="kg" color={Colors.orange} />
      </View>
    </View>
  );

  const renderFluidsCalc = () => (
    <View>
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Weight</Text>
          <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={200}
          step={1}
          value={weight}
          onValueChange={setWeight}
          minimumTrackTintColor={Colors.accent}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.accent}
        />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>NPO Duration</Text>
          <Text style={styles.inputValue}>{npoHours} <Text style={styles.inputUnit}>hours</Text></Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={24}
          step={1}
          value={npoHours}
          onValueChange={setNpoHours}
          minimumTrackTintColor={Colors.blue}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.blue}
        />
      </View>

      <View style={styles.resultsCard}>
        <ResultRow label="Maintenance Rate (4-2-1)" value={String(fluidCalcs.hourlyRate)} unit="mL/hr" color={Colors.accent} />
        <View style={styles.divider} />
        <ResultRow label="NPO Deficit" value={String(fluidCalcs.npoDeficit)} unit="mL" color={Colors.orange} />
        <View style={styles.divider} />
        <ResultRow label="1st Hour (50% deficit + maint)" value={String(fluidCalcs.firstHour)} unit="mL" color={Colors.blue} />
        <View style={styles.divider} />
        <ResultRow label="2nd Hour (25% deficit + maint)" value={String(fluidCalcs.secondHour)} unit="mL" color={Colors.blue} />
      </View>

      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>4-2-1 Rule</Text>
        <Text style={styles.formulaText}>First 10 kg: 4 mL/kg/hr</Text>
        <Text style={styles.formulaText}>Next 10 kg: 2 mL/kg/hr</Text>
        <Text style={styles.formulaText}>Each additional kg: 1 mL/kg/hr</Text>
      </View>
    </View>
  );

  const renderBloodCalc = () => (
    <View>
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Weight</Text>
          <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={5} maximumValue={200} step={1} value={weight} onValueChange={setWeight} minimumTrackTintColor={Colors.accent} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.accent} />
      </View>

      <View style={styles.genderRow}>
        <Pressable style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]} onPress={() => setGender('male')}>
          <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
        </Pressable>
        <Pressable style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]} onPress={() => setGender('female')}>
          <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
        </Pressable>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Initial Hct</Text>
          <Text style={styles.inputValue}>{hctInitial}<Text style={styles.inputUnit}>%</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={15} maximumValue={60} step={1} value={hctInitial} onValueChange={setHctInitial} minimumTrackTintColor={Colors.emergency} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.emergency} />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Min Acceptable Hct</Text>
          <Text style={styles.inputValue}>{hctMinimum}<Text style={styles.inputUnit}>%</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={15} maximumValue={40} step={1} value={hctMinimum} onValueChange={setHctMinimum} minimumTrackTintColor={Colors.orange} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.orange} />
      </View>

      <View style={styles.resultsCard}>
        <ResultRow label="Estimated Blood Volume" value={String(bloodCalcs.ebv)} unit="mL" color={Colors.emergency} />
        <View style={styles.divider} />
        <ResultRow label="Allowable Blood Loss" value={String(bloodCalcs.abl)} unit="mL" color={Colors.orange} />
      </View>

      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>EBV (mL/kg)</Text>
        <Text style={styles.formulaText}>Neonate: 80 | Child: 75</Text>
        <Text style={styles.formulaText}>Adult Male: 70 | Adult Female: 65</Text>
        <Text style={styles.formulaText}>ABL = EBV x (Hct_i - Hct_min) / Hct_i</Text>
      </View>
    </View>
  );

  const renderLocalCalc = () => (
    <View>
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Weight</Text>
          <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={5} maximumValue={200} step={1} value={weight} onValueChange={setWeight} minimumTrackTintColor={Colors.accent} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.accent} />
      </View>

      <Text style={styles.subSectionTitle}>Select Agent</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.laScroll}>
        {localAnesthetics.map((la, idx) => (
          <Pressable
            key={la.name}
            style={[styles.laChip, idx === selectedLA && styles.laChipActive]}
            onPress={() => setSelectedLA(idx)}
          >
            <Text style={[styles.laChipText, idx === selectedLA && styles.laChipTextActive]}>
              {la.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.genderRow}>
        <Pressable style={[styles.genderBtn, !useEpi && styles.genderBtnActive]} onPress={() => setUseEpi(false)}>
          <Text style={[styles.genderText, !useEpi && styles.genderTextActive]}>Without Epi</Text>
        </Pressable>
        <Pressable style={[styles.genderBtn, useEpi && styles.genderBtnActive]} onPress={() => setUseEpi(true)}>
          <Text style={[styles.genderText, useEpi && styles.genderTextActive]}>With Epi</Text>
        </Pressable>
      </View>

      <View style={styles.resultsCard}>
        <ResultRow label="Agent" value={laCalcs.name} color={Colors.accent} />
        <View style={styles.divider} />
        <ResultRow label="Max Dose" value={String(laCalcs.maxPerKg)} unit="mg/kg" color={Colors.blue} />
        <View style={styles.divider} />
        <ResultRow label="Total Max for Patient" value={String(laCalcs.totalMax)} unit="mg" color={Colors.emergency} />
      </View>

      <View style={styles.concentrationCard}>
        <Text style={styles.formulaTitle}>Volume by Concentration</Text>
        {laCalcs.concentrations.map(conc => {
          const pct = parseFloat(conc) / 100;
          const mgPerMl = pct * 1000;
          const maxVol = laCalcs.totalMax / mgPerMl;
          return (
            <View key={conc} style={styles.concRow}>
              <Text style={styles.concLabel}>{conc} ({mgPerMl} mg/mL)</Text>
              <Text style={styles.concValue}>{maxVol.toFixed(1)} mL max</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.tabRow}>
        <TabButton label="Weight" active={activeTab === 'weight'} onPress={() => setActiveTab('weight')} icon={<Scale size={16} color={activeTab === 'weight' ? Colors.textInverse : Colors.textSecondary} />} />
        <TabButton label="Fluids" active={activeTab === 'fluids'} onPress={() => setActiveTab('fluids')} icon={<Droplets size={16} color={activeTab === 'fluids' ? Colors.textInverse : Colors.textSecondary} />} />
        <TabButton label="Blood" active={activeTab === 'blood'} onPress={() => setActiveTab('blood')} icon={<Heart size={16} color={activeTab === 'blood' ? Colors.textInverse : Colors.textSecondary} />} />
        <TabButton label="Local" active={activeTab === 'local'} onPress={() => setActiveTab('local')} icon={<Syringe size={16} color={activeTab === 'local' ? Colors.textInverse : Colors.textSecondary} />} />
      </View>

      {activeTab === 'weight' && renderWeightCalc()}
      {activeTab === 'fluids' && renderFluidsCalc()}
      {activeTab === 'blood' && renderBloodCalc()}
      {activeTab === 'local' && renderLocalCalc()}

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
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.textInverse,
  },
  inputSection: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  inputValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  inputUnit: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderBtnActive: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accent,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  genderTextActive: {
    color: Colors.accent,
  },
  resultsCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  resultLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    flex: 1,
  },
  resultRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  resultUnit: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 6,
  },
  formulaCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  formulaTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  laScroll: {
    marginBottom: 14,
  },
  laChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  laChipActive: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accent,
  },
  laChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  laChipTextActive: {
    color: Colors.accent,
  },
  concentrationCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  concRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  concLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  concValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  bottomSpacer: {
    height: 20,
  },
});
