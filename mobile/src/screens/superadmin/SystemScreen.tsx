import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { superadminApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function SystemScreen() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => { const r = await superadminApi.getSystemHealth(); if (r.success) setHealth(r.data); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.error} />}>
      <View style={styles.statsGrid}>
        <StatCard label="CPU Usage" value={`${health?.cpu_percent ?? '—'}%`} icon="speedometer" iconColor={COLORS.warning} style={styles.halfCard} />
        <StatCard label="Memory" value={`${health?.memory_percent ?? '—'}%`} icon="hardware-chip" iconColor={COLORS.info} style={styles.halfCard} />
        <StatCard label="DB Connections" value={String(health?.db_connections ?? '—')} icon="git-network" iconColor={COLORS.primary} style={styles.halfCard} />
        <StatCard label="Uptime" value={health?.uptime_hours ? `${health.uptime_hours}h` : '—'} icon="time" iconColor={COLORS.success} style={styles.halfCard} />
      </View>

      <Card title="Service Status">
        {(health?.services ?? []).map((s: any, i: number) => (
          <View key={i} style={styles.serviceRow}>
            <View style={[styles.dot, { backgroundColor: s.status === 'up' ? COLORS.success : COLORS.error }]} />
            <Text style={styles.serviceName}>{s.name}</Text>
            <Text style={styles.serviceLatency}>{s.latency_ms ?? 0}ms</Text>
            <Badge label={s.status ?? 'up'} variant={s.status === 'up' ? 'success' : 'error'} />
          </View>
        ))}
        {!(health?.services?.length) && <Text style={styles.noData}>System health data unavailable.</Text>}
      </Card>

      <Card title="Error Rate (last 24h)">
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={20} color={COLORS.error} />
          <Text style={styles.errorValue}>{health?.error_rate_24h?.toFixed(2) ?? '0.00'}%</Text>
          <Text style={styles.errorLabel}>error rate</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  halfCard: { width: '47%' },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dot: { width: 8, height: 8, borderRadius: 4 },
  serviceName: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  serviceLatency: { fontSize: 12, color: COLORS.textMuted, marginRight: 8 },
  noData: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', padding: 12 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  errorValue: { fontSize: 28, fontWeight: '800', color: COLORS.error },
  errorLabel: { fontSize: 14, color: COLORS.textSecondary },
});
