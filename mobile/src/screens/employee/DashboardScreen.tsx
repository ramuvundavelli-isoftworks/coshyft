import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { commuteApi, gamificationApi } from '../../api';
import { COLORS } from '../../constants';
import type { EmployeeStackParamList } from '../../types';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

type Nav = NativeStackNavigationProp<EmployeeStackParamList>;

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<any>(null);
  const [gamification, setGamification] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [statsRes, gamRes] = await Promise.all([
      commuteApi.getStats(),
      gamificationApi.getProfile(),
    ]);
    if (statsRes.success) setStats(statsRes.data);
    if (gamRes.success) setGamification(gamRes.data);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = new Date().toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{greeting}, {firstName} 👋</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('Settings')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        contentContainerStyle={styles.content}
      >
        {/* OxyPoints Banner */}
        {gamification && (
          <TouchableOpacity style={styles.pointsBanner} onPress={() => navigation.navigate('Rewards')} activeOpacity={0.85}>
            <View style={styles.pointsBannerLeft}>
              <View style={styles.pointsIconBg}>
                <Ionicons name="leaf" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.pointsLabel}>OxyPoints Balance</Text>
                <Text style={styles.pointsValue}>{gamification.total_points?.toLocaleString() ?? '0'} pts</Text>
              </View>
            </View>
            <View style={styles.pointsRight}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lv {gamification.level ?? 1}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <QuickAction icon="add-circle" label="Log Trip" color={COLORS.primary} onPress={() => navigation.navigate('EmployeeTabs')} />
            <QuickAction icon="search" label="Find Ride" color={COLORS.accent} onPress={() => navigation.navigate('EmployeeTabs')} />
            <QuickAction icon="car" label="Offer Ride" color={COLORS.carpool} onPress={() => navigation.navigate('OfferRide')} />
            <QuickAction icon="time" label="My Trips" color={COLORS.info} onPress={() => navigation.navigate('MyTrips')} />
          </View>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Month</Text>
            <View style={styles.statsRow}>
              <StatCard label="CO₂ Saved" value={stats.co2_saved_vs_car?.toFixed(1) ?? '0'} unit="kg" icon="leaf" iconColor={COLORS.success} style={styles.halfCard} />
              <StatCard label="Commutes" value={String(stats.total_commutes ?? 0)} icon="bicycle" iconColor={COLORS.accent} style={styles.halfCard} />
            </View>
            <View style={styles.statsRow}>
              <StatCard label="Distance" value={stats.total_distance_km?.toFixed(0) ?? '0'} unit="km" icon="navigate" iconColor={COLORS.warning} style={styles.halfCard} />
              <StatCard label="Streak" value={String(stats.streak ?? 0)} unit="days" icon="flame" iconColor={COLORS.error} style={styles.halfCard} />
            </View>
          </View>
        )}

        {/* Active Trip */}
        <TouchableOpacity style={styles.activeTripCard} onPress={() => navigation.navigate('ActiveTrip')} activeOpacity={0.85}>
          <View style={styles.activeTripLeft}>
            <View style={styles.activeDot} />
            <View>
              <Text style={styles.activeTripTitle}>Check Active Trip</Text>
              <Text style={styles.activeTripSub}>View your current journey status</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* CSRD Compliance */}
        <Card>
          <View style={styles.complianceHeader}>
            <View style={styles.complianceIconBg}>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.complianceTitle}>CSRD Compliant Tracking</Text>
          </View>
          <Text style={styles.complianceText}>
            Your commutes contribute to your company's Scope 3 Category 7 emissions reporting under ESRS E1 guidelines.
          </Text>
          <View style={styles.complianceBadges}>
            <Badge label="SEAI 2024" variant="success" />
            <Badge label="Audit Grade" variant="info" />
            <Badge label="GDPR Safe" variant="default" />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function QuickAction({ icon, label, color, onPress }: { icon: any; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  date: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  avatarBtn: {},
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.primary + '40',
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },

  content: { padding: 16, paddingBottom: 32, gap: 16 },

  // OxyPoints
  pointsBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14, padding: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  pointsBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pointsIconBg: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  pointsLabel: { fontSize: 11, color: COLORS.success, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  pointsValue: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginTop: 1 },
  pointsRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  levelText: { fontSize: 12, color: '#fff', fontWeight: '700' },

  // Sections
  section: { gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },

  // Quick Actions
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', flex: 1 },
  quickActionIcon: { width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  quickActionLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', textAlign: 'center' },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12 },
  halfCard: { flex: 1 },

  // Active Trip
  activeTripCard: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  activeTripLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success },
  activeTripTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  activeTripSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Compliance
  complianceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  complianceIconBg: { width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  complianceTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  complianceText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 10 },
  complianceBadges: { flexDirection: 'row', gap: 6 },
});
