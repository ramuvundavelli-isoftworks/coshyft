import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { commuteApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MyImpactScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<any>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [statsRes, monthlyRes] = await Promise.all([
      commuteApi.getStats(),
      commuteApi.getMonthlyStats(),
    ]);
    if (statsRes.success) setStats(statsRes.data);
    if (monthlyRes.success) setMonthly(monthlyRes.data as any[] ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading your impact..." />;

  const equivalentTrees = stats ? Math.round(stats.co2_saved_vs_car / 21.77) : 0;
  const equivalentKm = stats ? Math.round(stats.co2_saved_vs_car / 0.168) : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Impact</Text>
        <Text style={styles.headerSub}>Your personal Scope 3 contribution</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Hero Impact Number */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="leaf" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.heroValue}>{stats?.co2_saved_vs_car?.toFixed(1) ?? '0'}</Text>
          <Text style={styles.heroUnit}>kg CO₂ saved vs. driving alone</Text>
          <Text style={styles.heroSub}>Based on SEAI 2024 petrol car baseline (0.168 kg/km)</Text>
        </View>

        {/* Equivalents */}
        <Card title="That's equivalent to...">
          <View style={styles.equivalents}>
            <EquivalentItem icon="leaf" value={equivalentTrees} label="trees absorbing CO₂ for a year" color={COLORS.success} />
            <EquivalentItem icon="car" value={equivalentKm} label="km not driven by car" color={COLORS.error} />
            <EquivalentItem icon="phone-portrait" value={Math.round((stats?.co2_saved_vs_car ?? 0) * 121)} label="smartphone charges" color={COLORS.accent} />
          </View>
        </Card>

        {/* Key Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Commutes"
            value={String(stats?.total_commutes ?? 0)}
            icon="bicycle"
            iconColor={COLORS.accent}
            style={styles.halfCard}
          />
          <StatCard
            label="Total Distance"
            value={stats?.total_distance_km?.toFixed(0) ?? '0'}
            unit="km"
            icon="navigate"
            iconColor={COLORS.warning}
            style={styles.halfCard}
          />
          <StatCard
            label="Total Emissions"
            value={stats?.total_emissions_kg?.toFixed(1) ?? '0'}
            unit="kg"
            icon="cloud"
            iconColor={COLORS.error}
            style={styles.halfCard}
          />
          <StatCard
            label="Current Streak"
            value={String(stats?.streak ?? 0)}
            unit="days"
            icon="flame"
            iconColor={COLORS.warning}
            style={styles.halfCard}
          />
        </View>

        {/* Modal Split */}
        {stats?.modal_split && stats.modal_split.length > 0 && (
          <Card title="Transport Mode Split">
            {stats.modal_split.map((mode: any) => (
              <View key={mode.mode} style={styles.modeRow}>
                <Text style={styles.modeName}>{mode.mode}</Text>
                <View style={styles.modeBarContainer}>
                  <View style={[styles.modeBar, { width: `${mode.percentage}%`, backgroundColor: COLORS.primary }]} />
                </View>
                <Text style={styles.modePct}>{mode.percentage?.toFixed(0)}%</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Monthly Trend */}
        {monthly.length > 0 && (
          <Card title="Monthly Emissions (kg CO₂)">
            {monthly.slice(-6).map((m: any) => (
              <View key={m.month} style={styles.monthRow}>
                <Text style={styles.monthName}>{m.month_name ?? `Month ${m.month}`}</Text>
                <View style={styles.monthBarContainer}>
                  <View style={[styles.monthBar, {
                    width: `${Math.min((m.total_emissions_kg / 50) * 100, 100)}%`,
                    backgroundColor: COLORS.accent,
                  }]} />
                </View>
                <Text style={styles.monthVal}>{m.total_emissions_kg?.toFixed(1)} kg</Text>
              </View>
            ))}
          </Card>
        )}

        {/* CSRD Context */}
        <Card style={styles.csrdCard}>
          <View style={styles.csrdHeader}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.primary} />
            <Text style={styles.csrdTitle}>CSRD / ESRS E1 Context</Text>
          </View>
          <Text style={styles.csrdText}>
            Your commute data contributes to your company's Scope 3 Category 7 (Employee Commuting) reporting.
            This data is used for CSRD compliance under ESRS E1 climate standards, verified with SEAI 2024 emission factors.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

function EquivalentItem({ icon, value, label, color }: any) {
  return (
    <View style={styles.equivalentItem}>
      <View style={[styles.equivalentIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.equivalentValue}>{value.toLocaleString()}</Text>
      <Text style={styles.equivalentLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },

  heroCard: {
    backgroundColor: COLORS.primary + '10', borderRadius: 20, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  heroIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  heroValue: { fontSize: 48, fontWeight: '800', color: COLORS.primary },
  heroUnit: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '600', textAlign: 'center', marginTop: 4 },
  heroSub: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6 },

  equivalents: { gap: 12 },
  equivalentItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  equivalentIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  equivalentValue: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, minWidth: 60 },
  equivalentLabel: { fontSize: 13, color: COLORS.textSecondary, flex: 1 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  halfCard: { width: '47%' },

  modeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  modeName: { fontSize: 12, color: COLORS.textSecondary, width: 80 },
  modeBarContainer: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginHorizontal: 8 },
  modeBar: { height: 6, borderRadius: 3 },
  modePct: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '600', width: 32, textAlign: 'right' },

  monthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  monthName: { fontSize: 12, color: COLORS.textSecondary, width: 50 },
  monthBarContainer: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginHorizontal: 8 },
  monthBar: { height: 6, borderRadius: 3 },
  monthVal: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '600', width: 56, textAlign: 'right' },

  csrdCard: { gap: 8 },
  csrdHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  csrdTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  csrdText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
});
