import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useCaseLogs } from '@/contexts/CaseLogContext';
import { acgmeCategories, anesthesiaTypes, proceduresList } from '@/mocks/acgmeRequirements';
import { ASAClass, CaseLog } from '@/types/anesthesia';

export default function NewCaseScreen() {
  const router = useRouter();
  const { addCase } = useCaseLogs();

  const [patientAge, setPatientAge] = useState<string>('50');
  const [asaClass, setAsaClass] = useState<ASAClass>(2);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [procedureType, setProcedureType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedAnesthesia, setSelectedAnesthesia] = useState<number>(0);
  const [selectedProcedures, setSelectedProcedures] = useState<Set<string>>(new Set());

  const toggleProcedure = useCallback((proc: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedProcedures(prev => {
      const next = new Set(prev);
      if (next.has(proc)) next.delete(proc);
      else next.add(proc);
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newCase: CaseLog = {
      id: Date.now().toString(),
      date: dateStr,
      patientAge: parseInt(patientAge) || 50,
      asaClass,
      procedureType: procedureType || 'General Case',
      acgmeCategory: acgmeCategories[selectedCategory],
      anesthesiaType: anesthesiaTypes[selectedAnesthesia],
      procedures: Array.from(selectedProcedures),
      notes: '',
      isEmergency,
    };

    addCase(newCase);
    router.back();
  }, [patientAge, asaClass, procedureType, selectedCategory, selectedAnesthesia, selectedProcedures, isEmergency, addCase, router]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Patient Info</Text>
      <View style={styles.inputSection}>
        <Text style={styles.label}>Patient Age</Text>
        <TextInput
          style={styles.textInput}
          value={patientAge}
          onChangeText={setPatientAge}
          keyboardType="numeric"
          placeholderTextColor={Colors.textTertiary}
          placeholder="Age"
        />
      </View>

      <Text style={styles.label}>ASA Classification</Text>
      <View style={styles.asaRow}>
        {([1, 2, 3, 4, 5, 6] as ASAClass[]).map((cls) => (
          <Pressable
            key={cls}
            style={[styles.asaBtn, cls === asaClass && styles.asaBtnActive]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setAsaClass(cls);
            }}
          >
            <Text style={[styles.asaText, cls === asaClass && styles.asaTextActive]}>
              {cls === 6 ? 'VI' : cls === 5 ? 'V' : cls === 4 ? 'IV' : cls === 3 ? 'III' : cls === 2 ? 'II' : 'I'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.emergencyToggle, isEmergency && styles.emergencyToggleActive]}
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setIsEmergency(!isEmergency);
        }}
      >
        <Text style={[styles.emergencyText, isEmergency && styles.emergencyTextActive]}>
          Emergency (E)
        </Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Procedure</Text>
      <TextInput
        style={[styles.textInput, { marginBottom: 14 }]}
        value={procedureType}
        onChangeText={setProcedureType}
        placeholder="e.g., Laparoscopic Cholecystectomy"
        placeholderTextColor={Colors.textTertiary}
      />

      <Text style={styles.label}>ACGME Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {acgmeCategories.map((cat, idx) => (
          <Pressable
            key={cat}
            style={[styles.chip, idx === selectedCategory && styles.chipActive]}
            onPress={() => setSelectedCategory(idx)}
          >
            <Text style={[styles.chipText, idx === selectedCategory && styles.chipTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.label}>Anesthesia Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {anesthesiaTypes.map((type, idx) => (
          <Pressable
            key={type}
            style={[styles.chip, idx === selectedAnesthesia && styles.chipActive]}
            onPress={() => setSelectedAnesthesia(idx)}
          >
            <Text style={[styles.chipText, idx === selectedAnesthesia && styles.chipTextActive]}>{type}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Procedures Performed</Text>
      <View style={styles.proceduresGrid}>
        {proceduresList.map((proc) => {
          const isSelected = selectedProcedures.has(proc);
          return (
            <Pressable
              key={proc}
              style={[styles.procChip, isSelected && styles.procChipActive]}
              onPress={() => toggleProcedure(proc)}
            >
              {isSelected && <Check size={12} color={Colors.accent} strokeWidth={3} />}
              <Text style={[styles.procChipText, isSelected && styles.procChipTextActive]}>{proc}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Case</Text>
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
    paddingBottom: 60,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputSection: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  asaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  asaBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  asaBtnActive: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accent,
  },
  asaText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  asaTextActive: {
    color: Colors.accent,
  },
  emergencyToggle: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  emergencyToggleActive: {
    backgroundColor: Colors.emergencyMuted,
    borderColor: Colors.emergency,
  },
  emergencyText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  emergencyTextActive: {
    color: Colors.emergency,
  },
  chipScroll: {
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.accent,
  },
  proceduresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  procChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  procChipActive: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accent,
  },
  procChipText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  procChipTextActive: {
    color: Colors.accent,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: Colors.textInverse,
  },
  bottomSpacer: {
    height: 20,
  },
});
