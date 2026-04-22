import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { carpoolingApi } from '../../api';
import { COLORS } from '../../constants';
import ScreenHeader from '../../components/layout/ScreenHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function RecurringRidesScreen() {
  const navigation = useNavigation();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTemplates = useCallback(async () => {
    const result = await carpoolingApi.getRecurringTemplates();
    if (result.success) setTemplates(result.data as any[] ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  const onRefresh = async () => { setRefreshing(true); await loadTemplates(); setRefreshing(false); };

  const handlePause = async (id: string) => {
    const result = await carpoolingApi.pauseTemplate(id);
    if (result.success) { Alert.alert('Paused'); loadTemplates(); }
  };

  const handleResume = async (id: string) => {
    const result = await carpoolingApi.resumeTemplate(id);
    if (result.success) { Alert.alert('Resumed'); loadTemplates(); }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Template', 'Remove this recurring ride?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const result = await carpoolingApi.deleteRecurringTemplate(id);
        if (result.success) loadTemplates();
      }},
    ]);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <ScreenHeader title="Recurring Rides" onBack={() => navigation.goBack()} />
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, templates.length === 0 && styles.emptyList]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="repeat-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No recurring rides</Text>
            <Text style={styles.emptyText}>Set up a recurring ride schedule to earn consistent OxyPoints.</Text>
            <Button title="Offer a Ride" onPress={() => navigation.navigate('OfferRide' as never)} style={styles.offerBtn} />
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardRoute} numberOfLines={1}>{item.origin} → {item.destination}</Text>
                <Text style={styles.cardTime}>{item.departure_time}</Text>
              </View>
              <Badge label={item.status ?? 'active'} variant={item.status === 'paused' ? 'warning' : 'success'} />
            </View>
            <View style={styles.daysRow}>
              {(item.days_of_week ?? []).map((d: number) => (
                <View key={d} style={styles.dayBadge}>
                  <Text style={styles.dayText}>{DAY_NAMES[d]}</Text>
                </View>
              ))}
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.seatsText}>{item.seats_available} seats</Text>
              <View style={styles.actions}>
                {item.status !== 'paused' ? (
                  <TouchableOpacity onPress={() => handlePause(item.id)} style={styles.actionBtn}>
                    <Ionicons name="pause-circle-outline" size={22} color={COLORS.warning} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleResume(item.id)} style={styles.actionBtn}>
                    <Ionicons name="play-circle-outline" size={22} color={COLORS.success} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10, backgroundColor: COLORS.background, paddingBottom: 32 },
  emptyList: { flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  offerBtn: { marginTop: 8 },
  card: { gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardRoute: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, maxWidth: 220 },
  cardTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dayBadge: { backgroundColor: COLORS.primary + '20', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  dayText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seatsText: { fontSize: 13, color: COLORS.textSecondary },
  actions: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 4 },
});
