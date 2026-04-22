import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const REPORT_TYPES = [
  { title: 'CSRD / ESRS E1 Report', description: 'Annual climate disclosure report for regulators', icon: 'shield-checkmark', badge: 'Compliant', badgeVariant: 'success' as const },
  { title: 'Scope 3 Category 7', description: 'Employee commuting emissions inventory', icon: 'document-text', badge: 'Complete', badgeVariant: 'success' as const },
  { title: 'Benchmarking Report', description: 'Industry peer comparison analysis', icon: 'bar-chart', badge: 'Available', badgeVariant: 'info' as const },
  { title: 'DPIA Report', description: 'Data Protection Impact Assessment', icon: 'lock-closed', badge: 'Approved', badgeVariant: 'success' as const },
  { title: 'Revenue Reporting', description: 'Financial impact of sustainability initiatives', icon: 'trending-up', badge: 'Draft', badgeVariant: 'warning' as const },
];

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <Text style={styles.headerSub}>CSRD, ESRS E1, Scope 3 Documentation</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {REPORT_TYPES.map((report, i) => (
          <TouchableOpacity key={i}>
            <Card style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={[styles.reportIcon, { backgroundColor: COLORS.primary + '20' }]}>
                  <Ionicons name={report.icon as any} size={22} color={COLORS.primary} />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDesc}>{report.description}</Text>
                </View>
              </View>
              <View style={styles.reportFooter}>
                <Badge label={report.badge} variant={report.badgeVariant} />
                <TouchableOpacity style={styles.downloadBtn}>
                  <Ionicons name="download-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.downloadText}>Export PDF</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  reportCard: { gap: 12 },
  reportHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  reportIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  reportDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  downloadText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
});
