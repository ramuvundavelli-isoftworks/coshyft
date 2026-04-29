import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { EmployeeStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { THEME, gs } from '../../styles/theme';

type Nav = NativeStackNavigationProp<EmployeeStackParamList>;

const MORE_ITEMS = [
  { label: 'Offer a Ride',    icon: 'car',          screen: 'OfferRide',      color: THEME.warning },
  { label: 'My Trips',        icon: 'time',         screen: 'MyTrips',        color: THEME.info },
  { label: 'My Impact',       icon: 'leaf',         screen: 'MyImpact',       color: THEME.primary },
  { label: 'Recurring Rides', icon: 'repeat',       screen: 'RecurringRides', color: THEME.primary },
  { label: 'Messages',        icon: 'chatbubbles',  screen: 'Messages',       color: THEME.info },
  { label: 'Commute Profile', icon: 'person',       screen: 'CommuteProfile', color: THEME.success },
  { label: 'Settings',        icon: 'settings',     screen: 'Settings',       color: THEME.textMuted },
];

export default function MoreScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[gs.flex1, styles.screen]}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />

      {/* ── Header ─────────────────────────────────────── */}
      <View style={[gs.header, { paddingTop: insets.top + 10 }]}>
        <View style={gs.headerRow}>
          <Text style={gs.headerPageTitle}>More</Text>
          <BellButton count={2} />
        </View>
      </View>

      <ScrollView contentContainerStyle={gs.scrollContent}>
        {/* ── User card ──────────────────────────────────── */}
        <View style={[gs.card, styles.userCard]}>
          <View style={gs.avatarLg}>
            <Text style={gs.avatarTextLg}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name ?? 'Employee'}</Text>
            <Text style={styles.userRole}>
              {user?.role ?? 'employee'} · {user?.tenant_name ?? 'CoShift'}
            </Text>
            {user?.department && (
              <View style={[gs.chip, styles.deptChip]}>
                <Text style={gs.chipText}>{user.department}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Menu ───────────────────────────────────────── */}
        <View style={gs.card}>
          {MORE_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.screen}
              style={[styles.menuItem, idx < MORE_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={() => navigation.navigate(item.screen as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={THEME.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
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

const styles = StyleSheet.create({
  screen: {
    backgroundColor: THEME.background,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  userRole: {
    fontSize: 13,
    color: THEME.textSecondary,
    textTransform: 'capitalize',
  },
  deptChip: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: THEME.textPrimary,
    fontWeight: '500',
  },
});
