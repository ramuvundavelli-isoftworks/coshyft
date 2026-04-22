import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants';
import ScreenHeader from '../../components/layout/ScreenHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const handleLogout = () => setLogoutDialogVisible(true);
  const closeLogoutDialog = () => setLogoutDialogVisible(false);
  const confirmLogout = () => {
    closeLogoutDialog();
    logout();
  };

  return (
    <>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile */}
        <Card style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.profileBadges}>
              <Badge label={user?.role ?? 'employee'} variant="info" />
              {user?.department && <Badge label={user.department} variant="default" />}
            </View>
          </View>
        </Card>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Card>
          <SettingToggle label="Push Notifications" sub="Ride requests, trip reminders" value={notifications} onToggle={setNotifications} />
          <View style={styles.divider} />
          <SettingToggle label="Location Tracking" sub="For automatic commute detection" value={locationTracking} onToggle={setLocationTracking} />
          <View style={styles.divider} />
          <SettingToggle label="Biometric Login" sub="Use Face ID / Fingerprint" value={biometrics} onToggle={setBiometrics} />
        </Card>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card>
          <SettingRow label="Commute Profile" icon="person-outline" onPress={() => navigation.navigate('CommuteProfile' as never)} />
          <View style={styles.divider} />
          <SettingRow label="Change Password" icon="lock-closed-outline" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow label="GDPR & Privacy" icon="shield-outline" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow label="Export My Data" icon="download-outline" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow label="Delete Account" icon="trash-outline" onPress={() => {}} danger />
        </Card>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <Card>
          <SettingRow label="About CoShift" icon="information-circle-outline" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow label="Privacy Policy" icon="document-text-outline" onPress={() => {}} />
          <View style={styles.divider} />
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>App Version</Text>
            <Text style={styles.versionValue}>1.0.0</Text>
          </View>
        </Card>

        {/* Sign Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <ConfirmDialog
          visible={logoutDialogVisible}
          title="Sign Out"
          message="Are you sure you want to sign out?"
          confirmLabel="Sign Out"
          cancelLabel="Cancel"
          onConfirm={confirmLogout}
          onCancel={closeLogoutDialog}
        />

        <Text style={styles.footer}>
          CoShift · CSRD Compliant · SEAI 2024 Emission Factors · GDPR Compliant
        </Text>
      </ScrollView>
    </>
  );
}

function SettingToggle({ label, sub, value, onToggle }: any) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sub && <Text style={styles.settingSub}>{sub}</Text>}
      </View>
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }} thumbColor={value ? COLORS.primary : COLORS.textMuted} />
    </View>
  );
}

function SettingRow({ label, icon, onPress, danger }: any) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <Ionicons name={icon} size={18} color={danger ? COLORS.error : COLORS.textSecondary} />
      <Text style={[styles.settingLabel, styles.settingRowLabel, danger && { color: COLORS.error }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40, gap: 8 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12, backgroundColor: COLORS.primary + '08', borderColor: 'transparent' },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 5 },
  profileAvatarText: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  profileInfo: { flex: 1, gap: 5 },
  profileName: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  profileEmail: { fontSize: 13, color: COLORS.textSecondary },
  profileBadges: { flexDirection: 'row', gap: 6, marginTop: 6 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8, marginBottom: 4 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  settingLeft: { flex: 1 },
  settingLabel: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  settingRowLabel: { flex: 1 },
  settingSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  versionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  versionLabel: { fontSize: 15, color: COLORS.textSecondary },
  versionValue: { fontSize: 15, color: COLORS.textMuted },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.error + '15', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.error + '30', marginTop: 8 },
  logoutText: { fontSize: 16, color: COLORS.error, fontWeight: '600' },
  footer: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', marginTop: 8 },
});
