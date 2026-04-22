import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminApi } from '../../api';
import { COLORS } from '../../constants';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function RidesScreen() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => { const r = await adminApi.getRideOperations(); if (r.success) setRides(r.data as any[] ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleCancel = (rideId: string) => {
    Alert.alert('Cancel Ride?', 'This will cancel the ride for all passengers.', [
      { text: 'No', style: 'cancel' },
      { text: 'Cancel Ride', style: 'destructive', onPress: async () => { const r = await adminApi.cancelRide(rideId); if (r.success) load(); } },
    ]);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <FlatList
      data={rides}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={[styles.content, rides.length === 0 && styles.emptyContent]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="car-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No rides to manage</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.rideCard}>
          <View style={styles.rideHeader}>
            <Text style={styles.rideDriver}>{item.driver_name ?? 'Driver'}</Text>
            <Badge label={item.status ?? 'active'} variant={item.status === 'completed' ? 'success' : item.status === 'cancelled' ? 'error' : 'info'} />
          </View>
          <Text style={styles.rideRoute} numberOfLines={1}>{item.origin} → {item.destination}</Text>
          <View style={styles.rideFooter}>
            <Text style={styles.rideInfo}>{item.seats_available ?? 0} seats · {item.distance_km?.toFixed(1) ?? 0} km</Text>
            {item.status === 'active' && (
              <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
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
  rideCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border, gap: 8 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rideDriver: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  rideRoute: { fontSize: 13, color: COLORS.textSecondary },
  rideFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rideInfo: { fontSize: 13, color: COLORS.textMuted },
  cancelBtn: { backgroundColor: COLORS.error + '20', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  cancelText: { fontSize: 13, color: COLORS.error, fontWeight: '600' },
});
