import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminOverviewScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const r = await adminApi.getOverview();
    if (r.success) setOverview(r.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (loading) return <LoadingSpinner fullScreen />;

  const participationRate = overview?.participation_rate ?? 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSub}>Corporate Administration</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.adminBadge}>
            <Ionicons name="shield" size={14} color={COLORS.accent} />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} colors={[COLORS.accent]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Participation Hero */}
        <View style={styles.participationHero}>
          <View style={styles.participationLeft}>
            <Text style={styles.participationLabel}>Participation Rate</Text>
            <Text style={styles.participationValue}>{participationRate.toFixed(0)}%</Text>
            <Text style={styles.participationSub}>of employees commuting</Text>
          </View>
          <View style={styles.participationChart}>
            <View style={styles.ringOuter}>
              <View style={[styles.ringFill, { opacity: participationRate / 100 }]} />
              <Ionicons name="people" size={24} color={COLORS.accent} style={styles.ringIcon} />
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Employees"
            value={String(overview?.total_employees ?? '—')}
            icon="people"
            iconColor={COLORS.accent}
            style={styles.halfCard}
          />
          <StatCard
            label="Active Users"
            value={String(overview?.active_users ?? '—')}
            icon="person-circle"
            iconColor={COLORS.success}
            style={styles.halfCard}
          />
          <StatCard
            label="Participation"
            value={`${participationRate.toFixed(0)}%`}
            icon="stats-chart"
            iconColor={COLORS.primary}
            style={styles.halfCard}
          />
          <StatCard
            label="Active Rides"
            value={String(overview?.active_rides ?? '—')}
            icon="car"
            iconColor={COLORS.warning}
            style={styles.halfCard}
          />
        </View>

        {/* Department Breakdown */}
        <Card title="Department Participation">
          {(overview?.departments ?? []).map((dept: any, i: number) => {
            const pct = dept.participation ?? 0;
            const color = pct >= 70 ? COLORS.success : pct >= 40 ? COLORS.warning : COLORS.error;
            return (
              <View key={i} style={styles.deptRow}>
                <Text style={styles.deptName} numberOfLines={1}>{dept.name}</Text>
                <View style={styles.deptBarBg}>
                  <View style={[styles.deptBarFill, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
                <View style={[styles.deptPctBadge, { backgroundColor: color + '18' }]}>
                  <Text style={[styles.deptPct, { color }]}>{pct.toFixed(0)}%</Text>
                </View>
              </View>
            );
          })}
          {!(overview?.departments?.length) && (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No department data available</Text>
            </View>
          )}
        </Card>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: COLORS.success }]}>
            <Text style={styles.summaryCardLabel}>Green Commuters</Text>
            <Text style={styles.summaryCardValue}>{overview?.green_commuters ?? '—'}</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: COLORS.accent }]}>
            <Text style={styles.summaryCardLabel}>CO₂ Saved (mo.)</Text>
            <Text style={styles.summaryCardValue}>{overview?.co2_saved_kg ? `${(overview.co2_saved_kg / 1000).toFixed(1)}t` : '—'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  headerLeft: {},
  headerRight: {},
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accent + '12', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: COLORS.accent + '30',
  },
  adminBadgeText: { fontSize: 12, color: COLORS.accent, fontWeight: '700' },

  content: { padding: 16, gap: 16, paddingBottom: 32 },

  // Participation Hero
  participationHero: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  participationLeft: {},
  participationLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  participationValue: { fontSize: 44, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 52 },
  participationSub: { fontSize: 13, color: COLORS.textSecondary },
  participationChart: { alignItems: 'center', justifyContent: 'center' },
  ringOuter: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.accent + '12',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: COLORS.accent + '30',
  },
  ringFill: { position: 'absolute', width: '100%', height: '100%', borderRadius: 36, backgroundColor: COLORS.accent + '20' },
  ringIcon: {},

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  halfCard: { width: '47%' },

  // Department
  deptRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  deptName: { fontSize: 13, color: COLORS.textSecondary, width: 90 },
  deptBarBg: { flex: 1, height: 6, backgroundColor: COLORS.surfaceAlt, borderRadius: 3 },
  deptBarFill: { height: 6, borderRadius: 3 },
  deptPctBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  deptPct: { fontSize: 12, fontWeight: '700', width: 30, textAlign: 'right' },
  emptyState: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14, color: COLORS.textMuted },

  // Summary
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  summaryCardLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  summaryCardValue: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
});
