import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { commuteApi } from '../../api';
import { THEME, gs } from '../../styles/theme';
import type { EmployeeStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<EmployeeStackParamList>;

const PREFERRED_MODES = ['Carpool', 'Public Transit'];
const CARPOOL_PREFS = ['Music OK', 'Conversation welcome', 'No smoking'];

export default function ProfileScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = useCallback(async () => {
    const res = await commuteApi.getCommuteProfile();
    if (res.success) setProfile(res.data);
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const officeLocation = profile?.default_destination_address ?? 'Dublin HQ';
  const homeLocation   = profile?.default_origin_address ?? 'Ranelagh, Dublin 6';
  const arrival        = profile?.typical_arrival_time ?? '09:00';
  const departure      = profile?.typical_departure_time ?? '17:30';
  const vehicleMake    = profile?.vehicle_make ?? '';
  const vehicleModel   = profile?.vehicle_model ?? '';

  return (
    <View style={[gs.flex1, styles.screen]}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />

      {/* ── Header ─────────────────────────────────────── */}
      <View style={[gs.header, { paddingTop: insets.top + 10 }]}>
        <View style={gs.headerRow}>
          <Text style={gs.headerPageTitle}>Profile</Text>
          <BellButton count={2} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />
        }
        contentContainerStyle={gs.scrollContent}
      >
        {/* ── User card ──────────────────────────────────── */}
        <View style={[gs.card, styles.userCard]}>
          <View style={[gs.row, gs.gap14]}>
            <View style={gs.avatarLg}>
              <Text style={gs.avatarTextLg}>{initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name ?? 'Alex Chen'}</Text>
              <Text style={styles.userEmail}>{user?.email ?? 'alex.chen@techcorp.ie'}</Text>
              <View style={[gs.chip, styles.deptChip]}>
                <Text style={gs.chipText}>{user?.department ?? 'Engineering'}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={styles.editIcon}
            >
              <Ionicons name="create-outline" size={20} color={THEME.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('CommuteProfile')}
          >
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Commute Information ────────────────────────── */}
        <View style={gs.card}>
          <View style={[gs.rowBetween, styles.sectionHeaderRow]}>
            <Text style={gs.cardTitle}>Commute Information</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CommuteProfile')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <InfoRow icon="business-outline" label="Office Location" value={officeLocation} />
          <View style={gs.divider} />
          <InfoRow
            icon="home-outline"
            label="Home Location"
            value={homeLocation}
            hint="Only city visible to others"
          />
          <View style={gs.divider} />

          <View style={[gs.row, gs.gap12]}>
            <View style={styles.timeBlock}>
              <View style={[gs.row, gs.gap6]}>
                <Ionicons name="time-outline" size={14} color={THEME.textMuted} />
                <Text style={gs.textSm}>Arrival</Text>
              </View>
              <Text style={styles.timeValue}>{arrival}</Text>
            </View>
            <View style={styles.timeBlock}>
              <View style={[gs.row, gs.gap6]}>
                <Ionicons name="time-outline" size={14} color={THEME.textMuted} />
                <Text style={gs.textSm}>Departure</Text>
              </View>
              <Text style={styles.timeValue}>{departure}</Text>
            </View>
          </View>
        </View>

        {/* ── Transport Preferences ──────────────────────── */}
        <View style={gs.card}>
          <Text style={gs.cardTitle}>Transport Preferences</Text>

          <Text style={styles.prefLabel}>Preferred Modes</Text>
          <View style={[gs.row, styles.modesRow]}>
            {PREFERRED_MODES.map(mode => (
              <View key={mode} style={styles.modeChip}>
                <Text style={styles.modeChipText}>{mode}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.prefLabel, styles.prefLabelGap]}>Carpool Preferences</Text>
          <View style={styles.prefsCol}>
            {CARPOOL_PREFS.map(pref => (
              <View key={pref} style={[gs.row, gs.gap8]}>
                <Ionicons name="checkmark" size={14} color={THEME.textSecondary} />
                <Text style={gs.textBase}>{pref}</Text>
              </View>
            ))}
          </View>

          {(vehicleMake || vehicleModel) && (
            <>
              <View style={gs.divider} />
              <View style={[gs.row, gs.gap12]}>
                <View style={styles.vehicleBlock}>
                  <Text style={gs.textSm}>Make</Text>
                  <Text style={styles.vehicleValue}>{vehicleMake}</Text>
                </View>
                <View style={styles.vehicleBlock}>
                  <Text style={gs.textSm}>Model</Text>
                  <Text style={styles.vehicleValue}>{vehicleModel}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* ── Quick links ────────────────────────────────── */}
        <View style={gs.card}>
          {QUICK_LINKS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.quickLink, idx < QUICK_LINKS.length - 1 && styles.quickLinkBorder]}
              onPress={() => navigation.navigate(item.screen as any)}
            >
              <View style={[styles.quickLinkIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={styles.quickLinkLabel}>{item.label}</Text>
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

function InfoRow({
  icon, label, value, hint,
}: { icon: any; label: string; value: string; hint?: string }) {
  return (
    <View style={[gs.row, styles.infoRow]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={THEME.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={gs.textSm}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
        {hint && <Text style={gs.textSm}>{hint}</Text>}
      </View>
    </View>
  );
}

const QUICK_LINKS = [
  { label: 'Messages',        icon: 'chatbubbles',  screen: 'Messages',       color: THEME.info },
  { label: 'Recurring Rides', icon: 'repeat',       screen: 'RecurringRides', color: THEME.primary },
  { label: 'Settings',        icon: 'settings',     screen: 'Settings',       color: THEME.textMuted },
];

const styles = StyleSheet.create({
  screen: {
    backgroundColor: THEME.background,
  },

  // User card
  userCard: {
    gap: 14,
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  deptChip: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  editIcon: {
    padding: 4,
  },
  editProfileBtn: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: THEME.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editProfileBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textPrimary,
  },

  // Commute info
  sectionHeaderRow: {
    marginBottom: 14,
  },
  editLink: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.primary,
  },
  infoRow: {
    gap: 12,
    paddingVertical: 4,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textPrimary,
  },
  timeBlock: {
    flex: 1,
    backgroundColor: THEME.background,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textPrimary,
  },

  // Transport preferences
  prefLabel: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginBottom: 8,
  },
  prefLabelGap: {
    marginTop: 14,
  },
  modesRow: {
    gap: 8,
    flexWrap: 'wrap',
  },
  modeChip: {
    backgroundColor: THEME.successBg,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  modeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.successText,
  },
  prefsCol: {
    gap: 8,
  },
  vehicleBlock: {
    flex: 1,
    gap: 3,
  },
  vehicleValue: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textPrimary,
  },

  // Quick links
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  quickLinkBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  quickLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkLabel: {
    flex: 1,
    fontSize: 14,
    color: THEME.textPrimary,
    fontWeight: '500',
  },
});
