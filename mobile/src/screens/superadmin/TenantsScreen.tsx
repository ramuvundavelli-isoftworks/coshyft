import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { superadminApi } from '../../api';
import { COLORS } from '../../constants';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function TenantsScreen() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => { const r = await superadminApi.getTenants(); if (r.success) setTenants(r.data as any[] ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleSuspend = (tenant: any) => {
    Alert.alert(`Suspend ${tenant.name}?`, 'This will disable all users of this tenant.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Suspend', style: 'destructive', onPress: async () => { await superadminApi.suspendTenant(tenant.id); load(); } },
    ]);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <FlatList
      data={tenants}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={[styles.content, tenants.length === 0 && styles.emptyContent]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.error} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="business-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No tenants found</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.tenantCard}>
          <View style={styles.tenantHeader}>
            <View style={styles.tenantAvatar}>
              <Text style={styles.tenantAvatarText}>{(item.name ?? 'T')[0]}</Text>
            </View>
            <View style={styles.tenantInfo}>
              <Text style={styles.tenantName}>{item.name}</Text>
              <Text style={styles.tenantSlug}>{item.slug}</Text>
              <Text style={styles.tenantContact}>{item.contact_email}</Text>
            </View>
            <Badge label={item.status ?? 'active'} variant={item.status === 'active' ? 'success' : item.status === 'suspended' ? 'error' : 'warning'} />
          </View>
          <View style={styles.tenantStats}>
            <Text style={styles.tenantStat}>{item.user_count ?? 0} users</Text>
            <Text style={styles.tenantStat}>{item.plan ?? 'standard'} plan</Text>
            <Text style={styles.tenantStat}>{item.primary_region ?? 'IE'}</Text>
          </View>
          {item.status === 'active' && (
            <TouchableOpacity style={styles.suspendBtn} onPress={() => handleSuspend(item)}>
              <Text style={styles.suspendText}>Suspend Tenant</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  emptyContent: { flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
  tenantCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  tenantHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tenantAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.error + '30', justifyContent: 'center', alignItems: 'center' },
  tenantAvatarText: { fontSize: 18, fontWeight: '800', color: COLORS.error },
  tenantInfo: { flex: 1 },
  tenantName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  tenantSlug: { fontSize: 12, color: COLORS.textMuted },
  tenantContact: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  tenantStats: { flexDirection: 'row', gap: 16 },
  tenantStat: { fontSize: 12, color: COLORS.textSecondary },
  suspendBtn: { backgroundColor: COLORS.error + '15', borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.error + '30' },
  suspendText: { fontSize: 13, color: COLORS.error, fontWeight: '600' },
});
