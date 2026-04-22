import React, { useState } from 'react';
import { Alert, ScrollView, Switch, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { carpoolingApi } from '../../api';
import { COLORS } from '../../constants';
import ScreenHeader from '../../components/layout/ScreenHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function OfferRideScreen() {
  const navigation = useNavigation();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [seats, setSeats] = useState('3');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(false);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSubmit = async () => {
    if (!origin.trim() || !destination.trim()) { Alert.alert('Enter origin and destination'); return; }
    setLoading(true);
    const result = await carpoolingApi.offerRide({
      origin_address: origin,
      destination_address: destination,
      departure_time: departureTime,
      seats_available: parseInt(seats),
      is_recurring: isRecurring,
      days_of_week: isRecurring ? selectedDays : undefined,
      origin_lat: 53.3498, origin_lng: -6.2603,
      destination_lat: 53.3389, destination_lng: -6.2572,
    });
    setLoading(false);
    if (result.success) {
      Alert.alert('Ride Offered!', 'Your ride has been posted. Coworkers can now request to join.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.error?.message ?? 'Failed to offer ride');
    }
  };

  return (
    <>
      <ScreenHeader title="Offer a Ride" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Input label="Your pickup location" value={origin} onChangeText={setOrigin} placeholder="e.g. Tallaght, Dublin 24" leftIcon="location-outline" />
        <Input label="Destination" value={destination} onChangeText={setDestination} placeholder="e.g. Grand Canal Dock, Dublin 2" leftIcon="business-outline" />
        <Input label="Departure time" value={departureTime} onChangeText={setDepartureTime} placeholder="HH:MM" leftIcon="time-outline" />
        <Input label="Seats available" value={seats} onChangeText={setSeats} keyboardType="numeric" placeholder="3" leftIcon="people-outline" />

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Recurring ride</Text>
            <Text style={styles.toggleSub}>Offer this ride on a regular schedule</Text>
          </View>
          <Switch value={isRecurring} onValueChange={setIsRecurring} trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }} thumbColor={isRecurring ? COLORS.primary : COLORS.textMuted} />
        </View>

        {isRecurring && (
          <Card title="Days of week">
            <View style={styles.daysRow}>
              {DAYS.map((day, i) => (
                <Button
                  key={day}
                  title={day}
                  onPress={() => toggleDay(i + 1)}
                  variant={selectedDays.includes(i + 1) ? 'primary' : 'secondary'}
                  size="sm"
                  style={styles.dayBtn}
                />
              ))}
            </View>
          </Card>
        )}

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>CO₂ Impact</Text>
          <Text style={styles.infoText}>
            By offering rides to {parseInt(seats)} coworkers, you'll help reduce emissions by up to{' '}
            <Text style={styles.infoHighlight}>{(parseInt(seats) * 0.168 * 20).toFixed(0)} kg CO₂/month</Text>.
          </Text>
        </Card>

        <Button title="Post Ride" onPress={handleSubmit} loading={loading} size="lg" style={styles.submitBtn} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40, gap: 4 },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12,
  },
  toggleLabel: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  toggleSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  daysRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  dayBtn: { minWidth: 50 },
  infoCard: { backgroundColor: COLORS.primary + '10', borderColor: COLORS.primary + '30', gap: 6 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  infoText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  infoHighlight: { color: COLORS.primary, fontWeight: '700' },
  submitBtn: { marginTop: 8 },
});
