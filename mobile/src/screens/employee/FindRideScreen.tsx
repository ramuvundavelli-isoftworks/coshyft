import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
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
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Booking modal
  const [bookingRide, setBookingRide] = useState<any | null>(null);
  const [bookingSeats, setBookingSeats] = useState('1');
  const [pickupLocation, setPickupLocation] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleUseLocation = async () => {
    setIsLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to detect your position.');
      setIsLocating(false);
      return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      setUserCoords({ lat: latitude, lng: longitude });
      setOrigin(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    } catch {
      Alert.alert('Error', 'Could not get your location. Please enter it manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Missing Info', 'Enter both origin and destination');
      return;
    }
    setLoading(true);
    setSearched(true);
    const originCoords = userCoords ?? { lat: 53.3498, lng: -6.2603 };
    const result = await carpoolingApi.findRides({
      origin_lat: originCoords.lat,
      origin_lng: originCoords.lng,
      destination_lat: 53.3389,
      destination_lng: -6.2572,
      max_distance_km: 5,
    });
    setLoading(false);
    if (result.success) setRides(result.data as any[] ?? []);
  };

  const handleBookRide = async () => {
    if (!bookingRide) return;
    if (!pickupLocation.trim()) {
      Alert.alert('Required', 'Please enter your pickup location.');
      return;
    }
    setBookingLoading(true);
    const result = await carpoolingApi.requestRide(bookingRide.id, {
      pickup_address: pickupLocation,
    });
    setBookingLoading(false);
    if (result.success) {
      const driver = bookingRide.driver;
      setBookingRide(null);
      setPickupLocation('');
      setBookingSeats('1');
      Alert.alert('Ride Booked!', `Your ride with ${driver} has been requested.`);
    } else {
      Alert.alert('Error', result.error?.message ?? 'Failed to book ride');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Ride</Text>
        <Text style={styles.headerSub}>Connect with coworkers commuting your way</Text>
      </View>

      <View style={styles.searchBox}>
        {/* Origin with GPS button */}
        <View style={styles.originRow}>
          <View style={styles.originInput}>
            <Input
              placeholder="Your origin (e.g. Tallaght)"
              value={origin}
              onChangeText={(t) => { setOrigin(t); setUserCoords(null); }}
              leftIcon="location-outline"
            />
          </View>
          <TouchableOpacity
            style={[styles.gpsBtn, isLocating && styles.gpsBtnDisabled]}
            onPress={handleUseLocation}
            disabled={isLocating}
          >
            <Ionicons
              name={isLocating ? 'hourglass-outline' : 'navigate-outline'}
              size={20}
              color={isLocating ? COLORS.textMuted : COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        {userCoords && (
          <Text style={styles.gpsDetected}>📍 GPS location detected</Text>
        )}
        <Input
          placeholder="Destination (e.g. Grand Canal Dock)"
          value={destination}
          onChangeText={setDestination}
          leftIcon="business-outline"
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
                title="Book Ride"
                onPress={() => setBookingRide(item)}
                size="sm"
                style={styles.requestBtn}
              />
            </View>
          </Card>
        )}
      />

      {/* Booking Modal */}
      <Modal
        visible={!!bookingRide}
        animationType="slide"
        transparent
        onRequestClose={() => setBookingRide(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Ride</Text>
              <TouchableOpacity onPress={() => setBookingRide(null)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
              <View style={styles.rideInfoBox}>
                <Text style={styles.rideInfoDriver}>{bookingRide?.driver}</Text>
                <Text style={styles.rideInfoSub}>
                  {bookingRide?.departureTime} · {bookingRide?.seatsAvailable} seats available
                </Text>
                <Text style={styles.rideInfoSub}>
                  {bookingRide?.origin} → {bookingRide?.destination}
                </Text>
              </View>

              <Text style={styles.fieldLabel}>Number of Seats</Text>
              <View style={styles.seatsRow}>
                {['1', '2', '3', '4'].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.seatBtn, bookingSeats === n && styles.seatBtnActive]}
                    onPress={() => setBookingSeats(n)}
                  >
                    <Text style={[styles.seatBtnText, bookingSeats === n && styles.seatBtnTextActive]}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Pickup Location *</Text>
              <Input
                placeholder="Enter your pickup address"
                value={pickupLocation}
                onChangeText={setPickupLocation}
                leftIcon="location-outline"
              />

              {bookingRide?.co2Saved > 0 && (
                <View style={styles.co2Box}>
                  <Text style={styles.co2Text}>
                    🌱 You'll save {bookingRide.co2Saved?.toFixed(1)} kg CO₂ on this trip!
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setBookingRide(null)}
                variant="secondary"
                style={styles.footerBtn}
              />
              <Button
                title="Confirm Booking"
                onPress={handleBookRide}
                loading={bookingLoading}
                style={styles.footerBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  searchBox: {
    padding: 16, backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 8,
  },
  originRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  originInput: { flex: 1 },
  gpsBtn: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.primary + '15',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  gpsBtnDisabled: { opacity: 0.5 },
  gpsDetected: { fontSize: 12, color: COLORS.success },
  list: { padding: 16, gap: 12 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

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

  // Booking Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  modalBody: { padding: 20 },
  rideInfoBox: {
    backgroundColor: COLORS.primary + '10', borderRadius: 12, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: COLORS.primary + '25',
    gap: 4,
  },
  rideInfoDriver: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  rideInfoSub: { fontSize: 13, color: COLORS.textSecondary },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 10 },
  seatsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  seatBtn: {
    width: 52, height: 52, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background,
  },
  seatBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  seatBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  seatBtnTextActive: { color: '#fff' },
  co2Box: {
    backgroundColor: COLORS.success + '15', borderRadius: 10, padding: 12, marginTop: 16,
    borderWidth: 1, borderColor: COLORS.success + '30',
  },
  co2Text: { fontSize: 13, color: COLORS.success, fontWeight: '500' },
  modalFooter: {
    flexDirection: 'row', gap: 12, padding: 20,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  footerBtn: { flex: 1 },
});
