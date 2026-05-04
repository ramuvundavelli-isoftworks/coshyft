import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, Alert, Switch, StatusBar,
  RefreshControl, ActivityIndicator, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { commuteApi, carpoolingApi } from '../../api';
import { THEME, gs } from '../../styles/theme';
import { useLocation } from '../../hooks/useLocation';

type Tab = 'trips' | 'find' | 'offer' | 'active';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function RidesScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('trips');

  return (
    <View style={[gs.flex1, styles.screen]}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />

      {/* ── Header ─────────────────────────────────────── */}
      <View style={[gs.header, { paddingTop: insets.top + 10 }]}>
        <View style={gs.headerRow}>
          <Text style={gs.headerPageTitle}>Rides</Text>
          <BellButton count={2} />
        </View>
        <View style={gs.searchBar}>
          <Ionicons name="search" size={18} color={THEME.textMuted} />
          <Text style={gs.searchPlaceholder}>Search rides, trips, colleagues...</Text>
        </View>
      </View>

      {/* ── Segmented tabs ─────────────────────────────── */}
      <View style={gs.segBar}>
        <SegTab label="My Trips"   id="trips"  active={activeTab} onPress={setActiveTab} />
        <SegTab label="Find Ride"  id="find"   active={activeTab} onPress={setActiveTab} />
        <SegTab label="Offer Ride" id="offer"  active={activeTab} onPress={setActiveTab} />
        <SegTab label="Active"     id="active" active={activeTab} onPress={setActiveTab} />
      </View>

      {/* ── Content ────────────────────────────────────── */}
      {activeTab === 'trips'  && <MyTripsTab />}
      {activeTab === 'find'   && <FindRideTab />}
      {activeTab === 'offer'  && <OfferRideTab />}
      {activeTab === 'active' && <ActiveTripTab />}
    </View>
  );
}

