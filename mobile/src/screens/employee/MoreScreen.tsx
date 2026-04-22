import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { EmployeeStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants';

type Nav = NativeStackNavigationProp<EmployeeStackParamList>;

const MORE_ITEMS = [
  { label: 'Offer a Ride', icon: 'car', screen: 'OfferRide', color: COLORS.warning },
  { label: 'My Trips', icon: 'time', screen: 'MyTrips', color: COLORS.accent },
  { label: 'Recurring Rides', icon: 'repeat', screen: 'RecurringRides', color: COLORS.primary },
  { label: 'OxyPoints & Rewards', icon: 'trophy', screen: 'Rewards', color: COLORS.warning },
  { label: 'Messages', icon: 'chatbubbles', screen: 'Messages', color: COLORS.info },
  { label: 'Commute Profile', icon: 'person', screen: 'CommuteProfile', color: COLORS.success },
  { label: 'Settings', icon: 'settings', screen: 'Settings', color: COLORS.textMuted },
];

export default function MoreScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{(user?.name ?? 'U')[0]}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>{user?.role} · {user?.tenant_name ?? 'CoShift'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {MORE_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen as any)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 16, gap: 16 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary + '30', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  userAvatarText: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  userName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  userRole: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  menu: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
});
