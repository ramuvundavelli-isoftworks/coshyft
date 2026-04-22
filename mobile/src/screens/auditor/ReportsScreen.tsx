import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auditorApi } from '../../api';
import { COLORS } from '../../constants';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AuditorReportsScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditorApi.getAuditReports().then(r => { if (r.success) setReports(r.data as any[] ?? []); setLoading(false); });
  }, []);

  const handleCreate = async () => {
    const result = await auditorApi.createAuditReport({
      title: `Audit Report ${new Date().getFullYear()}`,
      reporting_year: new Date().getFullYear(),
      scope: 'Scope 3 Category 7',
      overall_opinion: 'No material misstatements identified',
    });
    if (result.success) { Alert.alert('Report Created'); auditorApi.getAuditReports().then(r => { if (r.success) setReports(r.data as any[] ?? []); }); }
    else Alert.alert('Error', result.error?.message ?? 'Failed to create report');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <Button title="Create New Audit Report" onPress={handleCreate} style={styles.createBtn} />
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No audit reports yet</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Ionicons name="document-text" size={20} color={COLORS.warning} />
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{item.title}</Text>
              <Text style={styles.reportYear}>Reporting Year: {item.reporting_year}</Text>
              {item.scope && <Text style={styles.reportScope}>{item.scope}</Text>}
            </View>
            <Badge label={item.status ?? 'draft'} variant={item.status === 'final' ? 'success' : 'warning'} />
          </View>
          {item.overall_opinion && <Text style={styles.reportOpinion}>{item.overall_opinion}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  createBtn: { marginBottom: 8 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
  reportCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border, gap: 8 },
  reportHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  reportYear: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  reportScope: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  reportOpinion: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic' },
});
