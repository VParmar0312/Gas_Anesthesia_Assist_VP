import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { Search, ChevronDown, ChevronUp, Clock, Pill, AlertTriangle, Zap, Info, Activity } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { allDrugs, anticoagulants } from '@/mocks/drugs';
import { Drug } from '@/types/anesthesia';

type RefTab = 'drugs' | 'anticoag' | 'labs';

// Color-code left border by drug category
function getCategoryColor(category: string): string {
  switch (category) {
    case 'Induction': return Colors.blue;
    case 'Sedation': return Colors.purple;
    case 'Opioid': return Colors.orange;
    case 'Neuromuscular Blocker': return '#AF52DE';
    case 'Vasopressor': return Colors.emergency;
    case 'Inotrope': return '#FF6B35';
    case 'Antihypertensive': return Colors.blue;
    case 'Cardiovascular': return Colors.blue;
    case 'Antiarrhythmic': return Colors.warning;
    case 'Anticholinergic': return Colors.accent;
    case 'Reversal': return Colors.success;
    case 'Volatile': return Colors.accent;
    case 'Antiemetic': return '#30D158';
    case 'Hemostatic': return Colors.emergency;
    case 'Emergency': return Colors.emergency;
    case 'Analgesic': return Colors.orange;
    case 'Bronchodilator': return Colors.blue;
    default: return Colors.border;
  }
}

function getCategoryMutedColor(category: string): string {
  const color = getCategoryColor(category);
  // Return a muted version
  switch (category) {
    case 'Induction': return Colors.blueMuted;
    case 'Sedation': return Colors.purpleMuted;
    case 'Opioid': return Colors.orangeMuted;
    case 'Neuromuscular Blocker': return Colors.purpleMuted;
    case 'Vasopressor': return Colors.emergencyMuted;
    case 'Inotrope': return 'rgba(255, 107, 53, 0.12)';
    case 'Antihypertensive': return Colors.blueMuted;
    case 'Cardiovascular': return Colors.blueMuted;
    case 'Antiarrhythmic': return Colors.warningMuted;
    case 'Anticholinergic': return Colors.accentMuted;
    case 'Reversal': return Colors.successMuted;
    case 'Volatile': return Colors.accentMuted;
    case 'Antiemetic': return 'rgba(48, 209, 88, 0.12)';
    case 'Hemostatic': return Colors.emergencyMuted;
    case 'Emergency': return Colors.emergencyMuted;
    case 'Analgesic': return Colors.orangeMuted;
    case 'Bronchodilator': return Colors.blueMuted;
    default: return Colors.surface;
  }
}

