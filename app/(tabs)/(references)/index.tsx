import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { Search, ChevronDown, ChevronUp, Clock, Pill, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { allDrugs, anticoagulants } from '@/mocks/drugs';
import { Drug } from '@/types/anesthesia';

type RefTab = 'drugs' | 'anticoag';

function DrugCard({ drug, expanded, onToggle }: { drug: Drug; expanded: boolean; onToggle: () => void }) {
  return (
    <Pressable
      style={styles.drugCard}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
    >
      <View style={styles.drugHeader}>
        <View style={styles.drugInfo}>
          <Text style={styles.drugName}>{drug.name}</Text>
          <View style={styles.drugCatBadge}>
            <Text style={styles.drugCatText}>{drug.category}</Text>
          </View>
        </View>
        {expanded ? (
          <ChevronUp size={18} color={Colors.textTertiary} />
        ) : (
          <ChevronDown size={18} color={Colors.textTertiary} />
        )}
      </View>

      <View style={styles.drugDoseRow}>
        <Pill size={14} color={Colors.accent} />
        <Text style={styles.drugDose}>{drug.dose}</Text>
      </View>

      {expanded && (
        <View style={styles.drugExpanded}>
          <View style={styles.drugDetailRow}>
            <Clock size={13} color={Colors.blue} />
            <Text style={styles.drugDetailLabel}>Onset:</Text>
            <Text style={styles.drugDetailValue}>{drug.onset}</Text>
          </View>
          <View style={styles.drugDetailRow}>
            <Clock size={13} color={Colors.orange} />
            <Text style={styles.drugDetailLabel}>Duration:</Text>
            <Text style={styles.drugDetailValue}>{drug.duration}</Text>
          </View>
          <View style={styles.notesContainer}>
            <AlertTriangle size={13} color={Colors.warning} />
            <Text style={styles.drugNotes}>{drug.notes}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function ReferencesScreen() {
  const [activeTab, setActiveTab] = useState<RefTab>('drugs');
  const [search, setSearch] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredDrugs = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allDrugs;
    return allDrugs.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredAnticoag = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return anticoagulants;
    return anticoagulants.filter(a =>
      a.name.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={18} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search drugs or anticoagulants..."
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'drugs' && styles.tabBtnActive]}
          onPress={() => setActiveTab('drugs')}
        >
          <Pill size={16} color={activeTab === 'drugs' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabBtnText, activeTab === 'drugs' && styles.tabBtnTextActive]}>
            Pharmacology
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'anticoag' && styles.tabBtnActive]}
          onPress={() => setActiveTab('anticoag')}
        >
          <Clock size={16} color={activeTab === 'anticoag' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabBtnText, activeTab === 'anticoag' && styles.tabBtnTextActive]}>
            ASRA / Anticoag
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'drugs' && (
          <>
            <Text style={styles.resultCount}>{filteredDrugs.length} agents</Text>
            {filteredDrugs.map(drug => (
              <DrugCard
                key={drug.id}
                drug={drug}
                expanded={expandedId === drug.id}
                onToggle={() => setExpandedId(prev => prev === drug.id ? null : drug.id)}
              />
            ))}
          </>
        )}

        {activeTab === 'anticoag' && (
          <>
            <Text style={styles.resultCount}>{filteredAnticoag.length} agents</Text>
            {filteredAnticoag.map((agent, idx) => (
              <View key={idx} style={styles.anticoagCard}>
                <Text style={styles.anticoagName}>{agent.name}</Text>
                <View style={styles.anticoagGrid}>
                  <View style={styles.anticoagCell}>
                    <Text style={styles.anticoagLabel}>Hold Time</Text>
                    <Text style={styles.anticoagValue}>{agent.holdTime}</Text>
                  </View>
                  <View style={styles.anticoagCell}>
                    <Text style={styles.anticoagLabel}>Restart</Text>
                    <Text style={styles.anticoagValue}>{agent.restartTime}</Text>
                  </View>
                </View>
                <Text style={styles.anticoagNotes}>{agent.notes}</Text>
                <View style={styles.labRow}>
                  <Text style={styles.labLabel}>Lab Check:</Text>
                  <Text style={styles.labValue}>{agent.labCheck}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={styles.refDisclaimer}>
          <Text style={styles.refDisclaimerText}>
            For educational reference only. Drug doses and ASRA guidelines are subject to change.
            Always verify against current package inserts and society guidelines before clinical use.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
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
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.textInverse,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  resultCount: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 10,
    fontWeight: '500' as const,
  },
  drugCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  drugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drugInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drugName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  drugCatBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  drugCatText: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: '600' as const,
  },
  drugDoseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  drugDose: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  drugExpanded: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  drugDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  drugDetailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  drugDetailValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500' as const,
  },
  notesContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    alignItems: 'flex-start',
  },
  drugNotes: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  anticoagCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  anticoagName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  anticoagGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  anticoagCell: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
  },
  anticoagLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  anticoagValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  anticoagNotes: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  labRow: {
    flexDirection: 'row',
    gap: 6,
  },
  labLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '600' as const,
  },
  labValue: {
    fontSize: 11,
    color: Colors.blue,
    fontWeight: '600' as const,
  },
  bottomSpacer: {
    height: 20,
  },
  refDisclaimer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  refDisclaimerText: {
    fontSize: 11,
    color: Colors.textTertiary,
    lineHeight: 16,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
  },
});
