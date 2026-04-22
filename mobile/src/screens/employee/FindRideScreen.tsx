import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { carpoolingApi } from '../../api';
import { COLORS } from '../../constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function FindRideScreen() {
  const insets = useSafeAreaInsets();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Enter both origin and destination');
      return;
    }
    setLoading(true);
    setSearched(true);
    // Using Dublin area coords as defaults for demo
    const result = await carpoolingApi.findRides({
      origin_lat: 53.3498, origin_lng: -6.2603,
      destination_lat: 53.3389, destination_lng: -6.2572,
      max_distance_km: 5,
    });
    setLoading(false);
    if (result.success) setRides(result.data as any[] ?? []);
  };

  const handleRequest = async (rideId: string) => {
    const result = await carpoolingApi.requestRide(rideId, { message: 'Hi, I would like to join your ride.' });
    if (result.success) {
      Alert.alert('Request Sent', 'Your ride request has been sent to the driver.');
    } else {
      Alert.alert('Error', result.error?.message ?? 'Failed to send request');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Ride</Text>
        <Text style={styles.headerSub}>Connect with coworkers commuting your way</Text>
      </View>

      <View style={styles.searchBox}>
        <Input
          placeholder="Your origin (e.g. Tallaght)"
          value={origin}
          onChangeText={setOrigin}
          leftIcon="location-outline"
          style={styles.searchInput}
        />
        <Input
          placeholder="Destination (e.g. Grand Canal Dock)"
          value={destination}
          onChangeText={setDestination}
          leftIcon="business-outline"
          style={styles.searchInput}
        />
        <Button title="Search Rides" onPress={handleSearch} loading={loading} />
      </View>

      {loading && <LoadingSpinner message="Finding rides nearby..." />}

      {!loading && searched && rides.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="car-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No rides found</Text>
          <Text style={styles.emptyText}>
            No rides match your route right now. Try offering a ride to help others!
          </Text>
        </View>
      )}

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.rideCard}>
            <View style={styles.rideHeader}>
              <View style={styles.driverInfo}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>{item.driver?.[0] ?? 'D'}</Text>
                </View>
                <View>
                  <Text style={styles.driverName}>{item.driver}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color={COLORS.warning} />
                    <Text style={styles.rating}>{item.driverRating?.toFixed(1) ?? '5.0'}</Text>
                    <Text style={styles.ratingCount}>· {item.totalTrips ?? 0} trips</Text>
                  </View>
                </View>
              </View>
              <View style={styles.matchScore}>
                <Text style={styles.matchScoreValue}>{item.matchScore ?? 95}%</Text>
                <Text style={styles.matchScoreLabel}>match</Text>
              </View>
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routeRow}>
                <Ionicons name="location" size={14} color={COLORS.primary} />
                <Text style={styles.routeText}>{item.origin}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeRow}>
                <Ionicons name="business" size={14} color={COLORS.accent} />
                <Text style={styles.routeText}>{item.destination}</Text>
              </View>
            </View>

            <View style={styles.rideDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.detailText}>{item.departureTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.detailText}>{item.seatsAvailable} seats</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="leaf-outline" size={14} color={COLORS.success} />
                <Text style={styles.detailText}>{item.co2Saved?.toFixed(1) ?? '0'} kg saved</Text>
              </View>
            </View>

            <View style={styles.rideFooter}>
              {item.verifiedDriver && <Badge label="Verified Driver" variant="success" />}
              {item.recurring && <Badge label="Recurring" variant="info" />}
              <Button
                title="Request Ride"
                onPress={() => handleRequest(item.id)}
                size="sm"
                style={styles.requestBtn}
              />
            </View>
          </Card>
        )}
      />
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
  searchBox: { padding: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchInput: { marginBottom: 4 },
  list: { padding: 16, gap: 12 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

  // Ride Card
  rideCard: { gap: 12 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  driverAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '30',
    justifyContent: 'center', alignItems: 'center',
  },
  driverAvatarText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  driverName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  rating: { fontSize: 12, color: COLORS.warning, fontWeight: '600' },
  ratingCount: { fontSize: 12, color: COLORS.textMuted },
  matchScore: { alignItems: 'center', backgroundColor: COLORS.primary + '15', borderRadius: 10, padding: 8 },
  matchScoreValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  matchScoreLabel: { fontSize: 10, color: COLORS.primary },

  routeInfo: { gap: 4 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeText: { fontSize: 13, color: COLORS.textPrimary },
  routeLine: { width: 2, height: 12, backgroundColor: COLORS.border, marginLeft: 7 },

  rideDetails: { flexDirection: 'row', gap: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, color: COLORS.textSecondary },

  rideFooter: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  requestBtn: { marginLeft: 'auto' },
});
