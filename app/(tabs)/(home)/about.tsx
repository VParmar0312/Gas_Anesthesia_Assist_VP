import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { ExternalLink, Shield, BookOpen, Mail } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

const PRIVACY_URL = 'https://vparmar0312.github.io/rork-anesthassist--medical-suite/privacy-policy.html';
const SUPPORT_URL = 'https://vparmar0312.github.io/rork-anesthassist--medical-suite/support.html';
const CONTACT_EMAIL = 'vparmar0312@gmail.com';

function LinkRow({
  label,
  url,
  icon,
}: {
  label: string;
  url: string;
  icon: React.ReactNode;
}) {
  const handlePress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };
  return (
    <Pressable style={styles.linkRow} onPress={handlePress}>
      <View style={styles.linkIcon}>{icon}</View>
      <Text style={styles.linkLabel}>{label}</Text>
      <ExternalLink size={16} color={Colors.textTertiary} />
    </Pressable>
  );
}

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About AnesthAssist</Text>
        <Text style={styles.body}>
          AnesthAssist is an educational reference tool designed for licensed anesthesiology
          residents and attending physicians. It provides quick access to pre-flight checklists,
          reference calculators, emergency protocol summaries, pharmacology references, and
          ACGME case logging.
        </Text>
      </View>

      <View style={styles.disclaimerBox}>
        <View style={styles.disclaimerHeader}>
          <Shield size={18} color={Colors.accent} />
          <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
        </View>
        <Text style={styles.disclaimerBody}>
          This app is intended for use by trained anesthesiology professionals only.
        </Text>
        <Text style={styles.disclaimerBody}>
          All content is provided for <Text style={styles.bold}>educational and reference
          purposes only</Text>. This app is NOT a substitute for clinical judgment, institutional
          protocols, or package insert guidance.
        </Text>
        <Text style={styles.disclaimerBody}>
          This app is <Text style={styles.bold}>NOT FDA-cleared</Text> and should NOT be used
          for clinical decision support or patient diagnosis.
        </Text>
        <Text style={[styles.disclaimerBody, { marginBottom: 0 }]}>
          Always verify drug doses and protocols with authoritative sources before clinical use.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Data</Text>
        <Text style={styles.body}>
          All case logs, checklist state, and calculator inputs are stored locally on your device
          only. No data is transmitted to any server. No personal or patient information is
          collected.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal &amp; Support</Text>
        <View style={styles.linksCard}>
          <LinkRow
            label="Privacy Policy"
            url={PRIVACY_URL}
            icon={<BookOpen size={18} color={Colors.accent} />}
          />
          <View style={styles.divider} />
          <LinkRow
            label="Support &amp; FAQ"
            url={SUPPORT_URL}
            icon={<ExternalLink size={18} color={Colors.blue} />}
          />
          <View style={styles.divider} />
          <LinkRow
            label="Contact Us"
            url={`mailto:${CONTACT_EMAIL}`}
            icon={<Mail size={18} color={Colors.purple} />}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>AnesthAssist v1.0 · For licensed professionals only</Text>
        <Text style={styles.footerText}>&copy; 2026 AnesthAssist</Text>
      </View>
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
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  disclaimerBox: {
    backgroundColor: Colors.accentMuted,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  disclaimerHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 12,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  disclaimerBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  linksCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden' as const,
  },
  linkRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  linkIcon: {
    width: 30,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  linkLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  footer: {
    alignItems: 'center' as const,
    paddingTop: 12,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
