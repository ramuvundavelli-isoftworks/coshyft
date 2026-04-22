import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { carpoolingApi } from '../../api';
import { COLORS } from '../../constants';
import ScreenHeader from '../../components/layout/ScreenHeader';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ActiveTripScreen() {
  const navigation = useNavigation();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carpoolingApi.getActiveTrip().then(res => {
      if (res.success) setTrip(res.data);
      setLoading(false);
    });
  }, []);

  const handleComplete = async () => {
    if (!trip?.id) return;
    Alert.alert('Complete Trip?', 'Mark this trip as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete', onPress: async () => {
          const result = await carpoolingApi.completeRide(trip.id);
          if (result.success) { Alert.alert('Trip completed!'); navigation.goBack(); }
        },
      },
    ]);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <ScreenHeader title="Active Trip" onBack={() => navigation.goBack()} />
      <ScreenWrapper>
        {!trip ? (
          <View style={styles.noTrip}>
            <Ionicons name="car-outline" size={56} color={COLORS.textMuted} />
            <Text style={styles.noTripTitle}>No Active Trip</Text>
            <Text style={styles.noTripText}>You have no ongoing trip right now.</Text>
            <Button title="Find a Ride" onPress={() => navigation.goBack()} variant="secondary" style={styles.findBtn} />
          </View>
        ) : (
          <>
            <View style={styles.statusBanner}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Trip In Progress</Text>
              <Badge label={trip.status ?? 'Active'} variant="success" />
            </View>

            <Card title="Trip Details">
              <View style={styles.routeRow}>
                <Ionicons name="location" size={16} color={COLORS.primary} />
                <Text style={styles.routeText}>{trip.origin}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeRow}>
                <Ionicons name="business" size={16} color={COLORS.accent} />
                <Text style={styles.routeText}>{trip.destination}</Text>
              </View>
            </Card>

            <Card title="Passengers">
              {(trip.passengers ?? []).map((p: string, i: number) => (
                <View key={i} style={styles.passengerRow}>
                  <View style={styles.passengerAvatar}>
                    <Text style={styles.passengerAvatarText}>{p[0]?.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.passengerName}>{p}</Text>
                </View>
              ))}
            </Card>

            <Card style={styles.emissionCard}>
              <Text style={styles.emissionTitle}>Estimated CO₂ Savings</Text>
              <Text style={styles.emissionValue}>
                ~{((trip.distance ?? 15) * 0.168 * (trip.passengers?.length ?? 1)).toFixed(1)} kg saved
              </Text>
              <Text style={styles.emissionSub}>vs. everyone driving solo</Text>
            </Card>

            <Button title="Complete Trip" onPress={handleComplete} size="lg" style={styles.completeBtn} />
          </>
        )}
      </ScreenWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  noTrip: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  noTripTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  noTripText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  findBtn: { marginTop: 8 },
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.success + '15', borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.success + '30',
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success },
  statusText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.success },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  routeText: { fontSize: 14, color: COLORS.textPrimary },
  routeLine: { width: 2, height: 14, backgroundColor: COLORS.border, marginLeft: 8, marginVertical: 2 },
  passengerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  passengerAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.accent + '30', justifyContent: 'center', alignItems: 'center' },
  passengerAvatarText: { fontSize: 13, fontWeight: '700', color: COLORS.accent },
  passengerName: { fontSize: 14, color: COLORS.textPrimary },
  emissionCard: { backgroundColor: COLORS.primary + '10', borderColor: COLORS.primary + '30', alignItems: 'center' },
  emissionTitle: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  emissionValue: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  emissionSub: { fontSize: 12, color: COLORS.textSecondary },
  completeBtn: { marginTop: 8 },
});
