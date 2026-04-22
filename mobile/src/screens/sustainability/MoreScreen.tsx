import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const MORE_ITEMS = [
  { label: 'Targets & Trajectory', icon: 'flag', color: COLORS.primary },
  { label: 'Baseline Setup', icon: 'layers', color: COLORS.accent },
  { label: 'Scenario Modeling', icon: 'flask', color: COLORS.warning },
  { label: 'Risk Management', icon: 'warning', color: COLORS.error },
  { label: 'Initiative Tracker', icon: 'rocket', color: COLORS.success },
  { label: 'Data Quality', icon: 'shield-checkmark', color: COLORS.info },
  { label: 'Emission Factors', icon: 'calculator', color: COLORS.accent },
  { label: 'Alert Center', icon: 'notifications', color: COLORS.warning },
  { label: 'Settings', icon: 'settings', color: COLORS.textMuted },
];

export default function SustainabilityMoreScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More Tools</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.menu}>
          {MORE_ITEMS.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 16, gap: 16 },
  menu: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.error + '15', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.error + '30' },
  logoutText: { fontSize: 16, color: COLORS.error, fontWeight: '600' },
});