function DrugCard({ drug, expanded, onToggle }: { drug: Drug; expanded: boolean; onToggle: () => void }) {
  const catColor = getCategoryColor(drug.category);
  const catMuted = getCategoryMutedColor(drug.category);

  return (
    <Pressable
      style={[styles.drugCard, { borderLeftColor: catColor }]}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
    >
      <View style={styles.drugHeader}>
        <View style={styles.drugInfo}>
          <Text style={styles.drugName}>{drug.name}</Text>
          <View style={[styles.drugCatBadge, { backgroundColor: catMuted }]}>
            <Text style={[styles.drugCatText, { color: catColor }]}>{drug.category}</Text>
          </View>
        </View>
        {expanded ? <ChevronUp size={18} color={Colors.textTertiary} /> : <ChevronDown size={18} color={Colors.textTertiary} />}
      </View>

      <View style={styles.drugDoseRow}>
        <Pill size={13} color={catColor} />
        <Text style={[styles.drugDose, { color: catColor }]}>{drug.dose}</Text>
      </View>

      {expanded && (
        <View style={styles.drugExpanded}>
          {drug.mechanism && (
            <View style={styles.drugDetailRow}>
              <Zap size={13} color={Colors.accent} />
              <Text style={styles.drugDetailLabel}>Mechanism:</Text>
              <Text style={[styles.drugDetailValue, { flex: 1 }]}>{drug.mechanism}</Text>
            </View>
          )}

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

          {drug.pediatricDose && (
            <View style={styles.drugDetailRow}>
              <Info size={13} color={Colors.blue} />
              <Text style={styles.drugDetailLabel}>Peds dose:</Text>
              <Text style={[styles.drugDetailValue, { flex: 1 }]}>{drug.pediatricDose}</Text>
            </View>
          )}

          {drug.contraindications && (
            <View style={[styles.contraCard, { borderColor: Colors.emergencyMuted }]}>
              <View style={styles.contraHeader}>
                <AlertTriangle size={12} color={Colors.emergency} />
                <Text style={styles.contraTitle}>Contraindications</Text>
              </View>
              <Text style={styles.contraText}>{drug.contraindications}</Text>
            </View>
          )}

          {drug.interactions && (
            <View style={[styles.contraCard, { borderColor: Colors.warningMuted }]}>
              <View style={styles.contraHeader}>
                <AlertTriangle size={12} color={Colors.warning} />
                <Text style={[styles.contraTitle, { color: Colors.warning }]}>Key Interactions</Text>
              </View>
              <Text style={styles.contraText}>{drug.interactions}</Text>
            </View>
          )}

          <View style={styles.notesContainer}>
            <Text style={styles.drugNotes}>{drug.notes}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

// Group drugs by category for section headers
function groupByCategory(drugs: Drug[]): { category: string; drugs: Drug[] }[] {
  const map = new Map<string, Drug[]>();
  for (const drug of drugs) {
    if (!map.has(drug.category)) map.set(drug.category, []);
    map.get(drug.category)!.push(drug);
  }
  return Array.from(map.entries()).map(([category, drugs]) => ({ category, drugs }));
}

// ─── ABG / Labs reference data ───────────────────────────────────────────────

const ABG_STEPS = [
  {
    step: '1. pH',
    normal: '7.35–7.45',
    interpretation: [
      { condition: '< 7.35', result: 'Acidosis' },
      { condition: '> 7.45', result: 'Alkalosis' },
    ],
  },
  {
    step: '2. PaCO₂ (respiratory)',
    normal: '35–45 mmHg',
    interpretation: [
      { condition: '> 45 + acidosis', result: 'Respiratory Acidosis (hypoventilation)' },
      { condition: '< 35 + alkalosis', result: 'Respiratory Alkalosis (hyperventilation)' },
    ],
  },
  {
    step: '3. HCO₃⁻ (metabolic)',
    normal: '22–26 mEq/L',
    interpretation: [
      { condition: '< 22 + acidosis', result: 'Metabolic Acidosis' },
      { condition: '> 26 + alkalosis', result: 'Metabolic Alkalosis' },
    ],
  },
  {
    step: '4. Compensation',
    normal: 'Expected compensation',
    interpretation: [
      { condition: 'Met acidosis → resp', result: 'PaCO₂ = 1.5×HCO₃ + 8 ± 2 (Winter\'s)' },
      { condition: 'Met alkalosis → resp', result: 'PaCO₂ = 0.7×HCO₃ + 21 ± 2' },
      { condition: 'Resp acidosis (acute)', result: 'HCO₃ rises 1 per 10 mmHg ↑PaCO₂' },
      { condition: 'Resp acidosis (chronic)', result: 'HCO₃ rises 3.5 per 10 mmHg ↑PaCO₂' },
    ],
  },
];

const LAB_SECTIONS = [
  {
    title: 'Electrolytes — Critical Values',
    color: Colors.emergency,
    items: [
      { label: 'Sodium (Na⁺)', normal: '136–145 mEq/L', critical: '<120 or >160', notes: 'Hyponatremia: seizure risk <120. SIADH vs DI vs dehydration.' },
      { label: 'Potassium (K⁺)', normal: '3.5–5.0 mEq/L', critical: '<2.5 or >6.5', notes: 'Hyperkalemia → peaked T waves, wide QRS, VF. Succinylcholine raises K+ ~0.5 mEq/L.' },
      { label: 'Calcium ionized (iCa²⁺)', normal: '1.1–1.35 mmol/L', critical: '<0.8 or >1.6', notes: 'Hypocalcemia: tetany, QTc prolongation, depressed inotropy. Per 4 units blood transfused.' },
      { label: 'Magnesium (Mg²⁺)', normal: '1.7–2.2 mg/dL', critical: '<1.0 or >4.9', notes: 'Hypomagnesemia causes refractory hypokalemia. >4.9: loss of DTRs → respiratory arrest.' },
      { label: 'Phosphate (PO₄)', normal: '2.5–4.5 mg/dL', critical: '<1.0', notes: 'Severe hypophosphatemia: respiratory muscle weakness, hemolysis, encephalopathy.' },
    ],
  },
  {
    title: 'Hematology',
    color: Colors.emergency,
    items: [
      { label: 'Hemoglobin (Hgb)', normal: 'Male: 13.5–17.5 g/dL | Female: 12–16 g/dL', critical: '<7 g/dL (transfusion threshold)', notes: 'Transfuse if Hgb <7 (most patients) or <8 (cardiac/poor reserve). Consider symptoms and EBL.' },
      { label: 'Hematocrit (Hct)', normal: 'Male: 41–53% | Female: 36–46%', critical: '<21%', notes: 'Hgb ≈ Hct/3. Minimum acceptable Hct typically 20–25% depending on patient factors.' },
      { label: 'Platelets', normal: '150,000–400,000 /μL', critical: '<50,000 (bleeding risk), <100,000 (neuraxial)', notes: 'Neuraxial anesthesia: >100k recommended. Active bleeding: >50k minimum. Platelet transfusion if <50k + bleeding.' },
      { label: 'WBC', normal: '4,500–11,000 /μL', critical: '<1,000 (neutropenia)', notes: 'Leukocytosis >15k suggests systemic infection. Neutropenia <1k: high infection risk.' },
    ],
  },
  {
    title: 'Coagulation',
    color: Colors.warning,
    items: [
      { label: 'INR (PT ratio)', normal: '0.8–1.2', critical: '>3.0 (spontaneous bleeding)', notes: 'Neuraxial: INR <1.5 (ASRA). Warfarin reversal: Vitamin K + 4F-PCC or FFP.' },
      { label: 'aPTT', normal: '25–35 sec', critical: '>70 sec', notes: 'Heparin monitoring. Therapeutic aPTT: 60–100 sec. Normal aPTT required before neuraxial.' },
      { label: 'Fibrinogen', normal: '200–400 mg/dL', critical: '<100 mg/dL (critical)', notes: 'MTP goal: fibrinogen >150 mg/dL. Treat with cryoprecipitate (each unit raises ~10 mg/dL). DIC: fibrinogen drops.' },
      { label: 'Anti-Xa level (LMWH)', normal: 'Therapeutic: 0.6–1.0 IU/mL (BID)', critical: '>1.5 IU/mL', notes: 'Useful in obesity, renal failure, pregnancy. Prophylactic target: 0.2–0.5 IU/mL.' },
    ],
  },
  {
    title: 'Renal Function',
    color: Colors.blue,
    items: [
      { label: 'Creatinine (Cr)', normal: 'Male: 0.7–1.3 mg/dL | Female: 0.5–1.1 mg/dL', critical: 'AKI if rise ≥0.3 mg/dL in 48h', notes: 'eGFR <30: avoid NSAIDs, nephrotoxins, LMWH accumulation risk, renally-cleared NMBAs.' },
      { label: 'BUN', normal: '7–25 mg/dL', critical: '>100 mg/dL (uremia)', notes: 'BUN:Cr ratio >20: pre-renal. BUN:Cr <10: intrinsic renal or low protein intake.' },
      { label: 'eGFR', normal: '>60 mL/min/1.73m²', critical: '<15 mL/min (dialysis threshold)', notes: 'Adjust drug dosing for CrCl. Dabigatran: avoid if CrCl <30. Sugammadex complex: renally cleared.' },
      { label: 'Urine output', normal: '0.5–1 mL/kg/hr', critical: '<0.5 mL/kg/hr for >6h = AKI criterion', notes: 'Goal >1 mL/kg/hr intraoperatively for high-risk cases. Foley mandatory for >2h procedures.' },
    ],
  },
  {
    title: 'Liver Function',
    color: Colors.orange,
    items: [
      { label: 'ALT / AST', normal: '<40 U/L', critical: '>10× normal = acute hepatitis', notes: 'Elevated in hepatotoxicity (halothane — historical, propofol rare, acetaminophen OD). Affects drug metabolism.' },
      { label: 'Total Bilirubin', normal: '<1.2 mg/dL', critical: '>10 mg/dL (severe)', notes: 'Conjugated (direct) = biliary obstruction. Unconjugated = hemolysis or liver failure.' },
      { label: 'Albumin', normal: '3.5–5.0 g/dL', critical: '<2.5 g/dL (severe hypoalbuminemia)', notes: 'Low albumin: increased free fraction of protein-bound drugs (propofol, bupivacaine, fentanyl). Reduce doses.' },
      { label: 'Cholinesterase (pseudocholinesterase)', normal: '2000–4000 U/L', critical: 'Low = prolonged succinylcholine effect', notes: 'Dibucaine number: normal >70%, heterozygous 40–60%, homozygous <30%. Prolonged sux block if homozygous.' },
    ],
  },
  {
    title: 'Cardiac Biomarkers',
    color: Colors.emergency,
    items: [
      { label: 'Troponin I/T (hs)', normal: 'hs-TnI: <26 ng/L (male), <16 ng/L (female)', critical: 'Any rise = myocardial injury', notes: 'Periop MI: MINS (Myocardial Injury after Noncardiac Surgery). Rises 3–6h, peaks 12–24h. Doubles in acute MI.' },
      { label: 'BNP / NT-proBNP', normal: 'BNP <100 pg/mL | NT-proBNP <125 pg/mL (<75yr)', critical: 'BNP >400 = HF likely', notes: 'Elevated preop: high periop cardiac risk. Rises with volume overload. Renal failure raises NT-proBNP independently.' },
      { label: 'CK-MB', normal: '<5% of total CK', critical: '>5% fraction = myocardial source', notes: 'Less specific than troponin. Useful for myocardial infarction timing in troponin-already-elevated patients.' },
    ],
  },
];

function LabsContent() {
  const [expandedABG, setExpandedABG] = useState(true);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  return (
    <View>
      {/* ABG Interpretation */}
      <Pressable
        style={styles.labSectionHeader}
        onPress={() => setExpandedABG(v => !v)}
      >
        <Activity size={16} color={Colors.accent} />
        <Text style={styles.labSectionTitle}>ABG Interpretation — Step-by-Step</Text>
        {expandedABG ? <ChevronUp size={16} color={Colors.textTertiary} /> : <ChevronDown size={16} color={Colors.textTertiary} />}
      </Pressable>

      {expandedABG && (
        <View style={styles.abgCard}>
          {ABG_STEPS.map((step, idx) => (
            <View key={idx} style={[styles.abgStep, idx < ABG_STEPS.length - 1 && styles.abgStepBorder]}>
              <View style={styles.abgStepHeader}>
                <View style={styles.abgStepNum}>
                  <Text style={styles.abgStepNumText}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.abgStepTitle}>{step.step}</Text>
                  <Text style={styles.abgNormal}>Normal: {step.normal}</Text>
                </View>
              </View>
              {step.interpretation.map((interp, iIdx) => (
                <View key={iIdx} style={styles.abgInterpRow}>
                  <Text style={styles.abgCondition}>{interp.condition}</Text>
                  <Text style={styles.abgResult}>→ {interp.result}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Lab Value Sections */}
      {LAB_SECTIONS.map((section, sIdx) => (
        <View key={sIdx}>
          <Pressable
            style={[styles.labSectionHeader, { borderLeftColor: section.color, borderLeftWidth: 3 }]}
            onPress={() => setExpandedSection(prev => prev === sIdx ? null : sIdx)}
          >
            <Text style={[styles.labSectionTitle, { color: section.color }]}>{section.title}</Text>
            {expandedSection === sIdx
              ? <ChevronUp size={16} color={Colors.textTertiary} />
              : <ChevronDown size={16} color={Colors.textTertiary} />}
          </Pressable>

          {expandedSection === sIdx && (
            <View style={styles.labItemsCard}>
              {section.items.map((item, iIdx) => (
                <View key={iIdx} style={[styles.labItem, iIdx < section.items.length - 1 && styles.labItemBorder]}>
                  <Text style={styles.labItemName}>{item.label}</Text>
                  <View style={styles.labItemRow}>
                    <Text style={styles.labNormalLabel}>Normal</Text>
                    <Text style={[styles.labNormalValue, { color: Colors.success }]}>{item.normal}</Text>
                  </View>
                  <View style={styles.labItemRow}>
                    <Text style={styles.labNormalLabel}>Critical</Text>
                    <Text style={[styles.labNormalValue, { color: Colors.emergency }]}>{item.critical}</Text>
                  </View>
                  <Text style={styles.labItemNotes}>{item.notes}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
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
      d.category.toLowerCase().includes(q) ||
      d.notes.toLowerCase().includes(q) ||
      (d.mechanism && d.mechanism.toLowerCase().includes(q))
    );
  }, [search]);

  const filteredAnticoag = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return anticoagulants;
    return anticoagulants.filter(a => a.name.toLowerCase().includes(q));
  }, [search]);

  const groupedDrugs = useMemo(() => {
    if (search.trim()) return null; // flat list when searching
    return groupByCategory(filteredDrugs);
  }, [filteredDrugs, search]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={18} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search drugs, category, mechanism..."
          placeholderTextColor={Colors.textTertiary}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'drugs' && styles.tabBtnActive]}
          onPress={() => setActiveTab('drugs')}
        >
          <Pill size={14} color={activeTab === 'drugs' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabBtnText, activeTab === 'drugs' && styles.tabBtnTextActive]}>Drugs</Text>
          <View style={[styles.countBadge, activeTab === 'drugs' && styles.countBadgeActive]}>
            <Text style={[styles.countBadgeText, activeTab === 'drugs' && styles.countBadgeTextActive]}>{allDrugs.length}</Text>
          </View>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'anticoag' && styles.tabBtnActive]}
          onPress={() => setActiveTab('anticoag')}
        >
          <Clock size={14} color={activeTab === 'anticoag' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabBtnText, activeTab === 'anticoag' && styles.tabBtnTextActive]}>Anticoag</Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'labs' && styles.tabBtnActive]}
          onPress={() => setActiveTab('labs')}
        >
          <Activity size={14} color={activeTab === 'labs' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabBtnText, activeTab === 'labs' && styles.tabBtnTextActive]}>Labs / ABG</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'drugs' && (
          <>
            {search.trim() ? (
              <>
                <Text style={styles.resultCount}>{filteredDrugs.length} result{filteredDrugs.length !== 1 ? 's' : ''}</Text>
                {filteredDrugs.map(drug => (
                  <DrugCard
                    key={drug.id}
                    drug={drug}
                    expanded={expandedId === drug.id}
                    onToggle={() => setExpandedId(prev => prev === drug.id ? null : drug.id)}
                  />
                ))}
              </>
            ) : (
              groupedDrugs?.map(group => (
                <View key={group.category}>
                  <View style={styles.categoryHeader}>
                    <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(group.category) }]} />
                    <Text style={[styles.categoryTitle, { color: getCategoryColor(group.category) }]}>
                      {group.category}
                    </Text>
                    <Text style={styles.categoryCount}>{group.drugs.length} agents</Text>
                  </View>
                  {group.drugs.map(drug => (
                    <DrugCard
                      key={drug.id}
                      drug={drug}
                      expanded={expandedId === drug.id}
                      onToggle={() => setExpandedId(prev => prev === drug.id ? null : drug.id)}
                    />
                  ))}
                </View>
              ))
            )}
          </>
        )}

        {activeTab === 'labs' && <LabsContent />}

        {activeTab === 'anticoag' && (
          <>
            <Text style={styles.resultCount}>{filteredAnticoag.length} agents</Text>
            {filteredAnticoag.map((agent, idx) => (
              <View key={idx} style={styles.anticoagCard}>
                <Text style={styles.anticoagName}>{agent.name}</Text>
                <View style={styles.anticoagGrid}>
                  <View style={[styles.anticoagCell, { borderColor: Colors.emergencyMuted }]}>
                    <Text style={styles.anticoagLabel}>Hold Before</Text>
                    <Text style={[styles.anticoagValue, { color: Colors.emergency }]}>{agent.holdTime}</Text>
                  </View>
                  <View style={[styles.anticoagCell, { borderColor: Colors.successMuted }]}>
                    <Text style={styles.anticoagLabel}>Restart After</Text>
                    <Text style={[styles.anticoagValue, { color: Colors.success }]}>{agent.restartTime}</Text>
                  </View>
                </View>
                <Text style={styles.anticoagNotes}>{agent.notes}</Text>
                <View style={styles.labRow}>
                  <Clock size={12} color={Colors.blue} />
                  <Text style={styles.labLabel}>Lab Check:</Text>
                  <Text style={styles.labValue}>{agent.labCheck}</Text>
                </View>
              </View>
            ))}
            <View style={styles.asraNote}>
              <Text style={styles.asraNoteTitle}>ASRA 2018 Guidelines</Text>
              <Text style={styles.asraNoteText}>Hold times are minimum intervals before neuraxial anesthesia. Clinical judgment required based on procedure, coagulation status, and individual risk factors. When in doubt, obtain specialist consultation.</Text>
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 15, color: Colors.textPrimary },
  clearBtn: { fontSize: 16, color: Colors.textTertiary, paddingHorizontal: 4 },
  tabRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginVertical: 12 },
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
  tabBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabBtnText: { fontSize: 13, fontWeight: '700' as const, color: Colors.textSecondary },
  tabBtnTextActive: { color: Colors.textInverse },
  countBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeActive: { backgroundColor: 'rgba(8,9,14,0.3)' },
  countBadgeText: { fontSize: 10, fontWeight: '700' as const, color: Colors.textTertiary },
  countBadgeTextActive: { color: Colors.textInverse },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  resultCount: { fontSize: 12, color: Colors.textTertiary, marginBottom: 10, fontWeight: '500' as const },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  categoryTitle: { fontSize: 12, fontWeight: '800' as const, textTransform: 'uppercase', letterSpacing: 0.8, flex: 1 },
  categoryCount: { fontSize: 11, color: Colors.textTertiary },
  drugCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
  },
  drugHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  drugInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  drugName: { fontSize: 16, fontWeight: '700' as const, color: Colors.textPrimary },
  drugCatBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  drugCatText: { fontSize: 10, fontWeight: '700' as const, textTransform: 'uppercase', letterSpacing: 0.3 },
  drugDoseRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 8 },
  drugDose: { fontSize: 13, fontWeight: '600' as const, flex: 1, lineHeight: 18 },
  drugExpanded: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  drugDetailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 7 },
  drugDetailLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '700' as const },
  drugDetailValue: { fontSize: 12, color: Colors.textPrimary, fontWeight: '500' as const },
  contraCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: Colors.surface,
  },
  contraHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  contraTitle: { fontSize: 11, fontWeight: '700' as const, color: Colors.emergency, textTransform: 'uppercase', letterSpacing: 0.4 },
  contraText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  notesContainer: { marginTop: 4 },
  drugNotes: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  anticoagCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  anticoagName: { fontSize: 15, fontWeight: '700' as const, color: Colors.textPrimary, marginBottom: 10 },
  anticoagGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  anticoagCell: { flex: 1, backgroundColor: Colors.surface, borderRadius: 10, padding: 10, borderWidth: 1 },
  anticoagLabel: { fontSize: 10, color: Colors.textTertiary, fontWeight: '600' as const, textTransform: 'uppercase', marginBottom: 4 },
  anticoagValue: { fontSize: 13, fontWeight: '700' as const },
  anticoagNotes: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  labRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  labLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600' as const },
  labValue: { fontSize: 12, color: Colors.blue, fontWeight: '600' as const },
  asraNote: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.blueMuted,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue,
  },
  asraNoteTitle: { fontSize: 13, fontWeight: '700' as const, color: Colors.blue, marginBottom: 6 },
  asraNoteText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  bottomSpacer: { height: 20 },
  // Labs
  labSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  labSectionTitle: { fontSize: 14, fontWeight: '700' as const, color: Colors.textPrimary, flex: 1 },
  abgCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accentMuted,
    marginBottom: 8,
  },
  abgStep: { paddingBottom: 14, marginBottom: 14 },
  abgStepBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  abgStepHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  abgStepNum: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.accentMuted,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  abgStepNumText: { fontSize: 13, fontWeight: '800' as const, color: Colors.accent },
  abgStepTitle: { fontSize: 14, fontWeight: '700' as const, color: Colors.textPrimary },
  abgNormal: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  abgInterpRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 36, marginBottom: 4 },
  abgCondition: { fontSize: 12, color: Colors.textSecondary, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', flex: 0, minWidth: 110 },
  abgResult: { fontSize: 12, color: Colors.textPrimary, flex: 1 },
  labItemsCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  labItem: { paddingVertical: 12 },
  labItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 12 },
  labItemName: { fontSize: 14, fontWeight: '700' as const, color: Colors.textPrimary, marginBottom: 6 },
  labItemRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  labNormalLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600' as const, width: 50, textTransform: 'uppercase' as const },
  labNormalValue: { fontSize: 12, fontWeight: '600' as const, flex: 1 },
  labItemNotes: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginTop: 4 },
});
