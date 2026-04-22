import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auditorApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const REVIEW_AREAS = [
  { id: 'emissions', label: 'Emissions Data', icon: 'cloud' },
  { id: 'baseline', label: 'Baseline', icon: 'layers' },
  { id: 'factors', label: 'Emission Factors', icon: 'calculator' },
  { id: 'risks', label: 'Risk Assessment', icon: 'warning' },
];

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const [selectedArea, setSelectedArea] = useState('emissions');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadArea(selectedArea); }, [selectedArea]);

  const loadArea = async (area: string) => {
    setLoading(true);
    let result;
    if (area === 'emissions') result = await auditorApi.reviewEmissions();
    else if (area === 'baseline') result = await auditorApi.reviewBaseline();
    else if (area === 'factors') result = await auditorApi.reviewFactors();
    else result = await auditorApi.reviewRisks();
    if (result.success) setData(result.data);
    setLoading(false);
  };

  const handleApprove = async () => {
    const result = await auditorApi.approveReviewArea(selectedArea);
    if (result.success) Alert.alert('Area Approved', `${selectedArea} has been marked as approved.`);
    else Alert.alert('Error', result.error?.message ?? 'Approval failed');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review Areas</Text>
      </View>
      <View style={styles.tabs}>
        {REVIEW_AREAS.map(area => (
          <TouchableOpacity key={area.id} style={[styles.tab, selectedArea === area.id && styles.activeTab]} onPress={() => setSelectedArea(area.id)}>
            <Ionicons name={area.icon as any} size={16} color={selectedArea === area.id ? COLORS.warning : COLORS.textMuted} />
            <Text style={[styles.tabText, selectedArea === area.id && styles.activeTabText]}>{area.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? <LoadingSpinner /> : (
          <>
            <Card title="Review Summary">
              <Text style={styles.dataText}>{JSON.stringify(data ?? {}, null, 2).slice(0, 400)}</Text>
            </Card>
            <Card style={styles.actionsCard}>
              <Text style={styles.actionsTitle}>Auditor Actions</Text>
              <Button title="Approve This Area" onPress={handleApprove} variant="primary" size="sm" />
              <Button title="Add Finding" onPress={() => Alert.alert('Feature', 'Add audit finding')} variant="secondary" size="sm" style={styles.actionBtn} />
              <Button title="Request Clarification" onPress={() => Alert.alert('Feature', 'Request clarification')} variant="ghost" size="sm" />
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingHorizontal: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 3, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.warning },
  tabText: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  activeTabText: { color: COLORS.warning, fontWeight: '600' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  dataText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: 'monospace' },
  actionsCard: { gap: 10 },
  actionsTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  actionBtn: { marginVertical: 2 },
});
