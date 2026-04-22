import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { emissionsApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function EmissionsScreen() {
  const insets = useSafeAreaInsets();
  const [modeSplit, setModeSplit] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([emissionsApi.getModeSplit(), emissionsApi.getLocationPerformance()]).then(([modeRes, locRes]) => {
      if (modeRes.success) setModeSplit(modeRes.data as any[] ?? []);
      if (locRes.success) setLocations(locRes.data as any[] ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emissions Analysis</Text>
        <Text style={styles.headerSub}>Scope 3 Category 7 · 2026</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Card title="Mode Split">
          {modeSplit.length > 0 ? modeSplit.map((mode: any, i: number) => (
            <View key={i} style={styles.modeRow}>
              <Text style={styles.modeName}>{mode.mode}</Text>
              <View style={styles.modeBarContainer}>
                <View style={[styles.modeBar, { width: `${mode.percentage ?? 0}%`, backgroundColor: COLORS.primary }]} />
              </View>
              <Text style={styles.modePct}>{(mode.percentage ?? 0).toFixed(0)}%</Text>
              <Text style={styles.modeEmissions}>{(mode.emissions ?? 0).toFixed(1)}t</Text>
            </View>
          )) : <Text style={styles.noData}>No mode split data available.</Text>}
        </Card>

        <Card title="Location Performance">
          {locations.length > 0 ? locations.map((loc: any, i: number) => (
            <View key={i} style={styles.locRow}>
              <View>
                <Text style={styles.locName}>{loc.location}</Text>
                <Text style={styles.locCity}>{loc.city}, {loc.country}</Text>
              </View>
              <View style={styles.locStats}>
                <Text style={styles.locParticipation}>{loc.participation?.toFixed(0)}%</Text>
                <Text style={styles.locParticipationLabel}>participation</Text>
              </View>
            </View>
          )) : <Text style={styles.noData}>No location data available.</Text>}
        </Card>

        <Card title="Emission Factors Used (SEAI 2024)">
          {[
            { mode: 'Bus', factor: '0.089 kg CO₂/km' },
            { mode: 'Rail / DART / Luas', factor: '0.025 kg CO₂/km' },
            { mode: 'Electric Vehicle', factor: '0.053 kg CO₂/km' },
            { mode: 'Petrol Car (Baseline)', factor: '0.168 kg CO₂/km' },
            { mode: 'Diesel Car', factor: '0.171 kg CO₂/km' },
            { mode: 'Walk / Cycle', factor: '0.000 kg CO₂/km' },
          ].map(({ mode, factor }) => (
            <View key={mode} style={styles.factorRow}>
              <Text style={styles.factorMode}>{mode}</Text>
              <Text style={styles.factorValue}>{factor}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  modeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  modeName: { fontSize: 12, color: COLORS.textSecondary, width: 60 },
  modeBarContainer: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  modeBar: { height: 6, borderRadius: 3 },
  modePct: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, width: 32, textAlign: 'right' },
  modeEmissions: { fontSize: 11, color: COLORS.textMuted, width: 36, textAlign: 'right' },
  noData: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', padding: 16 },
  locRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  locName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  locCity: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  locStats: { alignItems: 'center' },
  locParticipation: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  locParticipationLabel: { fontSize: 10, color: COLORS.textMuted },
  factorRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  factorMode: { fontSize: 13, color: COLORS.textPrimary },
  factorValue: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
});
