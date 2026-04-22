import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { commuteApi } from '../../api';
import { COLORS, TRANSPORT_MODES } from '../../constants';
import ScreenHeader from '../../components/layout/ScreenHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MyTripsScreen() {
  const navigation = useNavigation();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrips = useCallback(async () => {
    const result = await commuteApi.getHistory({ page: 1, page_size: 20 });
    if (result.success) setTrips((result.data as any)?.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadTrips(); }, [loadTrips]);

  const onRefresh = async () => { setRefreshing(true); await loadTrips(); setRefreshing(false); };

  const getModeColor = (modeId: string) => {
    const mode = TRANSPORT_MODES.find(m => m.id === modeId);
    return mode?.color ?? COLORS.primary;
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <ScreenHeader title="My Trips" onBack={() => navigation.goBack()} />
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptyText}>Log your first commute to see your history here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View style={[styles.modeIcon, { backgroundColor: getModeColor(item.transport_mode_id) + '20' }]}>
                <Ionicons name="car-outline" size={18} color={getModeColor(item.transport_mode_id)} />
              </View>
              <View style={styles.tripInfo}>
                <Text style={styles.tripMode}>{item.transport_mode_label}</Text>
                <Text style={styles.tripDate}>{new Date(item.date).toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
              </View>
              <View style={styles.tripStats}>
                <Text style={styles.tripDistance}>{item.distance_km?.toFixed(1)} km</Text>
                <Badge label={`+${item.oxypoints_earned} pts`} variant="success" />
              </View>
            </View>
            <View style={styles.tripFooter}>
              {item.origin_address && (
                <View style={styles.tripRoute}>
                  <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.tripRouteText} numberOfLines={1}>{item.origin_address}</Text>
                </View>
              )}
              <View style={styles.tripEmission}>
                <Ionicons name="cloud-outline" size={12} color={COLORS.textMuted} />
                <Text style={styles.tripEmissionText}>{item.emissions_kg_co2?.toFixed(3)} kg CO₂</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10, paddingBottom: 32, backgroundColor: COLORS.background, flexGrow: 1 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  tripCard: { gap: 10 },
  tripHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modeIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  tripInfo: { flex: 1 },
  tripMode: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  tripDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  tripStats: { alignItems: 'flex-end', gap: 4 },
  tripDistance: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  tripFooter: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tripRoute: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  tripRouteText: { fontSize: 12, color: COLORS.textMuted, flex: 1 },
  tripEmission: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tripEmissionText: { fontSize: 12, color: COLORS.textMuted },
});
