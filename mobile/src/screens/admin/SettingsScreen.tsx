import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { adminApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettingsScreen() {
  const { logout } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getSettings().then(r => { if (r.success) setSettings(r.data); setLoading(false); });
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Organisation Settings">
        <Text style={styles.settingLabel}>Tenant</Text>
        <Text style={styles.settingValue}>{settings?.tenant_name ?? 'CoShift Enterprise'}</Text>
        <Text style={styles.settingLabel}>Region</Text>
        <Text style={styles.settingValue}>{settings?.region ?? 'Ireland (IE)'}</Text>
        <Text style={styles.settingLabel}>Reporting Year</Text>
        <Text style={styles.settingValue}>{settings?.reporting_year ?? '2026'}</Text>
      </Card>

      <Card title="Policy Settings">
        <Text style={styles.noData}>Configure commute policies, participation targets, and workplace benefits in the web portal for full functionality.</Text>
      </Card>

      <Button title="Sign Out" onPress={() => Alert.alert('Sign Out?', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out', style: 'destructive', onPress: logout }])} variant="danger" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  settingLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  settingValue: { fontSize: 15, color: COLORS.textPrimary, marginTop: 4 },
  noData: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
});
