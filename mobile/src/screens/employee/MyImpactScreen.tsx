import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { commuteApi } from '../../api';
import { THEME, gs } from '../../styles/theme';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CHART_MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

// Baseline, Emissions, Savings data (mock — replaced by real when available)
const MOCK_CHART_DATA = {
  baseline:   [60, 60, 62, 61, 62, 63],
  emissions:  [44, 40, 34, 30, 28, 23],
  savings:    [15, 21, 28, 30, 32, 39],
};

export default function MyImpactScreen() {
  const navigation = useNavigation();
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

  const co2Saved    = stats?.co2_saved_vs_car?.toFixed(1) ?? '142.5';
  const monthlyRed  = stats?.monthly_reduction_pct ?? 40;
  const totalKm     = stats?.total_distance_km?.toFixed(0) ?? '856';
  const trees       = Math.round((stats?.co2_saved_vs_car ?? 142.5) / 21.77);
  const moneySaved  = Math.round((stats?.total_distance_km ?? 856) * 0.27);

  return (
    <View style={[gs.flex1, styles.screen]}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />

      {/* ── Header with back ────────────────────────────── */}
      <View style={[gs.header, { paddingTop: insets.top + 10 }]}>
        <View style={gs.headerRow}>
          <TouchableOpacity
            style={[gs.row, gs.gap8]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
            <Text style={gs.headerPageTitle}>My Impact Report</Text>
          </TouchableOpacity>
          <BellButton count={2} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />
        }
        contentContainerStyle={gs.scrollContent}
      >
        {/* ── Hero banner ─────────────────────────────────── */}
        <View style={styles.heroBanner}>
          <Text style={gs.textSm}>Total CO₂ Saved</Text>
          <Text style={styles.heroValue}>{co2Saved} kg</Text>
          <View style={[gs.row, gs.gap4]}>
            <Ionicons name="arrow-down" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroSub}>{monthlyRed}% vs baseline</Text>
          </View>
        </View>

        {/* ── 4 stat cards ────────────────────────────────── */}
        <View style={styles.statsGrid}>
          <ImpactStat label="Monthly Reduction" value={`${monthlyRed}%`} sub="vs solo driving" color={THEME.primary} />
          <ImpactStat label="Sustainable Distance" value={`${totalKm} km`} sub="This month" color={THEME.primary} />
          <ImpactStat label="Trees Equivalent" value={`${trees} trees`} sub="Planted" color={THEME.primary} />
          <ImpactStat label="Money Saved" value={`€${moneySaved}`} sub="Fuel & parking" color={THEME.warning} />
        </View>

        {/* ── 6-month trend chart ─────────────────────────── */}
        <View style={gs.card}>
          <Text style={gs.cardTitle}>6-Month Emissions Trend</Text>
          <SimpleLineChart data={MOCK_CHART_DATA} months={CHART_MONTHS} />
          <View style={styles.chartLegend}>
            <LegendItem color="#9CA3AF" label="Baseline" />
            <LegendItem color="#EF4444" label="Emissions" />
            <LegendItem color={THEME.primary} label="Savings" />
          </View>
        </View>

        {/* ── Modal split bars ────────────────────────────── */}
        {stats?.modal_split && stats.modal_split.length > 0 && (
          <View style={gs.card}>
            <Text style={gs.cardTitle}>Transport Mode Split</Text>
            {stats.modal_split.map((mode: any) => (
              <View key={mode.mode} style={styles.modeRow}>
                <Text style={styles.modeName}>{mode.mode}</Text>
                <View style={[gs.progressTrack, styles.modeBar]}>
                  <View style={[gs.progressFill, { width: `${mode.percentage}%` as any }]} />
                </View>
                <Text style={styles.modePct}>{mode.percentage?.toFixed(0)}%</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function BellButton({ count }: { count: number }) {
  return (
    <TouchableOpacity style={gs.bellBtn}>
      <Ionicons name="notifications-outline" size={20} color="#fff" />
      {count > 0 && (
        <View style={gs.bellBadgeWrap}>
          <Text style={gs.bellBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ImpactStat({
  label, value, sub, color,
}: { label: string; value: string; sub: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={gs.textSm}>{sub}</Text>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={[gs.row, gs.gap6]}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={gs.textSm}>{label}</Text>
    </View>
  );
}

// Simple bar-based chart (approximates the line chart from PDF)
function SimpleLineChart({ data, months }: { data: typeof MOCK_CHART_DATA; months: string[] }) {
  const maxVal = 80;
  const chartH = 120;

  return (
    <View style={styles.chart}>
      {/* Y-axis labels */}
      <View style={styles.chartYAxis}>
        {[80, 60, 40, 20, 0].map(v => (
          <Text key={v} style={styles.chartAxisLabel}>{v}</Text>
        ))}
      </View>

      {/* Chart area */}
      <View style={styles.chartArea}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <View key={i} style={[styles.gridLine, { bottom: (i / 4) * chartH }]} />
        ))}

        {/* Bars per month */}
        <View style={styles.chartColumns}>
          {months.map((month, i) => (
            <View key={month} style={styles.chartColumn}>
              {/* Baseline dot */}
              <View style={[styles.chartDot, styles.dotBaseline, {
                bottom: (data.baseline[i] / maxVal) * chartH - 5,
              }]} />
              {/* Emissions dot */}
              <View style={[styles.chartDot, styles.dotEmissions, {
                bottom: (data.emissions[i] / maxVal) * chartH - 5,
              }]} />
              {/* Savings dot */}
              <View style={[styles.chartDot, styles.dotSavings, {
                bottom: (data.savings[i] / maxVal) * chartH - 5,
              }]} />
              <Text style={styles.chartXLabel}>{month}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: THEME.background,
  },

  // Hero
  heroBanner: {
    backgroundColor: THEME.headerBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  heroValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },

  // 4 stat cards grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },

  // Chart
  chart: {
    flexDirection: 'row',
    height: 140,
    marginTop: 8,
  },
  chartYAxis: {
    width: 28,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  chartAxisLabel: {
    fontSize: 10,
    color: THEME.textMuted,
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    height: 120,
    position: 'relative',
    marginLeft: 4,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME.border,
  },
  chartColumns: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 120,
    alignItems: 'flex-end',
  },
  chartColumn: {
    flex: 1,
    height: 120,
    alignItems: 'center',
    position: 'relative',
  },
  chartDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotBaseline: {
    backgroundColor: '#9CA3AF',
  },
  dotEmissions: {
    backgroundColor: '#EF4444',
  },
  dotSavings: {
    backgroundColor: THEME.primary,
  },
  chartXLabel: {
    position: 'absolute',
    bottom: -18,
    fontSize: 10,
    color: THEME.textMuted,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 28,
    justifyContent: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Mode split
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  modeName: {
    fontSize: 12,
    color: THEME.textSecondary,
    width: 80,
  },
  modeBar: {
    flex: 1,
  },
  modePct: {
    fontSize: 12,
    color: THEME.textPrimary,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
});
