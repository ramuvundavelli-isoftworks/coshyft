import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function ComplianceScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CSRD Compliance</Text>
        <Text style={styles.headerSub}>ESRS E1 · Irish Operations</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Ionicons name="shield-checkmark" size={36} color={COLORS.success} />
          <Text style={styles.heroTitle}>CSRD Compliant</Text>
          <Text style={styles.heroText}>Your Scope 3 Category 7 data meets ESRS E1 requirements for 2026 reporting.</Text>
        </View>

        <Card title="Disclosure Requirements">
          {[
            { req: 'E1-1: Climate transition plan', status: 'complete' },
            { req: 'E1-2: Policies related to climate', status: 'complete' },
            { req: 'E1-3: Actions and resources', status: 'complete' },
            { req: 'E1-4: Targets related to climate', status: 'complete' },
            { req: 'E1-5: Energy consumption', status: 'partial' },
            { req: 'E1-6: Gross Scopes 1, 2, 3 GHG', status: 'complete' },
            { req: 'E1-7: GHG removals and mitigation', status: 'partial' },
            { req: 'E1-8: Internal carbon pricing', status: 'pending' },
            { req: 'E1-9: Anticipated financial effects', status: 'pending' },
          ].map(({ req, status }) => (
            <View key={req} style={styles.reqRow}>
              <Ionicons
                name={status === 'complete' ? 'checkmark-circle' : status === 'partial' ? 'time' : 'ellipse-outline'}
                size={18}
                color={status === 'complete' ? COLORS.success : status === 'partial' ? COLORS.warning : COLORS.textMuted}
              />
              <Text style={styles.reqText}>{req}</Text>
              <Badge
                label={status}
                variant={status === 'complete' ? 'success' : status === 'partial' ? 'warning' : 'default'}
              />
            </View>
          ))}
        </Card>

        <Card title="Data Quality Score">
          <View style={styles.qualityRow}>
            <Text style={styles.qualityValue}>94%</Text>
            <Text style={styles.qualityLabel}>Overall data quality</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '94%' }]} />
          </View>
          <Text style={styles.qualityNote}>Above 90% threshold required for ESRS E1 verification.</Text>
        </Card>

        <Card title="Audit Status">
          <View style={styles.auditInfo}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={styles.auditText}>Last audited: March 2026 · No material findings</Text>
          </View>
          <View style={styles.auditInfo}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.info} />
            <Text style={styles.auditText}>Next audit: September 2026</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  heroCard: { backgroundColor: COLORS.success + '10', borderRadius: 20, padding: 24, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: COLORS.success + '30' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.success },
  heroText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  reqText: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  qualityRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  qualityValue: { fontSize: 36, fontWeight: '800', color: COLORS.success },
  qualityLabel: { fontSize: 14, color: COLORS.textSecondary },
  progressBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: COLORS.success, borderRadius: 4 },
  qualityNote: { fontSize: 12, color: COLORS.textMuted },
  auditInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  auditText: { fontSize: 14, color: COLORS.textSecondary },
});
