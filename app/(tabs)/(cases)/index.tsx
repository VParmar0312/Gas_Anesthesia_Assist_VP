import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Calendar, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useCaseLogs } from '@/contexts/CaseLogContext';
import ProgressRing from '@/components/ProgressRing';

export default function CasesScreen() {
  const router = useRouter();
  const { cases, requirements, totalCases, deleteCase } = useCaseLogs();

  const topRequirements = useMemo(() => {
    return requirements
      .filter(r => r.minimum > 0)
      .sort((a, b) => (a.completed / a.minimum) - (b.completed / b.minimum))
      .slice(0, 8);
  }, [requirements]);

  const handleDelete = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    deleteCase(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalCases}</Text>
            <Text style={styles.summaryLabel}>Total Cases</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: Colors.blue }]}>
              {cases.filter(c => c.isEmergency).length}
            </Text>
            <Text style={styles.summaryLabel}>Emergency</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: Colors.purple }]}>
              {new Set(cases.map(c => c.acgmeCategory)).size}
            </Text>
            <Text style={styles.summaryLabel}>Categories</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ACGME Milestones</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressScroll}
        >
          {topRequirements.map((req) => {
            const pct = req.minimum > 0 ? Math.min(req.completed / req.minimum, 1) : 0;
            return (
              <View key={req.id} style={styles.progressCard}>
                <ProgressRing
                  progress={pct}
                  size={60}
                  strokeWidth={5}
                  color={req.color}
                  label={`${req.completed}`}
                />
                <Text style={styles.progressLabel} numberOfLines={2}>
                  {req.subcategory}
                </Text>
                <Text style={[styles.progressMin, { color: req.color }]}>
                  Min: {req.minimum}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recent Cases</Text>
        {cases.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={40} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No cases logged yet</Text>
            <Text style={styles.emptySubtext}>Tap + to log your first case</Text>
          </View>
        ) : (
          cases.slice(0, 20).map((caseItem) => (
            <View key={caseItem.id} style={styles.caseCard}>
              <View style={styles.caseHeader}>
                <View style={styles.caseDate}>
                  <Text style={styles.caseDateText}>{caseItem.date}</Text>
                  {caseItem.isEmergency && (
                    <View style={styles.emergencyBadge}>
                      <Text style={styles.emergencyBadgeText}>E</Text>
                    </View>
                  )}
                </View>
                <Pressable
                  onPress={() => handleDelete(caseItem.id)}
                  hitSlop={10}
                >
                  <Trash2 size={16} color={Colors.textTertiary} />
                </Pressable>
              </View>
              <Text style={styles.caseType}>{caseItem.procedureType}</Text>
              <View style={styles.caseTags}>
                <View style={styles.caseTag}>
                  <Text style={styles.caseTagText}>ASA {caseItem.asaClass}</Text>
                </View>
                <View style={styles.caseTag}>
                  <Text style={styles.caseTagText}>{caseItem.anesthesiaType}</Text>
                </View>
                <View style={[styles.caseTag, { backgroundColor: Colors.accentMuted }]}>
                  <Text style={[styles.caseTagText, { color: Colors.accent }]}>{caseItem.acgmeCategory}</Text>
                </View>
              </View>
              {caseItem.procedures.length > 0 && (
                <Text style={styles.caseProcedures}>
                  {caseItem.procedures.join(', ')}
                </Text>
              )}
            </View>
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/new-case' as any);
        }}
        testID="add-case-fab"
      >
        <Plus size={28} color={Colors.textInverse} strokeWidth={3} />
      </Pressable>
    </View>
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
    paddingBottom: 100,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.accent,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  progressScroll: {
    paddingBottom: 4,
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginRight: 10,
    width: 110,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: 8,
    fontWeight: '500' as const,
  },
  progressMin: {
    fontSize: 11,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  caseCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  caseDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  caseDateText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  emergencyBadge: {
    backgroundColor: Colors.emergency,
    width: 18,
    height: 18,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800' as const,
  },
  caseType: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  caseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  caseTag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  caseTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  caseProcedures: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 8,
  },
  fab: {
    position: 'absolute' as const,
    bottom: 24,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});
