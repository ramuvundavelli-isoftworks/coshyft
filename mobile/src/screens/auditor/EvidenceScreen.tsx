import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auditorApi } from '../../api';
import { COLORS } from '../../constants';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function EvidenceScreen() {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => { const r = await auditorApi.getEvidence(); if (r.success) setEvidence(r.data as any[] ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleVerify = async (evidenceId: string) => {
    const result = await auditorApi.verifyEvidence(evidenceId);
    if (result.success) { Alert.alert('Verified!'); load(); }
    else Alert.alert('Error', result.error?.message ?? 'Failed to verify');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <FlatList
      data={evidence}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={[styles.content, evidence.length === 0 && styles.emptyContent]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.warning} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="folder-open-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No evidence items found</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.evidenceCard}>
          <View style={styles.evidenceHeader}>
            <Ionicons name="document-attach-outline" size={20} color={COLORS.warning} />
            <View style={styles.evidenceInfo}>
              <Text style={styles.evidenceTitle}>{item.title ?? item.file_name ?? 'Evidence Document'}</Text>
              <Text style={styles.evidenceDate}>{item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString('en-IE') : ''}</Text>
            </View>
            <Badge label={item.verified ? 'Verified' : 'Pending'} variant={item.verified ? 'success' : 'warning'} />
          </View>
          {!item.verified && (
            <TouchableOpacity style={styles.verifyBtn} onPress={() => handleVerify(item.id)}>
              <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
              <Text style={styles.verifyText}>Mark as Verified</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  emptyContent: { flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
  evidenceCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  evidenceHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  evidenceInfo: { flex: 1 },
  evidenceTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  evidenceDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  verifyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.success + '15', borderRadius: 8, padding: 8 },
  verifyText: { fontSize: 13, color: COLORS.success, fontWeight: '500' },
});
