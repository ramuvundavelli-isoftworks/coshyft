import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auditorApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const REVIEW_AREAS = [
  { key: 'emissions_status', area: 'Emissions Data', icon: 'cloud' as const },
  { key: 'baseline_status', area: 'Baseline Review', icon: 'git-compare' as const },
  { key: 'factors_status', area: 'Emission Factors', icon: 'calculator' as const },
  { key: 'risks_status', area: 'Risk Assessment', icon: 'warning' as const },
];

export default function AuditorOverviewScreen() {
  const insets = useSafeAreaInsets();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const r = await auditorApi.getOverview();
    if (r.success) setOverview(r.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (loading) return <LoadingSpinner fullScreen />;

  const completionPct = overview?.completion_pct ?? 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Auditor Review</Text>
          <Text style={styles.headerSub}>ESRS E1 · Independent Verification</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="lock-closed" size={13} color={COLORS.warning} />
          <Text style={styles.headerBadgeText}>Auditor</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.warning} colors={[COLORS.warning]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Audit Progress Hero */}
        <View style={styles.progressHero}>
          <View style={styles.progressHeroLeft}>
            <Text style={styles.progressEyebrow}>Annual Audit Progress</Text>
            <Text style={styles.progressValue}>{completionPct}%</Text>
            <Text style={styles.progressSub}>2026 Review · In Progress</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${completionPct}%` }]} />
            </View>
          </View>
          <View style={styles.statusBubble}>
            <Ionicons name="shield-checkmark" size={28} color={COLORS.success} />
            <Text style={styles.statusBubbleText}>Active</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Items Reviewed" value={String(overview?.items_reviewed ?? '—')} icon="checkmark-circle" iconColor={COLORS.success} style={styles.halfCard} />
          <StatCard label="Open Findings" value={String(overview?.open_findings ?? '—')} icon="alert-circle" iconColor={COLORS.error} style={styles.halfCard} />
          <StatCard label="Evidence Items" value={String(overview?.evidence_count ?? '—')} icon="folder" iconColor={COLORS.accent} style={styles.halfCard} />
          <StatCard label="Data Quality" value={`${overview?.data_quality_score ?? '—'}%`} icon="analytics" iconColor={COLORS.primary} style={styles.halfCard} />
        </View>

        {/* Review Areas */}
        <Card title="Review Areas">
          {REVIEW_AREAS.map(({ key, area, icon }, idx) => {
            const status: string = overview?.[key] ?? 'pending';
            const isApproved = status === 'approved';
            const isInReview = status === 'in_review';
            const iconName = isApproved ? 'checkmark-circle' : isInReview ? 'time' : 'ellipse-outline';
            const iconColor = isApproved ? COLORS.success : isInReview ? COLORS.warning : COLORS.textMuted;
            const variant: any = isApproved ? 'success' : isInReview ? 'warning' : 'default';
            const isLast = idx === REVIEW_AREAS.length - 1;

            return (
              <TouchableOpacity key={area} style={[styles.reviewRow, isLast && styles.reviewRowLast]} activeOpacity={0.7}>
                <View style={[styles.reviewIconBg, { backgroundColor: iconColor + '15' }]}>
                  <Ionicons name={icon} size={16} color={iconColor} />
                </View>
                <Text style={styles.reviewArea}>{area}</Text>
                <Badge label={status.replace('_', ' ')} variant={variant} />
                <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Findings Summary */}
        {(overview?.open_findings ?? 0) > 0 && (
          <View style={styles.findingsAlert}>
            <Ionicons name="alert-circle" size={20} color={COLORS.error} />
            <View style={styles.findingsAlertText}>
              <Text style={styles.findingsAlertTitle}>{overview.open_findings} Open Finding{overview.open_findings > 1 ? 's' : ''}</Text>
              <Text style={styles.findingsAlertSub}>Require attention before audit completion</Text>
            </View>
          </View>
        )}
      </ScrollView>
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
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FEF3C7', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  headerBadgeText: { fontSize: 12, color: '#92400E', fontWeight: '700' },

  content: { padding: 16, gap: 16, paddingBottom: 32 },

  // Progress Hero
  progressHero: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  progressHeroLeft: { flex: 1, marginRight: 16 },
  progressEyebrow: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  progressValue: { fontSize: 44, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 52 },
  progressSub: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 },
  progressBarBg: { height: 6, backgroundColor: COLORS.surfaceAlt, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: 6, borderRadius: 3, backgroundColor: COLORS.warning },
  statusBubble: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center', alignItems: 'center', gap: 2,
    borderWidth: 2, borderColor: '#A7F3D0',
  },
  statusBubbleText: { fontSize: 10, fontWeight: '700', color: COLORS.success },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  halfCard: { width: '47%' },

  // Review Areas
  reviewRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  reviewRowLast: { borderBottomWidth: 0 },
  reviewIconBg: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  reviewArea: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },

  // Findings Alert
  findingsAlert: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FEE2E2', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#FECACA',
  },
  findingsAlertText: {},
  findingsAlertTitle: { fontSize: 15, fontWeight: '700', color: '#991B1B' },
  findingsAlertSub: { fontSize: 12, color: '#B91C1C', marginTop: 2 },
});
