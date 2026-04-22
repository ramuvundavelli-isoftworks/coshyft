import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { superadminApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SERVICES = [
  { key: 'api_status', label: 'API Server', icon: 'server' as const },
  { key: 'db_status', label: 'Database', icon: 'disc' as const },
  { key: 'auth_status', label: 'Auth Service', icon: 'lock-closed' as const },
  { key: 'notif_status', label: 'Notifications', icon: 'notifications' as const },
];

export default function SuperAdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const r = await superadminApi.getDashboard();
    if (r.success) setDashboard(r.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (loading) return <LoadingSpinner fullScreen />;

  const allHealthy = SERVICES.every(s => (dashboard?.[s.key] ?? 'healthy') === 'healthy');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Platform Control</Text>
          <Text style={styles.headerSub}>Super Admin · Multi-tenant Management</Text>
        </View>
        <View style={styles.superBadge}>
          <Ionicons name="flash" size={13} color="#7C3AED" />
          <Text style={styles.superBadgeText}>SuperAdmin</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={['#7C3AED']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Platform Health Banner */}
        <View style={[styles.healthBanner, { backgroundColor: allHealthy ? '#ECFDF5' : '#FEF3C7', borderColor: allHealthy ? '#A7F3D0' : '#FDE68A' }]}>
          <View style={[styles.healthIconBg, { backgroundColor: allHealthy ? '#D1FAE5' : '#FEF3C7' }]}>
            <Ionicons
              name={allHealthy ? 'checkmark-circle' : 'warning'}
              size={24}
              color={allHealthy ? COLORS.success : COLORS.warning}
            />
          </View>
          <View>
            <Text style={[styles.healthTitle, { color: allHealthy ? COLORS.success : COLORS.warning }]}>
              Platform {allHealthy ? 'All Systems Operational' : 'Degraded Performance'}
            </Text>
            <Text style={styles.healthSub}>
              {SERVICES.filter(s => (dashboard?.[s.key] ?? 'healthy') === 'healthy').length}/{SERVICES.length} services healthy
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Tenants"
            value={String(dashboard?.total_tenants ?? '—')}
            icon="business"
            iconColor="#7C3AED"
            style={styles.halfCard}
          />
          <StatCard
            label="Total Users"
            value={String(dashboard?.total_users ?? '—')}
            icon="people"
            iconColor={COLORS.accent}
            style={styles.halfCard}
          />
          <StatCard
            label="Active Today"
            value={String(dashboard?.active_today ?? '—')}
            icon="pulse"
            iconColor={COLORS.success}
            style={styles.halfCard}
          />
          <StatCard
            label="API Requests"
            value={`${((dashboard?.api_requests_today ?? 0) / 1000).toFixed(1)}k`}
            icon="cloud-upload"
            iconColor={COLORS.warning}
            style={styles.halfCard}
          />
        </View>

        {/* Service Health */}
        <Card title="Service Health">
          {SERVICES.map(({ key, label, icon }, idx) => {
            const status: string = dashboard?.[key] ?? 'healthy';
            const isHealthy = status === 'healthy';
            const isDegraded = status === 'degraded';
            const dotColor = isHealthy ? COLORS.success : isDegraded ? COLORS.warning : COLORS.error;
            const variant: any = isHealthy ? 'success' : isDegraded ? 'warning' : 'error';
            const isLast = idx === SERVICES.length - 1;

            return (
              <View key={key} style={[styles.serviceRow, isLast && styles.serviceRowLast]}>
                <View style={[styles.serviceIconBg, { backgroundColor: dotColor + '15' }]}>
                  <Ionicons name={icon} size={16} color={dotColor} />
                </View>
                <Text style={styles.serviceName}>{label}</Text>
                <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                <Badge label={status} variant={variant} />
              </View>
            );
          })}
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          {(dashboard?.recent_activity ?? []).length > 0
            ? (dashboard.recent_activity as any[]).map((a: any, i: number) => (
              <View key={i} style={[styles.activityRow, i === dashboard.recent_activity.length - 1 && styles.activityRowLast]}>
                <View style={styles.activityDot} />
                <Text style={styles.activityText}>{a.message ?? String(a)}</Text>
                {a.time && <Text style={styles.activityTime}>{a.time}</Text>}
              </View>
            ))
            : (
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={32} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>No recent activity</Text>
              </View>
            )}
        </Card>

        {/* Tenant Quick Stats */}
        <View style={styles.tenantRow}>
          <View style={[styles.tenantCard, { borderLeftColor: '#7C3AED' }]}>
            <Text style={styles.tenantLabel}>New This Month</Text>
            <Text style={styles.tenantValue}>{dashboard?.new_tenants_this_month ?? '—'}</Text>
          </View>
          <View style={[styles.tenantCard, { borderLeftColor: COLORS.success }]}>
            <Text style={styles.tenantLabel}>Revenue MRR</Text>
            <Text style={styles.tenantValue}>{dashboard?.mrr ? `€${dashboard.mrr.toLocaleString()}` : '—'}</Text>
          </View>
        </View>
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
  superBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EDE9FE', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#DDD6FE',
  },
  superBadgeText: { fontSize: 12, color: '#6D28D9', fontWeight: '700' },

  content: { padding: 16, gap: 16, paddingBottom: 32 },

  // Health Banner
  healthBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 14, padding: 16, borderWidth: 1,
  },
  healthIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  healthTitle: { fontSize: 15, fontWeight: '700' },
  healthSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  halfCard: { width: '47%' },

  // Services
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  serviceRowLast: { borderBottomWidth: 0 },
  serviceIconBg: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  serviceName: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
  statusDot: { width: 8, height: 8, borderRadius: 4 },

  // Activity
  activityRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  activityRowLast: { borderBottomWidth: 0 },
  activityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.textMuted, marginTop: 5 },
  activityText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  activityTime: { fontSize: 11, color: COLORS.textMuted },
  emptyState: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  emptyText: { fontSize: 14, color: COLORS.textMuted },

  // Tenant
  tenantRow: { flexDirection: 'row', gap: 12 },
  tenantCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  tenantLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  tenantValue: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
});
