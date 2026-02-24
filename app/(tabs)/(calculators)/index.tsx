import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Scale, Droplets, Heart, Syringe, Wind, Activity, FlaskConical, Pill } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { localAnesthetics } from '@/mocks/drugs';
import { Gender } from '@/types/anesthesia';

type CalcTab = 'weight' | 'fluids' | 'blood' | 'local' | 'mac' | 'ponv' | 'drip' | 'abx';

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

function ResultRow({ label, value, unit, color, small }: { label: string; value: string; unit?: string; color?: string; small?: boolean }) {
  return (
    <View style={styles.resultRow}>
      <Text style={[styles.resultLabel, small && { fontSize: 12 }]}>{label}</Text>
      <View style={styles.resultRight}>
        <Text style={[styles.resultValue, color ? { color } : undefined, small && { fontSize: 16 }]}>{value}</Text>
        {unit && <Text style={styles.resultUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

const VOLATILE_AGENTS = [
  { name: 'Sevoflurane', mac: 2.0, macAwake: 0.6, macBar: 2.2, bloodGas: 0.65 },
  { name: 'Desflurane', mac: 6.0, macAwake: 2.4, macBar: 6.6, bloodGas: 0.42 },
  { name: 'Isoflurane', mac: 1.15, macAwake: 0.4, macBar: 1.3, bloodGas: 1.4 },
];

const VASOACTIVE_DRUGS = [
  {
    name: 'Norepinephrine',
    unit: 'mcg/kg/min',
    range: '0.01–0.5',
    stdConc: 4,
    stdVolume: 250,
    defaultDose: 0.1,
    minDose: 0.01,
    maxDose: 0.5,
    step: 0.01,
  },
  {
    name: 'Epinephrine',
    unit: 'mcg/kg/min',
    range: '0.01–0.3',
    stdConc: 4,
    stdVolume: 250,
    defaultDose: 0.05,
    minDose: 0.01,
    maxDose: 0.3,
    step: 0.01,
  },
  {
    name: 'Phenylephrine',
    unit: 'mcg/kg/min',
    range: '0.1–0.5',
    stdConc: 40,
    stdVolume: 250,
    defaultDose: 0.2,
    minDose: 0.05,
    maxDose: 1.0,
    step: 0.05,
  },
  {
    name: 'Vasopressin',
    unit: 'units/min',
    range: '0.01–0.04',
    stdConc: 20,
    stdVolume: 250,
    defaultDose: 0.02,
    minDose: 0.01,
    maxDose: 0.04,
    step: 0.005,
    fixedDose: true,
  },
  {
    name: 'Dobutamine',
    unit: 'mcg/kg/min',
    range: '2–20',
    stdConc: 250,
    stdVolume: 250,
    defaultDose: 5,
    minDose: 1,
    maxDose: 20,
    step: 0.5,
  },
  {
    name: 'Milrinone',
    unit: 'mcg/kg/min',
    range: '0.375–0.75',
    stdConc: 20,
    stdVolume: 100,
    defaultDose: 0.375,
    minDose: 0.1,
    maxDose: 0.75,
    step: 0.025,
  },
  {
    name: 'Nitroglycerin',
    unit: 'mcg/kg/min',
    range: '0.1–3',
    stdConc: 50,
    stdVolume: 250,
    defaultDose: 0.5,
    minDose: 0.1,
    maxDose: 5,
    step: 0.1,
  },
  {
    name: 'Nicardipine',
    unit: 'mg/hr',
    range: '5–15',
    stdConc: 20,
    stdVolume: 200,
    defaultDose: 5,
    minDose: 1,
    maxDose: 15,
    step: 0.5,
    fixedDose: true,
  },
];

const ANTIBIOTIC_PROCEDURES: { label: string; firstLine: string; dose: string; altPCN: string; redosing: string; timing: string }[] = [
  { label: 'General / Incision (default)', firstLine: 'Cefazolin', dose: '2 g IV (<120 kg); 3 g IV (≥120 kg)', altPCN: 'Clindamycin 600 mg IV or Vancomycin 15 mg/kg IV', redosing: 'q4h (cefazolin); Vanco infusion start 60–120 min pre-incision', timing: 'Within 60 min before incision' },
  { label: 'Cardiac / Open Heart', firstLine: 'Cefazolin', dose: '2 g IV (<120 kg); 3 g IV (≥120 kg)', altPCN: 'Vancomycin 15 mg/kg IV + Gentamicin 1.5 mg/kg', redosing: 'q4h (cefazolin); Vanco pre-CPB only', timing: 'Within 60 min before incision; before CPB' },
  { label: 'Colorectal / Bowel', firstLine: 'Cefoxitin', dose: '2 g IV', altPCN: 'Clindamycin 600 mg IV + Gentamicin 5 mg/kg', redosing: 'q2h (cefoxitin); single dose adequate for most cases', timing: 'Within 60 min before incision' },
  { label: 'Hip / Knee Arthroplasty', firstLine: 'Cefazolin', dose: '2 g IV (<120 kg); 3 g IV (≥120 kg)', altPCN: 'Vancomycin 15 mg/kg IV', redosing: 'q4h (cefazolin); Vanco pre-tourniquet if used', timing: 'Within 60 min before incision' },
  { label: 'Neurosurgery / Craniotomy', firstLine: 'Cefazolin', dose: '2 g IV (<120 kg); 3 g IV (≥120 kg)', altPCN: 'Vancomycin 15 mg/kg IV', redosing: 'q4h (cefazolin)', timing: 'Within 60 min before incision' },
  { label: 'Vascular (Arterial)', firstLine: 'Cefazolin', dose: '2 g IV (<120 kg); 3 g IV (≥120 kg)', altPCN: 'Vancomycin 15 mg/kg IV', redosing: 'q4h (cefazolin); Vanco single dose', timing: 'Within 60 min before incision' },
  { label: 'Cesarean Section', firstLine: 'Cefazolin', dose: '2 g IV (<120 kg); 3 g IV (≥120 kg)', altPCN: 'Clindamycin 600 mg IV + Gentamicin 1.5 mg/kg', redosing: 'Single dose (most cases); q4h if prolonged', timing: 'Before skin incision (NOT at cord clamp per ACOG 2018)' },
  { label: 'Appendectomy', firstLine: 'Cefoxitin', dose: '2 g IV', altPCN: 'Clindamycin 600 mg IV + Gentamicin 5 mg/kg', redosing: 'q2h or single dose if uncomplicated', timing: 'Within 60 min before incision' },
  { label: 'Urologic (No Bowel Prep)', firstLine: 'Cefazolin', dose: '2 g IV (<120 kg); 3 g IV (≥120 kg)', altPCN: 'Trimethoprim-sulfamethoxazole or Fluoroquinolone', redosing: 'q4h (cefazolin)', timing: 'Within 60 min before incision' },
  { label: 'Head & Neck (Clean-Contaminated)', firstLine: 'Ampicillin-sulbactam', dose: '3 g IV', altPCN: 'Clindamycin 600 mg IV + Gentamicin 1.5 mg/kg', redosing: 'q2h (amp-sulbactam)', timing: 'Within 60 min before incision' },
];

const OPIOID_EQUIANALGESIC = [
  { name: 'Morphine IV', factor: 1.0, unit: 'mg' },
  { name: 'Morphine PO', factor: 3.0, unit: 'mg' },
  { name: 'Hydromorphone IV', factor: 0.2, unit: 'mg' },
  { name: 'Hydromorphone PO', factor: 0.75, unit: 'mg' },
  { name: 'Oxycodone PO', factor: 1.5, unit: 'mg' },
  { name: 'Fentanyl IV', factor: 0.01, unit: 'mg' },
  { name: 'Fentanyl Patch', factor: 0.1, unit: 'mcg/h patch (×24 for daily dose)' },
  { name: 'Hydrocodone PO', factor: 1.5, unit: 'mg' },
  { name: 'Codeine PO', factor: 6.67, unit: 'mg' },
  { name: 'Tramadol PO', factor: 10.0, unit: 'mg' },
];

export default function CalculatorsScreen() {
  const [activeTab, setActiveTab] = useState<CalcTab>('weight');

  // Shared inputs
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(40);

  // Fluid calc
  const [npoHours, setNpoHours] = useState<number>(8);

  // Blood calc
  const [hctInitial, setHctInitial] = useState<number>(40);
  const [hctMinimum, setHctMinimum] = useState<number>(25);

  // Local anesthetic
  const [selectedLA, setSelectedLA] = useState<number>(0);
  const [useEpi, setUseEpi] = useState<boolean>(false);

  // MAC calculator
  const [selectedAgent, setSelectedAgent] = useState<number>(0);
  const [n2oPercent, setN2oPercent] = useState<number>(0);
  const [opioidMACSavings, setOpioidMACSavings] = useState<number>(0);

  // PONV
  const [ponvFemale, setPonvFemale] = useState(false);
  const [ponvNonSmoker, setPonvNonSmoker] = useState(false);
  const [ponvHistory, setPonvHistory] = useState(false);
  const [ponvOpioids, setPonvOpioids] = useState(false);

  // Vasoactive
  const [selectedDrip, setSelectedDrip] = useState<number>(0);
  const [dripDose, setDripDose] = useState<number>(0.1);

  // Antibiotic
  const [selectedProcedure, setSelectedProcedure] = useState<number>(0);
  const [hasPCNAllergy, setHasPCNAllergy] = useState<boolean>(false);

  // Opioid converter
  const [selectedFromOpioid, setSelectedFromOpioid] = useState<number>(0);
  const [opioidDose, setOpioidDose] = useState<number>(10);

  // ── Body Weight ──────────────────────────────────────────────────────────
  const bodyWeightMetrics = useMemo(() => {
    const heightCm = height;
    const heightIn = heightCm / 2.54;
    const inchesOver5ft = Math.max(heightIn - 60, 0);
    const ibw = gender === 'male' ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
    const lbm = gender === 'male'
      ? 1.1 * weight - 128 * (weight / heightCm) * (weight / heightCm)
      : 1.07 * weight - 148 * (weight / heightCm) * (weight / heightCm);
    const abw = ibw + 0.4 * (weight - ibw);
    const bmi = weight / ((heightCm / 100) * (heightCm / 100));
    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else if (bmi < 35) bmiCategory = 'Obese I';
    else if (bmi < 40) bmiCategory = 'Obese II';
    else bmiCategory = 'Obese III (Morbid)';
    return {
      ibw: Math.max(ibw, 0).toFixed(1),
      lbm: Math.max(lbm, 0).toFixed(1),
      abw: Math.max(abw, 0).toFixed(1),
      bmi: bmi.toFixed(1),
      bmiCategory,
    };
  }, [weight, height, gender]);

  // ── Fluids ───────────────────────────────────────────────────────────────
  const fluidCalcs = useMemo(() => {
    const hourlyRate = weight <= 10 ? weight * 4 : weight <= 20 ? 40 + (weight - 10) * 2 : 60 + (weight - 20) * 1;
    const npoDeficit = hourlyRate * npoHours;
    const firstHour = (npoDeficit / 2) + hourlyRate;
    const secondHour = (npoDeficit / 4) + hourlyRate;
    return { hourlyRate: Math.round(hourlyRate), npoDeficit: Math.round(npoDeficit), firstHour: Math.round(firstHour), secondHour: Math.round(secondHour) };
  }, [weight, npoHours]);

  // ── Blood ────────────────────────────────────────────────────────────────
  const bloodCalcs = useMemo(() => {
    let ebv: number;
    if (age < 1) ebv = weight * 80;
    else if (age < 12) ebv = weight * 75;
    else if (gender === 'male') ebv = weight * 70;
    else ebv = weight * 65;
    const abl = hctInitial > 0 ? ebv * ((hctInitial - hctMinimum) / hctInitial) : 0;
    const transfusionTrigger = hctMinimum / 3;
    const mtp = abl < 0;
    return { ebv: Math.round(ebv), abl: Math.round(Math.max(abl, 0)), transfusionTrigger: transfusionTrigger.toFixed(1), mtpRisk: mtp };
  }, [weight, age, gender, hctInitial, hctMinimum]);

  // ── Local Anesthetic ─────────────────────────────────────────────────────
  const laCalcs = useMemo(() => {
    const la = localAnesthetics[selectedLA];
    const maxDose = useEpi ? la.maxDoseWith : la.maxDoseWithout;
    const totalDose = maxDose * weight;
    return { name: la.name, maxPerKg: maxDose, totalMax: Math.round(totalDose), concentrations: la.concentration };
  }, [selectedLA, useEpi, weight]);

  // ── MAC ──────────────────────────────────────────────────────────────────
  const macCalcs = useMemo(() => {
    const agent = VOLATILE_AGENTS[selectedAgent];
    const ageMacAdj = age > 40 ? Math.max(agent.mac * (1 - 0.06 * (age - 40) / 10), agent.mac * 0.3) : agent.mac;
    const n2oFraction = n2oPercent / 104;
    const adjustedMAC = Math.max(ageMacAdj * (1 - n2oFraction) * (1 - opioidMACSavings / 100), 0);
    const macAwakeAdj = agent.macAwake * (ageMacAdj / agent.mac);
    const macBarAdj = agent.macBar * (ageMacAdj / agent.mac);
    return {
      baseMac: agent.mac.toFixed(2),
      ageMac: ageMacAdj.toFixed(2),
      finalMac: adjustedMAC.toFixed(2),
      macAwake: macAwakeAdj.toFixed(2),
      macBar: macBarAdj.toFixed(2),
      bloodGas: agent.bloodGas,
    };
  }, [selectedAgent, age, n2oPercent, opioidMACSavings]);

  // ── PONV ─────────────────────────────────────────────────────────────────
  const ponvCalcs = useMemo(() => {
    const score = [ponvFemale, ponvNonSmoker, ponvHistory, ponvOpioids].filter(Boolean).length;
    const risks = [10, 20, 40, 60, 80];
    const risk = risks[score];
    let level: string;
    let levelColor: string;
    let recommendation: string;
    if (score <= 1) {
      level = 'Low';
      levelColor = Colors.success;
      recommendation = 'No prophylaxis required. Consider ondansetron at end of case if desired.';
    } else if (score === 2) {
      level = 'Moderate';
      levelColor = Colors.orange;
      recommendation = '1–2 antiemetics: Ondansetron 4 mg IV + Dexamethasone 4–8 mg IV at induction.';
    } else {
      level = 'High';
      levelColor = Colors.emergency;
      recommendation = 'Multimodal prophylaxis: Ondansetron 4 mg + Dexamethasone 8 mg + TIVA (propofol) + consider scopolamine patch.';
    }
    return { score, risk, level, levelColor, recommendation };
  }, [ponvFemale, ponvNonSmoker, ponvHistory, ponvOpioids]);

  // ── Vasoactive Drip ──────────────────────────────────────────────────────
  const dripCalcs = useMemo(() => {
    const drug = VASOACTIVE_DRUGS[selectedDrip];
    const concMgPerMl = drug.stdConc / drug.stdVolume;
    let rateMLPerHr: number;

    if (drug.fixedDose) {
      if (drug.unit === 'units/min') {
        rateMLPerHr = (dripDose * 60) / (concMgPerMl * 1000);
      } else {
        // mg/hr (nicardipine)
        rateMLPerHr = dripDose / concMgPerMl;
      }
    } else {
      // mcg/kg/min → mg/hr
      rateMLPerHr = (dripDose * weight * 60) / (concMgPerMl * 1000);
    }

    const mcgPerMin = drug.unit === 'units/min' ? undefined : dripDose * weight;
    return {
      rateMLPerHr: rateMLPerHr.toFixed(1),
      mcgPerMin: mcgPerMin?.toFixed(1),
      concMgPerMl: concMgPerMl.toFixed(3),
      stdMix: `${drug.stdConc} mg in ${drug.stdVolume} mL`,
      concDisplay: `${(concMgPerMl * 1000).toFixed(0)} mcg/mL`,
    };
  }, [selectedDrip, dripDose, weight]);

  // ── Opioid Converter ─────────────────────────────────────────────────────
  const opioidCalcs = useMemo(() => {
    const fromDrug = OPIOID_EQUIANALGESIC[selectedFromOpioid];
    const morphineEquivalent = opioidDose / fromDrug.factor;
    const medd = morphineEquivalent;
    const highDose = medd >= 90;
    const allConversions = OPIOID_EQUIANALGESIC.map(d => ({
      name: d.name,
      dose: (morphineEquivalent * d.factor).toFixed(1),
      unit: d.unit,
    }));
    return { morphineEquivalent: morphineEquivalent.toFixed(1), medd: medd.toFixed(1), highDose, allConversions };
  }, [selectedFromOpioid, opioidDose]);

  // ── Render helpers ───────────────────────────────────────────────────────

  const renderWeightCalc = () => (
    <View>
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Weight</Text>
          <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={20} maximumValue={200} step={1} value={weight} onValueChange={setWeight} minimumTrackTintColor={Colors.accent} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.accent} />
      </View>
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Height</Text>
          <Text style={styles.inputValue}>{height} <Text style={styles.inputUnit}>cm</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={100} maximumValue={220} step={1} value={height} onValueChange={setHeight} minimumTrackTintColor={Colors.blue} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.blue} />
      </View>
      <View style={styles.genderRow}>
        <Pressable style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]} onPress={() => setGender('male')}>
          <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
        </Pressable>
        <Pressable style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]} onPress={() => setGender('female')}>
          <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
        </Pressable>
      </View>
      <View style={styles.resultsCard}>
        <ResultRow label="BMI" value={bodyWeightMetrics.bmi} unit={`kg/m² (${bodyWeightMetrics.bmiCategory})`} color={Colors.accent} />
        <View style={styles.divider} />
        <ResultRow label="Ideal Body Weight" value={bodyWeightMetrics.ibw} unit="kg" color={Colors.blue} />
        <View style={styles.divider} />
        <ResultRow label="Lean Body Mass" value={bodyWeightMetrics.lbm} unit="kg" color={Colors.purple} />
        <View style={styles.divider} />
        <ResultRow label="Adjusted Body Weight" value={bodyWeightMetrics.abw} unit="kg" color={Colors.orange} />
      </View>
      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>Formulas (Devine)</Text>
        <Text style={styles.formulaText}>IBW ♂: 50 + 2.3 × (height_in − 60)</Text>
        <Text style={styles.formulaText}>IBW ♀: 45.5 + 2.3 × (height_in − 60)</Text>
        <Text style={styles.formulaText}>ABW: IBW + 0.4 × (actual − IBW)</Text>
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
        <Slider style={styles.slider} minimumValue={5} maximumValue={200} step={1} value={weight} onValueChange={setWeight} minimumTrackTintColor={Colors.accent} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.accent} />
      </View>
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>NPO Duration</Text>
          <Text style={styles.inputValue}>{npoHours} <Text style={styles.inputUnit}>hours</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={1} maximumValue={24} step={1} value={npoHours} onValueChange={setNpoHours} minimumTrackTintColor={Colors.blue} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.blue} />
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
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Age</Text>
          <Text style={styles.inputValue}>{age < 1 ? '<1' : age} <Text style={styles.inputUnit}>yr</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={0} maximumValue={90} step={1} value={age} onValueChange={setAge} minimumTrackTintColor={Colors.purple} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.purple} />
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
        <View style={styles.divider} />
        <ResultRow label="Hgb Transfusion Trigger" value={bloodCalcs.transfusionTrigger} unit="g/dL" color={Colors.warning} />
      </View>
      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>EBV (mL/kg)</Text>
        <Text style={styles.formulaText}>Neonate: 80 | Child: 75</Text>
        <Text style={styles.formulaText}>Adult ♂: 70 | Adult ♀: 65</Text>
        <Text style={styles.formulaText}>ABL = EBV × (Hct_i − Hct_min) / Hct_i</Text>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {localAnesthetics.map((la, idx) => (
          <Pressable key={la.name} style={[styles.chip, idx === selectedLA && styles.chipActive]} onPress={() => setSelectedLA(idx)}>
            <Text style={[styles.chipText, idx === selectedLA && styles.chipTextActive]}>{la.name}</Text>
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

  const renderMACCalc = () => (
    <View>
      <SectionHeader title="Volatile Agent" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {VOLATILE_AGENTS.map((a, idx) => (
          <Pressable key={a.name} style={[styles.chip, idx === selectedAgent && styles.chipActive]} onPress={() => setSelectedAgent(idx)}>
            <Text style={[styles.chipText, idx === selectedAgent && styles.chipTextActive]}>{a.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Patient Age</Text>
          <Text style={styles.inputValue}>{age} <Text style={styles.inputUnit}>yr</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={0} maximumValue={90} step={1} value={age} onValueChange={setAge} minimumTrackTintColor={Colors.accent} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.accent} />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>N₂O adjunct</Text>
          <Text style={styles.inputValue}>{n2oPercent}<Text style={styles.inputUnit}>%</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={0} maximumValue={70} step={5} value={n2oPercent} onValueChange={setN2oPercent} minimumTrackTintColor={Colors.blue} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.blue} />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Opioid MAC savings</Text>
          <Text style={styles.inputValue}>{opioidMACSavings}<Text style={styles.inputUnit}>%</Text></Text>
        </View>
        <Slider style={styles.slider} minimumValue={0} maximumValue={50} step={5} value={opioidMACSavings} onValueChange={setOpioidMACSavings} minimumTrackTintColor={Colors.orange} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.orange} />
        <Text style={styles.sliderHint}>Typical opioid infusion reduces MAC by 10–30%</Text>
      </View>

      <View style={styles.resultsCard}>
        <ResultRow label={`${VOLATILE_AGENTS[selectedAgent].name} Base MAC`} value={macCalcs.baseMac} unit="%" color={Colors.textTertiary} small />
        <View style={styles.divider} />
        <ResultRow label={`Age-Adjusted MAC (${age} yr)`} value={macCalcs.ageMac} unit="%" color={Colors.blue} />
        <View style={styles.divider} />
        <ResultRow label="Final Adjusted MAC" value={macCalcs.finalMac} unit="%" color={Colors.accent} />
        <View style={styles.divider} />
        <ResultRow label="MAC-Awake" value={macCalcs.macAwake} unit="% (≈ emergence)" color={Colors.orange} small />
        <View style={styles.divider} />
        <ResultRow label="MAC-BAR" value={macCalcs.macBar} unit="% (blocks stress response)" color={Colors.purple} small />
        <View style={styles.divider} />
        <ResultRow label="Blood:Gas coefficient" value={String(macCalcs.bloodGas)} unit="(lower = faster)" color={Colors.textSecondary} small />
      </View>

      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>MAC Age Adjustment</Text>
        <Text style={styles.formulaText}>MAC ↓ ~6% per decade after age 40</Text>
        <Text style={styles.formulaText}>N₂O is additive (MAC 104%)</Text>
        <Text style={styles.formulaText}>MAC-awake ≈ 0.3× MAC (Sevo ~0.6%)</Text>
      </View>
    </View>
  );

  const renderPONV = () => {
    const factors = [
      { label: 'Female sex', value: ponvFemale, set: setPonvFemale },
      { label: 'Non-smoker', value: ponvNonSmoker, set: setPonvNonSmoker },
      { label: 'History of PONV or motion sickness', value: ponvHistory, set: setPonvHistory },
      { label: 'Postop opioids planned', value: ponvOpioids, set: setPonvOpioids },
    ];
    return (
      <View>
        <SectionHeader title="Apfel Score — Risk Factors" />
        {factors.map(f => (
          <Pressable
            key={f.label}
            style={[styles.checkRow, f.value && styles.checkRowActive]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              f.set(!f.value);
            }}
          >
            <View style={[styles.checkbox, f.value && styles.checkboxActive]}>
              {f.value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkLabel, f.value && styles.checkLabelActive]}>{f.label}</Text>
          </Pressable>
        ))}

        <View style={[styles.riskBadge, { borderColor: ponvCalcs.levelColor }]}>
          <Text style={[styles.riskScore, { color: ponvCalcs.levelColor }]}>{ponvCalcs.score} / 4</Text>
          <Text style={[styles.riskLevel, { color: ponvCalcs.levelColor }]}>{ponvCalcs.level} Risk</Text>
          <Text style={styles.riskPercent}>{ponvCalcs.risk}% PONV incidence</Text>
        </View>

        <View style={styles.resultsCard}>
          <Text style={styles.recommendTitle}>Recommendation</Text>
          <Text style={styles.recommendText}>{ponvCalcs.recommendation}</Text>
        </View>

        <View style={styles.formulaCard}>
          <Text style={styles.formulaTitle}>Apfel Score Risks</Text>
          <Text style={styles.formulaText}>0 factors: ~10%</Text>
          <Text style={styles.formulaText}>1 factor:  ~20%</Text>
          <Text style={styles.formulaText}>2 factors: ~40%</Text>
          <Text style={styles.formulaText}>3 factors: ~60%</Text>
          <Text style={styles.formulaText}>4 factors: ~80%</Text>
        </View>
      </View>
    );
  };

  const renderDrip = () => {
    const drug = VASOACTIVE_DRUGS[selectedDrip];
    return (
      <View>
        <SectionHeader title="Select Drug" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {VASOACTIVE_DRUGS.map((d, idx) => (
            <Pressable
              key={d.name}
              style={[styles.chip, idx === selectedDrip && styles.chipActive]}
              onPress={() => {
                setSelectedDrip(idx);
                setDripDose(VASOACTIVE_DRUGS[idx].defaultDose);
              }}
            >
              <Text style={[styles.chipText, idx === selectedDrip && styles.chipTextActive]}>{d.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Weight</Text>
            <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
          </View>
          <Slider style={styles.slider} minimumValue={20} maximumValue={200} step={1} value={weight} onValueChange={setWeight} minimumTrackTintColor={Colors.accent} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.accent} />
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Dose</Text>
            <Text style={styles.inputValue}>{dripDose.toFixed(3).replace(/\.?0+$/, '')} <Text style={styles.inputUnit}>{drug.unit}</Text></Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={drug.minDose}
            maximumValue={drug.maxDose}
            step={drug.step}
            value={dripDose}
            onValueChange={setDripDose}
            minimumTrackTintColor={Colors.emergency}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.emergency}
          />
          <Text style={styles.sliderHint}>Typical range: {drug.range} {drug.unit}</Text>
        </View>

        <View style={styles.resultsCard}>
          <ResultRow label="Infusion Rate" value={dripCalcs.rateMLPerHr} unit="mL/hr" color={Colors.accent} />
          <View style={styles.divider} />
          {dripCalcs.mcgPerMin && (
            <>
              <ResultRow label="Total Dose" value={dripCalcs.mcgPerMin} unit={`mcg/min (${weight} kg)`} color={Colors.blue} small />
              <View style={styles.divider} />
            </>
          )}
          <ResultRow label="Standard Mix" value={dripCalcs.stdMix} color={Colors.textSecondary} small />
          <View style={styles.divider} />
          <ResultRow label="Concentration" value={dripCalcs.concDisplay} color={Colors.orange} small />
        </View>

        <View style={styles.formulaCard}>
          <Text style={styles.formulaTitle}>Rate Formula</Text>
          <Text style={styles.formulaText}>Rate (mL/hr) = Dose × Weight × 60 / (Conc mg/mL × 1000)</Text>
          <Text style={styles.formulaText}>Double-check: Dose = Rate × Conc / (Weight × 60)</Text>
        </View>
      </View>
    );
  };

  const renderABX = () => {
    const proc = ANTIBIOTIC_PROCEDURES[selectedProcedure];
    return (
      <View>
        <SectionHeader title="Procedure Type" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {ANTIBIOTIC_PROCEDURES.map((p, idx) => (
            <Pressable key={idx} style={[styles.chip, idx === selectedProcedure && styles.chipActive]} onPress={() => setSelectedProcedure(idx)}>
              <Text style={[styles.chipText, idx === selectedProcedure && styles.chipTextActive]}>{p.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Weight</Text>
            <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
          </View>
          <Slider style={styles.slider} minimumValue={20} maximumValue={200} step={1} value={weight} onValueChange={setWeight} minimumTrackTintColor={Colors.accent} maximumTrackTintColor={Colors.border} thumbTintColor={Colors.accent} />
        </View>

        <View style={styles.genderRow}>
          <Pressable style={[styles.genderBtn, !hasPCNAllergy && styles.genderBtnActive]} onPress={() => setHasPCNAllergy(false)}>
            <Text style={[styles.genderText, !hasPCNAllergy && styles.genderTextActive]}>No PCN Allergy</Text>
          </Pressable>
          <Pressable style={[styles.genderBtn, hasPCNAllergy && { ...styles.genderBtnActive, backgroundColor: Colors.emergencyMuted, borderColor: Colors.emergency }]} onPress={() => setHasPCNAllergy(true)}>
            <Text style={[styles.genderText, hasPCNAllergy && { color: Colors.emergency }]}>PCN Allergy</Text>
          </Pressable>
        </View>

        <View style={styles.resultsCard}>
          <View style={styles.abxRow}>
            <Text style={styles.abxLabel}>Agent</Text>
            <Text style={styles.abxValue}>{hasPCNAllergy ? proc.altPCN.split(' ')[0] : proc.firstLine}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.abxRow}>
            <Text style={styles.abxLabel}>Dose</Text>
            <Text style={[styles.abxValue, { color: Colors.accent }]}>{hasPCNAllergy ? proc.altPCN : `${proc.dose}${weight >= 120 ? ' → use 3g dose' : ''}`}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.abxRow}>
            <Text style={styles.abxLabel}>Timing</Text>
            <Text style={[styles.abxValue, { color: Colors.warning }]}>{proc.timing}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.abxRow}>
            <Text style={styles.abxLabel}>Re-dosing</Text>
            <Text style={[styles.abxValue, { color: Colors.textSecondary, fontSize: 12 }]}>{proc.redosing}</Text>
          </View>
        </View>

        {weight >= 120 && (
          <View style={[styles.formulaCard, { borderColor: Colors.warning }]}>
            <Text style={[styles.formulaTitle, { color: Colors.warning }]}>Weight-based alert: ≥120 kg</Text>
            <Text style={styles.formulaText}>Use 3g cefazolin for patients ≥120 kg</Text>
            <Text style={styles.formulaText}>Vancomycin: 15–20 mg/kg (max 3g/dose)</Text>
          </View>
        )}

        <View style={styles.formulaCard}>
          <Text style={styles.formulaTitle}>Key Principles (ASHP/SHEA/IDSA)</Text>
          <Text style={styles.formulaText}>• Administer within 60 min before incision</Text>
          <Text style={styles.formulaText}>• Vancomycin/fluoro: start 60–120 min pre-incision</Text>
          <Text style={styles.formulaText}>• Re-dose cefazolin every 4h or with >1.5L blood loss</Text>
          <Text style={styles.formulaText}>• Discontinue within 24h of surgery end</Text>
        </View>
      </View>
    );
  };

  const TAB_ROW_1: { key: CalcTab; label: string; icon: React.ReactNode }[] = [
    { key: 'weight', label: 'Weight', icon: <Scale size={14} color={activeTab === 'weight' ? Colors.textInverse : Colors.textSecondary} /> },
    { key: 'fluids', label: 'Fluids', icon: <Droplets size={14} color={activeTab === 'fluids' ? Colors.textInverse : Colors.textSecondary} /> },
    { key: 'blood', label: 'Blood', icon: <Heart size={14} color={activeTab === 'blood' ? Colors.textInverse : Colors.textSecondary} /> },
    { key: 'local', label: 'Local', icon: <Syringe size={14} color={activeTab === 'local' ? Colors.textInverse : Colors.textSecondary} /> },
  ];

  const TAB_ROW_2: { key: CalcTab; label: string; icon: React.ReactNode }[] = [
    { key: 'mac', label: 'MAC', icon: <Wind size={14} color={activeTab === 'mac' ? Colors.textInverse : Colors.textSecondary} /> },
    { key: 'ponv', label: 'PONV', icon: <Activity size={14} color={activeTab === 'ponv' ? Colors.textInverse : Colors.textSecondary} /> },
    { key: 'drip', label: 'Drip', icon: <FlaskConical size={14} color={activeTab === 'drip' ? Colors.textInverse : Colors.textSecondary} /> },
    { key: 'abx', label: 'Antibiotic', icon: <Pill size={14} color={activeTab === 'abx' ? Colors.textInverse : Colors.textSecondary} /> },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.tabRow}>
        {TAB_ROW_1.map(t => (
          <TabButton key={t.key} label={t.label} active={activeTab === t.key} onPress={() => setActiveTab(t.key)} icon={t.icon} />
        ))}
      </View>
      <View style={[styles.tabRow, { marginTop: -6 }]}>
        {TAB_ROW_2.map(t => (
          <TabButton key={t.key} label={t.label} active={activeTab === t.key} onPress={() => setActiveTab(t.key)} icon={t.icon} />
        ))}
      </View>

      {activeTab === 'weight' && renderWeightCalc()}
      {activeTab === 'fluids' && renderFluidsCalc()}
      {activeTab === 'blood' && renderBloodCalc()}
      {activeTab === 'local' && renderLocalCalc()}
      {activeTab === 'mac' && renderMACCalc()}
      {activeTab === 'ponv' && renderPONV()}
      {activeTab === 'drip' && renderDrip()}
      {activeTab === 'abx' && renderABX()}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  tabRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabBtnText: { fontSize: 11, fontWeight: '700' as const, color: Colors.textSecondary },
  tabBtnTextActive: { color: Colors.textInverse },
  inputSection: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  inputLabel: { fontSize: 14, fontWeight: '600' as const, color: Colors.textPrimary },
  inputValue: { fontSize: 24, fontWeight: '800' as const, color: Colors.textPrimary },
  inputUnit: { fontSize: 12, fontWeight: '500' as const, color: Colors.textSecondary },
  slider: { width: '100%', height: 36 },
  sliderHint: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderBtnActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  genderText: { fontSize: 14, fontWeight: '600' as const, color: Colors.textSecondary },
  genderTextActive: { color: Colors.accent },
  resultsCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  resultLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' as const, flex: 1 },
  resultRight: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  resultValue: { fontSize: 20, fontWeight: '800' as const, color: Colors.textPrimary },
  resultUnit: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500' as const, maxWidth: 120 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  formulaCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    marginBottom: 10,
  },
  formulaTitle: { fontSize: 12, color: Colors.textSecondary, fontWeight: '700' as const, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  formulaText: { fontSize: 12, color: Colors.textTertiary, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginBottom: 3 },
  subSectionTitle: { fontSize: 13, fontWeight: '700' as const, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionHeader: { fontSize: 13, fontWeight: '700' as const, color: Colors.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipScroll: { marginBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  chipText: { fontSize: 13, fontWeight: '600' as const, color: Colors.textSecondary },
  chipTextActive: { color: Colors.accent },
  concentrationCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  concRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  concLabel: { fontSize: 13, color: Colors.textSecondary },
  concValue: { fontSize: 14, fontWeight: '700' as const, color: Colors.accent },
  // PONV
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkRowActive: { borderColor: Colors.accent, backgroundColor: Colors.accentMuted },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { borderColor: Colors.accent, backgroundColor: Colors.accent },
  checkmark: { color: Colors.textInverse, fontSize: 13, fontWeight: '800' as const },
  checkLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' as const, flex: 1 },
  checkLabelActive: { color: Colors.textPrimary },
  riskBadge: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    marginVertical: 14,
    backgroundColor: Colors.card,
  },
  riskScore: { fontSize: 40, fontWeight: '900' as const, lineHeight: 48 },
  riskLevel: { fontSize: 18, fontWeight: '700' as const, marginTop: 4 },
  riskPercent: { fontSize: 13, color: Colors.textTertiary, marginTop: 4 },
  recommendTitle: { fontSize: 12, fontWeight: '700' as const, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  recommendText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  // Antibiotic
  abxRow: { paddingVertical: 7 },
  abxLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 },
  abxValue: { fontSize: 14, fontWeight: '600' as const, color: Colors.textPrimary },
  bottomSpacer: { height: 20 },
});
