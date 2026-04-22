import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { superadminApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function SuperAdminSettingsScreen() {
  const { logout } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    superadminApi.getSettings().then(r => { if (r.success) setSettings(r.data); setLoading(false); });
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Platform Settings">
        {Object.entries(settings ?? {}).slice(0, 8).map(([key, value]) => (
          <View key={key} style={styles.settingRow}>
            <Text style={styles.settingKey}>{key.replace(/_/g, ' ')}</Text>
            <Text style={styles.settingValue}>{String(value)}</Text>
          </View>
        ))}
        {!settings && <Text style={styles.noData}>No platform settings available.</Text>}
      </Card>

      <Card title="Danger Zone">
        <Text style={styles.dangerText}>Platform-wide destructive actions should be performed via the web admin portal.</Text>
      </Card>

      <Button
        title="Sign Out"
        onPress={() => Alert.alert('Sign Out?', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out', style: 'destructive', onPress: logout }])}
        variant="danger"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingKey: { fontSize: 13, color: COLORS.textSecondary, textTransform: 'capitalize', flex: 1 },
  settingValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', flex: 1, textAlign: 'right' },
  dangerText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  noData: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', padding: 12 },
});
