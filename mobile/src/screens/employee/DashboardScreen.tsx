import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, RefreshControl, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { commuteApi, gamificationApi, carpoolingApi } from '../../api';
import { THEME, gs } from '../../styles/theme';
import type { EmployeeStackParamList, EmployeeTabParamList } from '../../types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type Nav = NativeStackNavigationProp<EmployeeStackParamList> & BottomTabNavigationProp<EmployeeTabParamList>;

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<any>(null);
  const [gamification, setGamification] = useState<any>(null);
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [statsRes, gamRes, tripRes] = await Promise.all([
      commuteApi.getStats(),
      gamificationApi.getProfile(),
      carpoolingApi.getActiveTrip(),
    ]);
    if (statsRes.success) setStats(statsRes.data);
    if (gamRes.success) setGamification(gamRes.data);
    // Only set active trip if one actually exists
    if (tripRes.success && tripRes.data) setActiveTrip(tripRes.data);
    else setActiveTrip(null);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const totalCommutes   = stats?.total_commutes ?? 127;
  const co2Saved        = stats?.co2_saved_vs_car?.toFixed(1) ?? '43.2';
  const carpoolRides    = stats?.carpool_rides ?? 34;
  const monthlyGoal     = 160;
  const monthlyProgress = stats?.monthly_co2_saved ?? 142.5;
  const progressPct     = Math.min((monthlyProgress / monthlyGoal) * 100, 100);

  // Parse active trip for display
  const isDriver         = !activeTrip?.driver_id || activeTrip?.is_driver;
  const tripTime         = activeTrip?.departure_time
    ? new Date(activeTrip.departure_time).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })
    : '8:30 AM';
  const tripRoute        = activeTrip
    ? `${activeTrip.origin ?? activeTrip.origin_address ?? 'Origin'} → ${activeTrip.destination ?? activeTrip.destination_address ?? 'Destination'}`
    : '';
  const tripPassengers   = activeTrip?.passengers ?? activeTrip?.passenger_count ?? 3;
  const tripPassengerNames = activeTrip?.passenger_names?.join(', ') ?? 'Passengers';
  const tripCo2          = activeTrip?.co2_saved?.toFixed(1) ?? '2.5';

  return (
    <View style={[gs.flex1, styles.container]}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />

      {/* ── Header ─────────────────────────────────────────── */}
      <View style={[gs.header, { paddingTop: insets.top + 10 }]}>
        <View style={gs.headerRow}>
          <Text style={gs.headerAppTitle}>CoShyft</Text>
          <BellButton count={2} />
        </View>
        <Text style={gs.headerWelcome}>
          Welcome back, <Text style={gs.headerBoldName}>{firstName}</Text>
        </Text>
        {/* Search bar */}
        <View style={gs.searchBar}>
          <Ionicons name="search" size={18} color={THEME.textMuted} />
          <Text style={gs.searchPlaceholder}>Search rides, trips, colleagues...</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.primary}
            colors={[THEME.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Horizontal stats row ───────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScroll}
        >
          <StatCard label="TOTAL COMMUTES" value={String(totalCommutes)} trend="+12%" />
          <StatCard label="CO₂ SAVED" value={`${co2Saved} kg`} trend="+8%" />
          <StatCard label="CARPOOL RIDES" value={String(carpoolRides)} trend="+18%" />
        </ScrollView>

        {/* ── Active trip card (only when there's an active trip) ── */}
        {activeTrip ? (
          <View style={gs.card}>
            <View style={[gs.rowBetween, gs.gap12]}>
              <View style={styles.tripIconWrap}>
                <Ionicons name="people" size={22} color={THEME.primary} />
              </View>
              <Text style={styles.tripTitle}>
                {isDriver ? "You're driving today" : "You're a passenger today"}
              </Text>
              <View style={gs.pillActive}>
                <Text style={gs.pillActiveText}>Active</Text>
              </View>
            </View>

            <View style={[gs.row, styles.tripMeta]}>
              <View style={[gs.row, gs.gap4]}>
                <Ionicons name="time-outline" size={14} color={THEME.textMuted} />
                <Text style={gs.textBase}>{tripTime} departure</Text>
              </View>
              <View style={[gs.row, gs.gap4]}>
                <Ionicons name="location-outline" size={14} color={THEME.textMuted} />
                <Text style={gs.textBase}>{tripRoute}</Text>
              </View>
            </View>

            <View style={[gs.chip, styles.passengerChip]}>
              <Text style={gs.chipText}>{tripPassengers} passenger{tripPassengers !== 1 ? 's' : ''}</Text>
            </View>
            <Text style={styles.passengerNames}>{tripPassengerNames}</Text>

            <View style={gs.divider} />

            <View style={gs.rowBetween}>
              <View style={[gs.row, gs.gap6]}>
                <Ionicons name="leaf" size={16} color={THEME.primary} />
                <Text style={styles.co2Label}>
                  <Text style={gs.textGreen}>+{tripCo2} kg</Text>
                  {'  '}CO₂ saved
                </Text>
              </View>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => navigation.navigate('ActiveTrip')}
                activeOpacity={0.85}
              >
                <Text style={styles.startBtnText}>View Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── No active trip – quick action card ────────────── */
          <View style={[gs.card, styles.noTripCard]}>
            <View style={[gs.row, gs.gap12]}>
              <View style={styles.tripIconWrap}>
                <Ionicons name="car-outline" size={22} color={THEME.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.noTripTitle}>No active trip today</Text>
                <Text style={gs.textBase}>Find a ride or log your commute to get started.</Text>
              </View>
            </View>
            <View style={[gs.row, styles.noTripActions]}>
              <TouchableOpacity
                style={styles.findRideBtn}
                onPress={() => (navigation as any).navigate('Rides')}
                activeOpacity={0.85}
              >
                <Text style={styles.findRideBtnText}>Find a Ride</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logBtn}
                onPress={() => (navigation as any).navigate('LogCommute')}
                activeOpacity={0.85}
              >
                <Text style={styles.logBtnText}>Log Commute</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Monthly CO₂ progress card ──────────────────────── */}
        <View style={[gs.card, styles.progressCard]}>
          <View style={gs.rowBetween}>
            <View>
              <Text style={styles.progressValue}>{monthlyProgress} kg</Text>
              <Text style={gs.textBase}>CO₂ saved this month</Text>
            </View>
            <Ionicons name="trending-up" size={28} color={THEME.primary} />
          </View>

          <View style={styles.progressRow}>
            <Text style={gs.textSm}>Monthly goal</Text>
            <Text style={gs.textSm}>{monthlyGoal} kg</Text>
          </View>
          <View style={gs.progressTrack}>
            <View style={[gs.progressFill, { width: `${progressPct}%` as any }]} />
          </View>

          <View style={styles.progressFooter}>
            <Text style={gs.textSm}>
              {Math.round((stats?.co2_saved_vs_car ?? 142.5) / 21.77)} trees equivalent
            </Text>
            <Text style={[gs.textSm, gs.textGreen]}>{progressPct.toFixed(0)}% complete</Text>
          </View>
        </View>

        {/* ── OxyPoints banner ───────────────────────────────── */}
        {gamification && (
          <TouchableOpacity
            style={styles.pointsBanner}
            onPress={() => (navigation as any).navigate('Rewards')}
            activeOpacity={0.85}
          >
            <View style={[gs.row, gs.gap12]}>
              <View style={styles.pointsIconBg}>
                <Ionicons name="star" size={20} color={THEME.primary} />
              </View>
              <View>
                <Text style={styles.pointsLabel}>OxyPoints Balance</Text>
                <Text style={styles.pointsValue}>
                  {(gamification.total_points ?? 0).toLocaleString()} pts
                </Text>
              </View>
            </View>
            <View style={[gs.row, gs.gap6]}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lv {gamification.level ?? 1}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={THEME.primary} />
            </View>
          </TouchableOpacity>
        )}

        {/* ── My Impact shortcut ─────────────────────────────── */}
        <TouchableOpacity
          style={styles.impactLink}
          onPress={() => navigation.navigate('MyImpact')}
          activeOpacity={0.85}
        >
          <View style={[gs.row, gs.gap10]}>
            <View style={styles.impactIcon}>
              <Ionicons name="leaf" size={18} color={THEME.primary} />
            </View>
            <View>
              <Text style={styles.impactLinkTitle}>View My Impact Report</Text>
              <Text style={gs.textSm}>Full CO₂ savings & trends breakdown</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={THEME.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTrend}>{trend}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },

  // Horizontal stats
  statsScroll: {
    gap: 12,
    paddingRight: 4,
  },
  statCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.textMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.textPrimary,
    marginTop: 4,
  },
  statTrend: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.success,
    marginTop: 4,
  },

  // Trip card
  tripIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  tripMeta: {
    marginTop: 12,
    gap: 16,
    flexWrap: 'wrap',
  },
  passengerChip: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 1,
    borderColor: THEME.primary + '40',
    backgroundColor: THEME.successBg,
  },
  passengerNames: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 6,
  },
  co2Label: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  startBtn: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
  },
  startBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  // No active trip card
  noTripCard: {
    gap: 14,
  },
  noTripTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  noTripActions: {
    gap: 10,
  },
  findRideBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: THEME.primary,
    alignItems: 'center',
  },
  findRideBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  logBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: THEME.border,
    alignItems: 'center',
  },
  logBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textPrimary,
  },

  // Monthly progress card
  progressCard: {
    backgroundColor: '#F0FAF5',
    borderWidth: 1,
    borderColor: '#C6E8D8',
    gap: 10,
  },
  progressValue: {
    fontSize: 30,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  // OxyPoints banner
  pointsBanner: {
    backgroundColor: '#F0FDF9',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pointsIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 11,
    color: THEME.success,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },

  // Impact link
  impactLink: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  impactIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactLinkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textPrimary,
  },
});