// ─── Segmented tab button ─────────────────────────────────────
function SegTab({
  label, id, active, onPress,
}: { label: string; id: Tab; active: Tab; onPress: (t: Tab) => void }) {
  const isActive = id === active;
  return (
    <TouchableOpacity
      style={[gs.segTab, isActive && gs.segTabActive]}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <Text style={isActive ? gs.segTabTextActive : gs.segTabText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Bell button ──────────────────────────────────────────────
function BellButton({ count }: { count: number }) {
  return (
    <TouchableOpacity style={gs.bellBtn}>
      <Ionicons name="notifications-outline" size={20} color="#fff" />
      {count > 0 && (
        <View style={gs.bellBadgeWrap}>
          <Text style={gs.bellBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ══════════════════════════════════════════════════════════════
// MY TRIPS TAB  – combines commute history + carpool rides
// ══════════════════════════════════════════════════════════════
function MyTripsTab() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'completed'>('all');

  const loadTrips = useCallback(async () => {
    const [historyRes, ridesRes] = await Promise.all([
      commuteApi.getHistory({ page: 1, page_size: 30 }),
      carpoolingApi.getMyRides(),
    ]);

    const historyItems: any[] = (historyRes.success ? (historyRes.data as any)?.items ?? [] : []).map((e: any) => ({
      id: e.id,
      type: 'commute',
      date: e.date ?? e.date_logged,
      mode: e.transport_mode_label ?? 'Transit',
      route: `${e.origin_address ?? ''} → ${e.destination_address ?? 'Office'}`,
      with: null,
      km: e.distance_km?.toFixed(1) ?? '0',
      co2: `+${Math.max(0, (e.distance_km ?? 0) * 0.178 - (e.emissions_kg_co2 ?? 0)).toFixed(1)}`,
      status: 'completed',
    }));

    const rideItems: any[] = (ridesRes.success && Array.isArray(ridesRes.data) ? ridesRes.data as any[] : []).map((r: any) => {
      const depTime = r.departure_time ? new Date(r.departure_time) : null;
      const isPast = depTime !== null && depTime < new Date();
      const status = r.status === 'completed' ? 'completed'
        : r.status === 'cancelled' ? 'cancelled'
        : isPast ? 'completed' : 'upcoming';
      return {
        id: r.id,
        type: 'carpool',
        date: r.departure_time?.substring(0, 10) ?? '',
        mode: r.user_role === 'driver' ? 'Carpool (Driver)' : 'Carpool',
        route: `${r.origin ?? ''} → ${r.destination ?? ''}`,
        with: r.user_role !== 'driver' ? (r.driver_name ?? 'Driver') : null,
        km: (r.distance_km ?? 0).toFixed(1),
        co2: `+${Math.max(0, r.co2_saved ?? 0).toFixed(1)}`,
        status,
        userRole: r.user_role,
      };
    });

    const combined = [...historyItems, ...rideItems]
      .filter(t => t.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTrips(combined.length > 0 ? combined : MOCK_TRIPS);
    setLoading(false);
  }, []);

  useEffect(() => { loadTrips(); }, [loadTrips]);

  const onRefresh = async () => { setRefreshing(true); await loadTrips(); setRefreshing(false); };

  const filtered = activeStatus === 'all'
    ? trips
    : trips.filter(t => t.status === activeStatus);

  if (loading) {
    return <View style={styles.loadingWrap}><ActivityIndicator color={THEME.primary} size="large" /></View>;
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />}
      ListHeaderComponent={
        <>
          {/* Status filter pills */}
          <View style={styles.statusRow}>
            {(['all', 'upcoming', 'completed'] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.statusPill, activeStatus === s && styles.statusPillActive]}
                onPress={() => setActiveStatus(s)}
              >
                <Text style={[styles.statusPillText, activeStatus === s && styles.statusPillTextActive]}>
                  {s === 'all' ? 'All' : s === 'upcoming' ? 'Upcoming' : 'Completed'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.resultCount}>{filtered.length} trip{filtered.length !== 1 ? 's' : ''}</Text>
        </>
      }
      ListEmptyComponent={
        <View style={gs.emptyWrap}>
          <Ionicons name="calendar-outline" size={48} color={THEME.textMuted} />
          <Text style={gs.emptyTitle}>No trips found</Text>
          <Text style={gs.emptyText}>Log your first commute to see your history here.</Text>
        </View>
      }
      renderItem={({ item }) => <TripCard item={item} />}
    />
  );
}

const MOCK_TRIPS = [
  { id: '1', type: 'carpool', date: '2026-02-18', mode: 'Carpool', route: 'Ranelagh → Sandyford BP', with: 'Alice Johnson', km: '12.3', co2: '+2.1', status: 'completed' },
  { id: '2', type: 'commute', date: '2026-02-17', mode: 'Public Transit', route: 'City Centre → Tech Park', with: null, km: '8.5', co2: '+0.8', status: 'completed' },
  { id: '3', type: 'carpool', date: '2026-02-22', mode: 'Carpool', route: 'Downtown → Office', with: 'Sarah Johnson', km: '15.2', co2: '+2.5', status: 'upcoming' },
];

function TripCard({ item }: { item: any }) {
  const isCompleted = item.status === 'completed';
  const isUpcoming = item.status === 'upcoming';
  const date = item.date
    ? new Date(item.date).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const modeColor = item.type === 'carpool' ? THEME.primary : '#3B82F6';

  return (
    <View style={[gs.card, styles.tripCard]}>
      <View style={gs.rowBetween}>
        <View style={[gs.row, gs.gap12]}>
          <View style={[styles.tripIcon, { backgroundColor: modeColor + '20' }]}>
            <Ionicons name={item.type === 'carpool' ? 'car-outline' : 'bus-outline'} size={18} color={modeColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tripMode}>{item.mode}</Text>
            <Text style={styles.tripDate}>{date}</Text>
            <Text style={styles.tripRoute} numberOfLines={1}>{item.route}</Text>
            {item.with && <Text style={styles.tripWith}>with {item.with}</Text>}
          </View>
        </View>
        {isCompleted ? (
          <View style={gs.pillCompleted}><Text style={gs.pillCompletedText}>Done</Text></View>
        ) : isUpcoming ? (
          <View style={gs.pillUpcoming}><Text style={gs.pillUpcomingText}>Upcoming</Text></View>
        ) : null}
      </View>

      <View style={[gs.row, styles.tripFooter]}>
        <View style={[gs.row, gs.gap4]}>
          <Ionicons name="navigate-outline" size={12} color={THEME.textMuted} />
          <Text style={gs.textSm}>{item.km} km</Text>
        </View>
        <View style={[gs.row, gs.gap4]}>
          <Ionicons name="leaf-outline" size={12} color={THEME.primary} />
          <Text style={styles.co2Text}>{item.co2} kg CO₂</Text>
        </View>
      </View>
    </View>
  );
}

// ══════════════════════════════════════════════════════════════
// FIND RIDE TAB  – with GPS location + address search
// ══════════════════════════════════════════════════════════════
function FindRideTab() {
  const { getLocation, geocodeAddress, loading: locLoading } = useLocation();

  const [originText, setOriginText]     = useState('');
  const [destText, setDestText]         = useState('Dublin HQ');
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destCoords, setDestCoords]     = useState<{ lat: number; lng: number }>({
    lat: 53.3389, lng: -6.2572,
  });

  const [rides, setRides]   = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    handleUseGPS();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseGPS = async () => {
    const loc = await getLocation();
    if (loc) {
      setOriginText(loc.address);
      setOriginCoords({ lat: loc.lat, lng: loc.lng });
    } else {
      Alert.alert(
        'Location unavailable',
        'Could not get your GPS position. Please type your origin address.',
      );
    }
  };

  const handleSearch = async () => {
    if (!originText.trim()) {
      Alert.alert('Enter your starting location or use GPS');
      return;
    }

    setLoading(true);
    setSearched(true);

    let oLat = originCoords?.lat ?? 53.3498;
    let oLng = originCoords?.lng ?? -6.2603;

    if (!originCoords) {
      const resolved = await geocodeAddress(originText);
      if (resolved) { oLat = resolved.lat; oLng = resolved.lng; }
    }

    let dLat = destCoords.lat;
    let dLng = destCoords.lng;
    if (destText.trim()) {
      const resolved = await geocodeAddress(destText);
      if (resolved) { dLat = resolved.lat; dLng = resolved.lng; }
    }

    const result = await carpoolingApi.findRides({
      origin_lat: oLat, origin_lng: oLng,
      destination_lat: dLat, destination_lng: dLng,
      max_distance_km: 10,
    });

    setLoading(false);
    if (result.success) setRides(result.data as any[] ?? []);
  };

  const handleBook = async (rideId: string) => {
    const result = await carpoolingApi.requestRide(rideId, {
      message: 'Hi, I would like to join your ride.',
    });
    if (result.success) {
      Alert.alert('Request Sent', 'Your ride request has been sent to the driver.');
    } else {
      Alert.alert('Error', result.error?.message ?? 'Failed to send request');
    }
  };

  const MOCK_RIDES = [
    {
      id: 'r1', driver: 'Sarah Johnson', initials: 'SJ', verified: true,
      rating: 4.8, trips: 127, matchScore: 92,
      route: 'Ranelagh → Sandyford Business Park',
      time: 'Tomorrow • 8:30 AM', km: '12.3', seats: 2, co2: '2.1',
      tags: ['⚡ Tesla Model 3', 'Quiet ride', 'No smoking'],
    },
    {
      id: 'r2', driver: 'Mike Chen', initials: 'MC', verified: true,
      rating: 4.9, trips: 203, matchScore: 88,
      route: 'City Centre → Tech Park',
      time: 'Tomorrow • 9:00 AM', km: '8.5', seats: 3, co2: '1.8',
      tags: ['🚗 Toyota Corolla', 'Music OK', 'Conversation welcome'],
    },
  ];

  const displayRides = rides.length > 0 ? rides : (searched && !loading ? [] : MOCK_RIDES);

  return (
    <KeyboardAvoidingView
      style={gs.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={displayRides}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* ── Search form ───────────────────────── */}
            <View style={styles.searchForm}>
              {/* From */}
              <Text style={styles.inputLabel}>From</Text>
              <View style={styles.locationRow}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={originText}
                  onChangeText={(t) => {
                    setOriginText(t);
                    setOriginCoords(null);
                  }}
                  placeholder="Your starting address"
                  placeholderTextColor={THEME.textMuted}
                  returnKeyType="next"
                />
                <TouchableOpacity
                  style={[styles.gpsBtn, locLoading && styles.gpsBtnLoading]}
                  onPress={handleUseGPS}
                  disabled={locLoading}
                >
                  {locLoading
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Ionicons name="navigate" size={18} color="#fff" />
                  }
                </TouchableOpacity>
              </View>

              {/* To */}
              <Text style={[styles.inputLabel, { marginTop: 12 }]}>To</Text>
              <TextInput
                style={styles.input}
                value={destText}
                onChangeText={setDestText}
                placeholder="Destination address"
                placeholderTextColor={THEME.textMuted}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />

              {/* Search button */}
              <TouchableOpacity
                style={[styles.searchBtn, loading && styles.searchBtnDisabled]}
                onPress={handleSearch}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <><Ionicons name="search" size={16} color="#fff" /><Text style={styles.searchBtnText}>  Find Nearby Rides</Text></>
                }
              </TouchableOpacity>
            </View>

            {displayRides.length > 0 && (
              <Text style={styles.resultCount}>{displayRides.length} rides near you</Text>
            )}
          </>
        }
        ListEmptyComponent={
          searched && !loading ? (
            <View style={gs.emptyWrap}>
              <Ionicons name="car-outline" size={48} color={THEME.textMuted} />
              <Text style={gs.emptyTitle}>No rides found</Text>
              <Text style={gs.emptyText}>No rides match your route. Try offering a ride!</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => <RideCard item={item} onBook={handleBook} />}
      />
    </KeyboardAvoidingView>
  );
}

function RideCard({ item, onBook }: { item: any; onBook: (id: string) => void }) {
  return (
    <View style={[gs.card, styles.rideCard]}>
      {/* Driver row */}
      <View style={gs.rowBetween}>
        <View style={[gs.row, gs.gap10]}>
          <View style={gs.avatarMd}>
            <Text style={gs.avatarText}>{item.initials ?? (item.driver?.[0] ?? 'D')}</Text>
          </View>
          <View>
            <View style={[gs.row, gs.gap6]}>
              <Text style={styles.driverName}>{item.driver}</Text>
              {item.verified && (
                <Ionicons name="checkmark-circle" size={16} color={THEME.info} />
              )}
            </View>
            <View style={[gs.row, gs.gap4]}>
              <Ionicons name="star" size={12} color={THEME.warning} />
              <Text style={styles.rating}>{item.rating?.toFixed(1) ?? '5.0'}</Text>
              <Text style={gs.textSm}>· {item.trips ?? item.totalTrips ?? 0} trips</Text>
            </View>
          </View>
        </View>
        <View style={gs.matchCircle}>
          <Text style={gs.matchCircleText}>{item.matchScore ?? 95}%</Text>
        </View>
      </View>

      {/* Route */}
      <Text style={styles.rideRoute}>{item.route}</Text>

      {/* Meta row */}
      <View style={[gs.row, styles.rideMeta]}>
        <MetaItem icon="time-outline" text={item.time ?? item.departureTime ?? '—'} />
        <MetaItem icon="location-outline" text={`${item.km ?? item.distance ?? 0} km`} />
        <MetaItem icon="people-outline" text={`${item.seats ?? item.seatsAvailable ?? 0} seats`} />
      </View>

      {/* CO₂ */}
      <View style={[gs.row, gs.gap4]}>
        <Ionicons name="leaf" size={14} color={THEME.primary} />
        <Text style={styles.co2Text}>{item.co2 ?? item.co2Saved?.toFixed(1) ?? '0'} kg CO₂ saved</Text>
      </View>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <View style={[gs.row, styles.tagsRow]}>
          {item.tags.map((tag: string) => (
            <View key={tag} style={gs.chip}>
              <Text style={gs.chipText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={[gs.row, styles.rideActions]}>
        <TouchableOpacity style={styles.viewDetailsBtn}>
          <Text style={styles.viewDetailsBtnText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => onBook(item.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.bookBtnText}>Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MetaItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={[gs.row, gs.gap4]}>
      <Ionicons name={icon} size={13} color={THEME.textMuted} />
      <Text style={gs.textSm}>{text}</Text>
    </View>
  );
}

// ══════════════════════════════════════════════════════════════
// OFFER RIDE TAB  – full inline form with GPS
// ══════════════════════════════════════════════════════════════
function OfferRideTab() {
  const { getLocation, loading: locLoading } = useLocation();

  const [origin, setOrigin]           = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('08:15');
  const [seats, setSeats]             = useState(3);
  const [isRecurring, setIsRecurring] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 2, 4]);
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading]         = useState(false);
  const [myOffers, setMyOffers]       = useState<any[]>([]);

  useEffect(() => {
    carpoolingApi.getMyRides().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setMyOffers((res.data as any[]).filter((r: any) => r.user_role === 'driver'));
      }
    });
  }, []);

  const handleUseGPS = async () => {
    const loc = await getLocation();
    if (loc) {
      setOrigin(loc.address);
      setOriginCoords({ lat: loc.lat, lng: loc.lng });
    } else {
      Alert.alert('Location unavailable', 'Please type your origin address manually.');
    }
  };

  const toggleDay = (idx: number) => {
    setSelectedDays(prev =>
      prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx],
    );
  };

  const handleSubmit = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Missing fields', 'Please enter both origin and destination.');
      return;
    }
    if (!departureTime.trim()) {
      Alert.alert('Missing fields', 'Please enter a departure time.');
      return;
    }
    setLoading(true);
    const result = await carpoolingApi.offerRide({
      origin_address: origin,
      destination_address: destination,
      departure_time: departureTime,
      seats_available: seats,
      is_recurring: isRecurring,
      days_of_week: isRecurring ? selectedDays : undefined,
      origin_lat: originCoords?.lat ?? 53.3498,
      origin_lng: originCoords?.lng ?? -6.2603,
      destination_lat: 53.3389,
      destination_lng: -6.2572,
    });
    setLoading(false);
    if (result.success) {
      Alert.alert('Ride Offered! 🎉', 'Coworkers can now request to join your ride.');
      setOrigin('');
      setDestination('');
      setOriginCoords(null);
      // Refresh my offers
      carpoolingApi.getMyRides().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setMyOffers((res.data as any[]).filter((r: any) => r.user_role === 'driver'));
        }
      });
    } else {
      Alert.alert('Error', result.error?.message ?? 'Failed to offer ride');
    }
  };

  const MOCK_OFFER = {
    id: 'o1',
    route: 'Ranelagh → Sandyford BP',
    schedule: 'Mon, Wed, Fri • 08:15 AM',
    ridesGenerated: 24,
    co2_saved: 48.2,
    seats_available: 2,
    newRequests: 2,
    status: 'active',
  };

  const displayOffers = myOffers.length > 0 ? myOffers : [MOCK_OFFER];

  return (
    <KeyboardAvoidingView
      style={gs.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Feature chips ───────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featureScroll}>
          <View style={[styles.featureChip, styles.featureChipBlue]}>
            <Text style={[styles.featureChipTitle, { color: '#3B82F6' }]}>Reduce Emissions</Text>
            <Text style={styles.featureChipSub}>Help the planet</Text>
          </View>
          <View style={[styles.featureChip, styles.featureChipGreen]}>
            <Text style={[styles.featureChipTitle, { color: THEME.primary }]}>Build Community</Text>
            <Text style={styles.featureChipSub}>Meet colleagues</Text>
          </View>
          <View style={[styles.featureChip, styles.featureChipPurple]}>
            <Text style={[styles.featureChipTitle, { color: '#8B5CF6' }]}>Earn OxyPoints</Text>
            <Text style={styles.featureChipSub}>Get rewards</Text>
          </View>
        </ScrollView>

        {/* ── Offer form ──────────────────────────────── */}
        <View style={styles.offerForm}>
          <Text style={styles.formSectionTitle}>New Ride Offer</Text>

          {/* From */}
          <Text style={styles.inputLabel}>From (Origin)</Text>
          <View style={styles.locationRow}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={origin}
              onChangeText={(t) => { setOrigin(t); setOriginCoords(null); }}
              placeholder="Your home / starting address"
              placeholderTextColor={THEME.textMuted}
            />
            <TouchableOpacity
              style={[styles.gpsBtn, locLoading && styles.gpsBtnLoading]}
              onPress={handleUseGPS}
              disabled={locLoading}
            >
              {locLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="navigate" size={18} color="#fff" />
              }
            </TouchableOpacity>
          </View>
          {originCoords && (
            <Text style={styles.coordsHint}>
              📍 GPS: {originCoords.lat.toFixed(4)}, {originCoords.lng.toFixed(4)}
            </Text>
          )}

          {/* To */}
          <Text style={[styles.inputLabel, { marginTop: 14 }]}>To (Destination)</Text>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            placeholder="Office / destination address"
            placeholderTextColor={THEME.textMuted}
          />

          {/* Departure time */}
          <Text style={[styles.inputLabel, { marginTop: 14 }]}>Departure Time</Text>
          <TextInput
            style={styles.input}
            value={departureTime}
            onChangeText={setDepartureTime}
            placeholder="HH:MM (e.g. 08:15)"
            placeholderTextColor={THEME.textMuted}
            keyboardType="numbers-and-punctuation"
          />

          {/* Seats */}
          <Text style={[styles.inputLabel, { marginTop: 14 }]}>Seats Available</Text>
          <View style={[gs.row, styles.seatsRow]}>
            <TouchableOpacity
              style={styles.seatsBtn}
              onPress={() => setSeats(s => Math.max(1, s - 1))}
            >
              <Text style={styles.seatsBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.seatsValue}>{seats}</Text>
            <TouchableOpacity
              style={styles.seatsBtn}
              onPress={() => setSeats(s => Math.min(6, s + 1))}
            >
              <Text style={styles.seatsBtnText}>+</Text>
            </TouchableOpacity>
            <Text style={[gs.textBase, { marginLeft: 8 }]}>seat{seats !== 1 ? 's' : ''}</Text>
          </View>

          {/* Recurring toggle */}
          <View style={[gs.rowBetween, styles.recurringRow]}>
            <View>
              <Text style={styles.inputLabel}>Recurring Ride</Text>
              <Text style={gs.textSm}>Repeat on selected days each week</Text>
            </View>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              trackColor={{ false: THEME.border, true: THEME.primary + '60' }}
              thumbColor={isRecurring ? THEME.primary : THEME.textMuted}
            />
          </View>

          {/* Day selector (when recurring) */}
          {isRecurring && (
            <View style={styles.daysRow}>
              {DAYS.map((day, idx) => {
                const active = selectedDays.includes(idx);
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayChip, active && styles.dayChipActive]}
                    onPress={() => toggleDay(idx)}
                  >
                    <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>Offer This Ride</Text>
            }
          </TouchableOpacity>
        </View>

        {/* ── My Offers ────────────────────────────────── */}
        <Text style={gs.sectionTitle}>My Active Offers</Text>
        {displayOffers.map((offer: any) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function OfferCard({ offer }: { offer: any }) {
  const route = offer.route ?? `${offer.origin ?? ''} → ${offer.destination ?? ''}`;
  const schedule = offer.schedule ?? (offer.departure_time
    ? new Date(offer.departure_time).toLocaleString('en-IE', { dateStyle: 'medium', timeStyle: 'short' })
    : '');
  const statusLabel = offer.status === 'scheduled' ? 'Scheduled'
    : offer.status === 'active' ? 'Active'
    : offer.status === 'completed' ? 'Completed' : offer.status ?? 'Active';

  return (
    <View style={[gs.card, styles.offerCard]}>
      <View style={gs.rowBetween}>
        <Text style={styles.offerRoute}>{route}</Text>
        <View style={gs.pillActive}>
          <Text style={gs.pillActiveText}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={gs.textSm}>{schedule}</Text>

      <View style={[gs.row, styles.offerStats]}>
        <View>
          <Text style={gs.textSm}>Seats Available</Text>
          <Text style={styles.offerStatValue}>{offer.seats_available ?? offer.ridesGenerated ?? 0}</Text>
        </View>
        <View>
          <Text style={gs.textSm}>CO₂ Saved</Text>
          <Text style={[styles.offerStatValue, gs.textGreen]}>
            {(offer.co2_saved ?? offer.co2Saved ?? 0).toFixed(1)} kg
          </Text>
        </View>
      </View>

      {(offer.newRequests ?? 0) > 0 && (
        <TouchableOpacity style={styles.requestsBtn}>
          <Text style={styles.requestsBtnText}>
            {offer.newRequests} New Request{offer.newRequests !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ══════════════════════════════════════════════════════════════
// ACTIVE TRIP TAB
// ══════════════════════════════════════════════════════════════
function ActiveTripTab() {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrip = useCallback(async () => {
    const res = await carpoolingApi.getActiveTrip();
    setTrip(res.success ? res.data : null);
    setLoading(false);
  }, []);

  useEffect(() => { loadTrip(); }, [loadTrip]);

  const onRefresh = async () => { setRefreshing(true); await loadTrip(); setRefreshing(false); };

  const handleStart = async () => {
    if (!trip?.id) return;
    Alert.alert('Start Trip?', 'Mark this trip as started?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start', onPress: async () => {
          const result = await carpoolingApi.startRide(trip.id);
          if (result.success) {
            setTrip((prev: any) => ({ ...prev, status: 'active' }));
            Alert.alert('Trip started!', 'Have a safe journey.');
          } else {
            Alert.alert('Error', result.error?.message ?? 'Failed to start trip');
          }
        },
      },
    ]);
  };

  const handleComplete = async () => {
    if (!trip?.id) return;
    Alert.alert('Complete Trip?', 'Mark this trip as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete', onPress: async () => {
          const result = await carpoolingApi.completeRide(trip.id);
          if (result.success) {
            setTrip(null);
            Alert.alert('Trip completed! 🎉', 'Great job reducing emissions today.');
          } else {
            Alert.alert('Error', result.error?.message ?? 'Failed to complete trip');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <View style={styles.loadingWrap}><ActivityIndicator color={THEME.primary} size="large" /></View>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />}
    >
      {!trip ? (
        <View style={styles.noTripWrap}>
          <View style={styles.noTripIcon}>
            <Ionicons name="car-outline" size={40} color={THEME.primary} />
          </View>
          <Text style={styles.noTripTitle}>No Active Trip</Text>
          <Text style={styles.noTripText}>
            You don't have an active trip right now. Find a ride or offer one to get started.
          </Text>
          <TouchableOpacity style={styles.findRideBtn} activeOpacity={0.85}>
            <Ionicons name="search-outline" size={16} color="#fff" />
            <Text style={styles.findRideBtnText}>Find a Ride</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Live status banner */}
          <View style={[styles.statusBanner, trip.status === 'active' ? styles.statusBannerActive : styles.statusBannerScheduled]}>
            <View style={[styles.statusDot, { backgroundColor: trip.status === 'active' ? THEME.success : THEME.warning }]} />
            <Text style={[styles.statusText, { color: trip.status === 'active' ? THEME.success : THEME.warning }]}>
              {trip.status === 'active' ? 'Trip In Progress' : 'Scheduled'}
            </Text>
            <View style={[styles.statusPill2, { backgroundColor: trip.status === 'active' ? THEME.success + '20' : THEME.warning + '20' }]}>
              <Text style={[styles.statusPill2Text, { color: trip.status === 'active' ? THEME.success : THEME.warning }]}>
                {trip.status === 'active' ? 'Live' : 'Upcoming'}
              </Text>
            </View>
          </View>

          {/* Route card */}
          <View style={gs.card}>
            <Text style={gs.cardTitle}>Route</Text>
            <View style={styles.routeRow}>
              <View style={styles.routeDot} />
              <Text style={styles.routeText}>{trip.origin ?? 'Origin'}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <View style={[styles.routeDot, { backgroundColor: THEME.primary }]} />
              <Text style={styles.routeText}>{trip.destination ?? 'Destination'}</Text>
            </View>
            {trip.departure_time && (
              <View style={[gs.row, gs.gap6, { marginTop: 12 }]}>
                <Ionicons name="time-outline" size={14} color={THEME.textMuted} />
                <Text style={gs.textSm}>
                  {new Date(trip.departure_time).toLocaleString('en-IE', { dateStyle: 'medium', timeStyle: 'short' })}
                </Text>
              </View>
            )}
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={[gs.card, styles.statCard]}>
              <Ionicons name="navigate-outline" size={20} color={THEME.info} />
              <Text style={styles.statValue}>{(trip.distance_km ?? trip.distance ?? 0).toFixed(1)}</Text>
              <Text style={styles.statLabel}>km</Text>
            </View>
            <View style={[gs.card, styles.statCard]}>
              <Ionicons name="people-outline" size={20} color={THEME.primary} />
              <Text style={styles.statValue}>{(trip.seats_total ?? 1) - (trip.seats_available ?? 0)}</Text>
              <Text style={styles.statLabel}>passengers</Text>
            </View>
            <View style={[gs.card, styles.statCard]}>
              <Ionicons name="leaf-outline" size={20} color={THEME.success} />
              <Text style={[styles.statValue, gs.textGreen]}>
                {Math.max(0, trip.co2_saved ?? ((trip.distance_km ?? 10) * 0.168)).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>kg CO₂</Text>
            </View>
          </View>

          {/* Passengers */}
          {(trip.passengers ?? []).length > 0 && (
            <View style={gs.card}>
              <Text style={gs.cardTitle}>Passengers</Text>
              {(trip.passengers as string[]).map((name: string, i: number) => (
                <View key={i} style={styles.passengerRow}>
                  <View style={styles.passengerAvatar}>
                    <Text style={styles.passengerInitial}>{name?.[0]?.toUpperCase() ?? '?'}</Text>
                  </View>
                  <Text style={styles.passengerName}>{name}</Text>
                  <Ionicons name="checkmark-circle" size={18} color={THEME.success} />
                </View>
              ))}
            </View>
          )}

          {/* CO₂ impact card */}
          <View style={[gs.card, styles.impactCard]}>
            <Ionicons name="leaf" size={24} color={THEME.primary} />
            <Text style={styles.impactTitle}>Environmental Impact</Text>
            <Text style={styles.impactValue}>
              ~{Math.max(0, trip.co2_saved ?? ((trip.distance_km ?? 10) * 0.168)).toFixed(1)} kg CO₂ saved
            </Text>
            <Text style={styles.impactSub}>vs. everyone driving solo today</Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            {trip.status !== 'active' && (
              <TouchableOpacity style={[styles.actionBtn, styles.startBtn]} onPress={handleStart} activeOpacity={0.85}>
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Start Trip</Text>
              </TouchableOpacity>
            )}
            {trip.status === 'active' && (
              <TouchableOpacity style={[styles.actionBtn, styles.completeBtn]} onPress={handleComplete} activeOpacity={0.85}>
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Complete Trip</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: THEME.background,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },

  // Status filter pills (My Trips)
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  statusPillActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  statusPillTextActive: {
    color: '#fff',
  },
  resultCount: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 4,
  },

  // ── Search / Offer form ──────────────────────────────────────
  searchForm: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 4,
  },
  offerForm: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1.5,
    borderColor: THEME.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: THEME.textPrimary,
    backgroundColor: THEME.background,
  },
  inputFlex: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  gpsBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsBtnLoading: {
    opacity: 0.6,
  },
  coordsHint: {
    fontSize: 11,
    color: THEME.primary,
    marginTop: 4,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.headerBg,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 14,
  },
  searchBtnDisabled: {
    opacity: 0.6,
  },
  searchBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // Seats picker
  seatsRow: {
    gap: 12,
  },
  seatsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatsBtnText: {
    fontSize: 20,
    color: THEME.primary,
    lineHeight: 24,
  },
  seatsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.textPrimary,
    minWidth: 28,
    textAlign: 'center',
  },

  // Recurring row
  recurringRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },

  // Day chips
  daysRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: THEME.border,
    backgroundColor: THEME.background,
  },
  dayChipActive: {
    borderColor: THEME.primary,
    backgroundColor: THEME.primary + '15',
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  dayChipTextActive: {
    color: THEME.primary,
  },

  // Trip card
  tripCard: {
    gap: 10,
  },
  tripIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripMode: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  tripDate: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  tripRoute: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 1,
  },
  tripWith: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  tripFooter: {
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  co2Text: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.primary,
  },

  // Ride card
  rideCard: {
    gap: 10,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  rating: {
    fontSize: 12,
    color: THEME.warning,
    fontWeight: '600',
  },
  rideRoute: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  rideMeta: {
    gap: 14,
    flexWrap: 'wrap',
  },
  tagsRow: {
    flexWrap: 'wrap',
    gap: 6,
  },
  rideActions: {
    gap: 10,
  },
  viewDetailsBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: THEME.border,
    alignItems: 'center',
  },
  viewDetailsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textPrimary,
  },
  bookBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: THEME.primary,
    alignItems: 'center',
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  // Offer tab
  featureScroll: {
    marginBottom: 4,
  },
  featureChip: {
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    minWidth: 130,
  },
  featureChipBlue: { backgroundColor: '#EFF6FF' },
  featureChipGreen: { backgroundColor: '#F0FDF9' },
  featureChipPurple: { backgroundColor: '#F5F3FF' },
  featureChipTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  featureChipSub: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 2,
  },

  // Offer card
  offerCard: {
    gap: 8,
  },
  offerRoute: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    flex: 1,
  },
  offerStats: {
    gap: 32,
    marginTop: 4,
  },
  offerStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  requestsBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  requestsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textPrimary,
  },

  // ── Active Trip tab ──────────────────────────────────────────
  noTripWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  noTripIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  noTripTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  noTripText: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  findRideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  findRideBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  statusBannerActive: {
    backgroundColor: THEME.success + '12',
    borderColor: THEME.success + '30',
  },
  statusBannerScheduled: {
    backgroundColor: THEME.warning + '12',
    borderColor: THEME.warning + '30',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  statusPill2: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPill2Text: {
    fontSize: 12,
    fontWeight: '700',
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.textMuted,
  },
  routeText: {
    fontSize: 14,
    color: THEME.textPrimary,
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: THEME.border,
    marginLeft: 4,
    marginVertical: 2,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textSecondary,
    textAlign: 'center',
  },

  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  passengerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.primary,
  },
  passengerName: {
    flex: 1,
    fontSize: 14,
    color: THEME.textPrimary,
    fontWeight: '500',
  },

  impactCard: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.primary + '08',
    borderWidth: 1,
    borderColor: THEME.primary + '25',
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.primary,
  },
  impactValue: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.primary,
  },
  impactSub: {
    fontSize: 12,
    color: THEME.textSecondary,
  },

  actionsRow: {
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 15,
  },
  startBtn: {
    backgroundColor: THEME.primary,
  },
  completeBtn: {
    backgroundColor: THEME.success,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
