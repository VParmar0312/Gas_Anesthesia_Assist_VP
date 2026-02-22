import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

function ResultCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color: string }) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultLabel}>{label}</Text>
      <View style={styles.resultValueRow}>
        <Text style={[styles.resultValue, { color }]}>{value}</Text>
        {unit && <Text style={styles.resultUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

export default function PediatricSetupScreen() {
  const [age, setAge] = useState<number>(5);
  const [weight, setWeight] = useState<number>(20);

  const calculations = useMemo(() => {
    const ettUncuffed = (age / 4) + 4;
    const ettCuffed = (age / 4) + 3.5;
    const ettDepth = (age / 2) + 12;

    let bladeType = '';
    let bladeSize = '';
    if (age < 1) {
      bladeType = 'Miller';
      bladeSize = '0-1';
    } else if (age < 3) {
      bladeType = 'Miller';
      bladeSize = '1';
    } else if (age < 8) {
      bladeType = 'Miller 2 or Mac 2';
      bladeSize = '2';
    } else {
      bladeType = 'Macintosh';
      bladeSize = '3';
    }

    let circuitType = '';
    if (weight < 10) {
      circuitType = 'Mapleson D / Jackson-Rees';
    } else if (weight < 20) {
      circuitType = 'Mapleson D or Circle';
    } else {
      circuitType = 'Adult Circle System';
    }

    let lmaSize = '';
    if (weight < 5) lmaSize = '1';
    else if (weight < 10) lmaSize = '1.5';
    else if (weight < 20) lmaSize = '2';
    else if (weight < 30) lmaSize = '2.5';
    else if (weight < 50) lmaSize = '3';
    else lmaSize = '4';

    const maintenanceFluid = weight <= 10
      ? weight * 4
      : weight <= 20
        ? 40 + (weight - 10) * 2
        : 60 + (weight - 20) * 1;

    return {
      ettUncuffed: ettUncuffed.toFixed(1),
      ettCuffed: ettCuffed.toFixed(1),
      ettDepth: ettDepth.toFixed(1),
      bladeType,
      bladeSize,
      circuitType,
      lmaSize,
      maintenanceFluid,
    };
  }, [age, weight]);

  const handleAgeChange = useCallback((val: number) => {
    setAge(Math.round(val));
  }, []);

  const handleWeightChange = useCallback((val: number) => {
    setWeight(Math.round(val * 2) / 2);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Age</Text>
          <Text style={styles.inputValue}>{age} <Text style={styles.inputUnit}>years</Text></Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={16}
          step={1}
          value={age}
          onValueChange={handleAgeChange}
          minimumTrackTintColor={Colors.accent}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.accent}
        />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Weight</Text>
          <Text style={styles.inputValue}>{weight} <Text style={styles.inputUnit}>kg</Text></Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={80}
          step={0.5}
          value={weight}
          onValueChange={handleWeightChange}
          minimumTrackTintColor={Colors.blue}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.blue}
        />
      </View>

      <Text style={styles.sectionTitle}>Airway Equipment</Text>
      <View style={styles.resultsGrid}>
        <ResultCard label="ETT Uncuffed" value={calculations.ettUncuffed} unit="mm" color={Colors.accent} />
        <ResultCard label="ETT Cuffed" value={calculations.ettCuffed} unit="mm" color={Colors.accent} />
        <ResultCard label="ETT Depth" value={calculations.ettDepth} unit="cm" color={Colors.blue} />
        <ResultCard label="LMA Size" value={calculations.lmaSize} color={Colors.blue} />
      </View>

      <Text style={styles.sectionTitle}>Blade Selection</Text>
      <View style={styles.bladeCard}>
        <View style={styles.bladeRow}>
          <Text style={styles.bladeLabel}>Recommended</Text>
          <Text style={styles.bladeValue}>{calculations.bladeType}</Text>
        </View>
        <View style={styles.bladeDivider} />
        <View style={styles.bladeRow}>
          <Text style={styles.bladeLabel}>Size</Text>
          <Text style={[styles.bladeValue, { color: Colors.accent }]}>{calculations.bladeSize}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Circuit & Fluids</Text>
      <View style={styles.bladeCard}>
        <View style={styles.bladeRow}>
          <Text style={styles.bladeLabel}>Circuit</Text>
          <Text style={styles.bladeValue}>{calculations.circuitType}</Text>
        </View>
        <View style={styles.bladeDivider} />
        <View style={styles.bladeRow}>
          <Text style={styles.bladeLabel}>Maintenance Rate</Text>
          <Text style={[styles.bladeValue, { color: Colors.accent }]}>{calculations.maintenanceFluid} mL/hr</Text>
        </View>
      </View>

      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>Formulas Used</Text>
        <Text style={styles.formulaText}>ETT Uncuffed = (Age/4) + 4</Text>
        <Text style={styles.formulaText}>ETT Cuffed = (Age/4) + 3.5</Text>
        <Text style={styles.formulaText}>ETT Depth = (Age/2) + 12</Text>
        <Text style={styles.formulaText}>Fluids = 4-2-1 Rule</Text>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  inputSection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  inputValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  inputUnit: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 12,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  resultValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: '800' as const,
  },
  resultUnit: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  bladeCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  bladeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  bladeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  bladeValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '700' as const,
    flexShrink: 1,
    textAlign: 'right' as const,
    maxWidth: '60%',
  },
  bladeDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  formulaCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 16,
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
  bottomSpacer: {
    height: 20,
  },
});
