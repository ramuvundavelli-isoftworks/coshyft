import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { emissionsApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function SustainabilityOverviewScreen() {
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const result = await emissionsApi.getSummary(2026);
    if (result.success) setSummary(result.data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  if (loading) return <LoadingSpinner fullScreen />;

  const yoy = summary?.yoy_change_percent;
  const isImproving = yoy !== undefined && yoy < 0;
  const totalTco2 = summary?.total_emissions_kg ? (summary.total_emissions_kg / 1000).toFixed(1) : '—';
  const targetTco2 = summary?.target_emissions_kg ? (summary.target_emissions_kg / 1000).toFixed(1) : null;
  const progressPct = summary?.target_emissions_kg
    ? Math.min((summary.total_emissions_kg / summary.target_emissions_kg) * 100, 100)
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sustainability</Text>
          <Text style={styles.headerSub}>2026 · Scope 3 Category 7 · ESRS E1</Text>
        </View>
        <Badge label="CSRD Live" variant="success" />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Emissions Hero */}
        <View style={styles.emissionHero}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconBg}>
              <Ionicons name="cloud-outline" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.heroEyebrow}>Total Emissions</Text>
          </View>
          <Text style={styles.heroValue}>{totalTco2}</Text>
          <Text style={styles.heroUnit}>tCO₂e this year</Text>
          {yoy !== undefined && (
            <View style={[styles.yoyPill, { backgroundColor: isImproving ? '#D1FAE5' : '#FEE2E2' }]}>
              <Ionicons
                name={isImproving ? 'trending-down' : 'trending-up'}
                size={14}
                color={isImproving ? COLORS.success : COLORS.error}
              />
              <Text style={[styles.yoyText, { color: isImproving ? COLORS.success : COLORS.error }]}>
                {Math.abs(yoy).toFixed(1)}% YoY {isImproving ? 'reduction' : 'increase'}
              </Text>
            </View>
          )}
        </View>

        {/* KPI Grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Participation" value={`${summary?.participation_rate?.toFixed(0) ?? '—'}%`} icon="people" iconColor={COLORS.accent} style={styles.halfCard} />
          <StatCard label="Data Quality" value={`${summary?.data_quality_score?.toFixed(0) ?? '—'}%`} icon="shield-checkmark" iconColor={COLORS.success} style={styles.halfCard} />
          <StatCard label="Total Commutes" value={String(summary?.total_commutes ?? '—')} icon="bicycle" iconColor={COLORS.warning} style={styles.halfCard} />
          <StatCard label="Intensity" value={summary?.emission_intensity?.toFixed(3) ?? '—'} unit="kg/km" icon="analytics" iconColor={COLORS.info} style={styles.halfCard} />
        </View>

        {/* Target Progress */}
        {targetTco2 && (
          <Card>
            <View style={styles.targetHeader}>
              <Ionicons name="flag" size={16} color={COLORS.warning} />
              <Text style={styles.targetTitle}>Reduction Target</Text>
              <Badge label={summary?.gap_to_target > 0 ? 'Off Track' : 'On Track'} variant={summary?.gap_to_target > 0 ? 'error' : 'success'} />
            </View>
            <View style={styles.targetNumbers}>
              <View>
                <Text style={styles.targetNumLabel}>Current</Text>
                <Text style={styles.targetNumValue}>{totalTco2} tCO₂e</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.targetNumLabel}>Target</Text>
                <Text style={styles.targetNumValue}>{targetTco2} tCO₂e</Text>
              </View>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, {
                width: `${progressPct}%`,
                backgroundColor: summary?.gap_to_target > 0 ? COLORS.error : COLORS.success,
              }]} />
            </View>
            <Text style={styles.progressLabel}>{progressPct.toFixed(0)}% of target used</Text>
          </Card>
        )}

        {/* Compliance Status */}
        <Card title="Compliance Status">
          <ComplianceRow label="CSRD Article 29" status="compliant" />
          <ComplianceRow label="ESRS E1 Climate Change" status="compliant" />
          <ComplianceRow label="Scope 3 Category 7" status="compliant" />
          <ComplianceRow label="SEAI 2024 Emission Factors" status="compliant" />
          <ComplianceRow label="GDPR Data Processing" status="compliant" last />
        </Card>
      </ScrollView>
    </View>
  );
}

function ComplianceRow({ label, status, last }: { label: string; status: 'compliant' | 'pending' | 'issue'; last?: boolean }) {
  const colors = { compliant: COLORS.success, pending: COLORS.warning, issue: COLORS.error };
  const icons: Record<string, any> = { compliant: 'checkmark-circle', pending: 'time', issue: 'alert-circle' };
  const variants: Record<string, any> = { compliant: 'success', pending: 'warning', issue: 'error' };
  return (
    <View style={[styles.complianceRow, last && styles.complianceRowLast]}>
      <Ionicons name={icons[status]} size={18} color={colors[status]} />
      <Text style={styles.complianceLabel}>{label}</Text>
      <Badge label={status} variant={variants[status]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  content: { padding: 16, gap: 16, paddingBottom: 32 },

  // Emissions Hero
  emissionHero: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20, padding: 24,
    alignItems: 'center',
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  heroIconBg: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center', alignItems: 'center',
  },
  heroEyebrow: { fontSize: 13, color: COLORS.success, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroValue: { fontSize: 56, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 64 },
  heroUnit: { fontSize: 15, color: COLORS.textSecondary, marginTop: 2 },
  yoyPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginTop: 12,
  },
  yoyText: { fontSize: 13, fontWeight: '700' },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  halfCard: { width: '47%' },

  // Target
  targetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  targetTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  targetNumbers: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  targetNumLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  targetNumValue: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  progressBg: { height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, marginBottom: 6, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  progressLabel: { fontSize: 12, color: COLORS.textMuted, textAlign: 'right' },

  // Compliance
  complianceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  complianceRowLast: { borderBottomWidth: 0 },
  complianceLabel: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
});
