import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { commuteApi } from '../../api';
import { COLORS, TRANSPORT_MODES } from '../../constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function LogCommuteScreen() {
  const insets = useSafeAreaInsets();
  const [selectedMode, setSelectedMode] = useState('');
  const [distance, setDistance] = useState('');
  const [isReturn, setIsReturn] = useState(false);
  const [carpoolPassengers, setCarpoolPassengers] = useState('2');
  const [originAddress, setOriginAddress] = useState('');
  const [destAddress, setDestAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    if (selectedMode && distance && parseFloat(distance) > 0) {
      calculatePreview();
    } else {
      setCalculation(null);
    }
  }, [selectedMode, distance, carpoolPassengers]);

  const calculatePreview = async () => {
    const result = await commuteApi.calculateEmissions({
      transport_mode_id: selectedMode,
      distance_km: parseFloat(distance),
      carpool_passengers: selectedMode === 'carpool' ? parseInt(carpoolPassengers) : undefined,
      region: 'IE',
    });
    if (result.success) setCalculation(result.data);
  };

  const handleSubmit = async () => {
    if (!selectedMode) { Alert.alert('Select transport mode'); return; }
    if (!distance || parseFloat(distance) <= 0) { Alert.alert('Enter valid distance'); return; }

    setLoading(true);
    const result = await commuteApi.logCommute({
      date: new Date().toISOString().split('T')[0],
      transport_mode_id: selectedMode,
      distance_km: parseFloat(distance),
      is_return_trip: isReturn,
      carpool_passengers: selectedMode === 'carpool' ? parseInt(carpoolPassengers) : undefined,
      origin_address: originAddress || undefined,
      destination_address: destAddress || undefined,
      notes: notes || undefined,
      verification_method: 'manual',
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Commute Logged!', `+${result.data?.oxypoints_earned ?? 0} OxyPoints earned`, [
        { text: 'OK', onPress: () => { setSelectedMode(''); setDistance(''); setCalculation(null); } },
      ]);
    } else {
      Alert.alert('Error', result.error?.message ?? 'Failed to log commute');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Log Commute</Text>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transport Mode Selection */}
        <Text style={styles.sectionLabel}>Transport Mode</Text>
        <View style={styles.modeGrid}>
          {TRANSPORT_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, selectedMode === mode.id && { borderColor: mode.color, backgroundColor: mode.color + '15' }]}
              onPress={() => setSelectedMode(mode.id)}
            >
              <Ionicons name={mode.icon as any} size={22} color={selectedMode === mode.id ? mode.color : COLORS.textMuted} />
              <Text style={[styles.modeLabel, selectedMode === mode.id && { color: mode.color }]}>{mode.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Distance */}
        <Input
          label="Distance (km)"
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
          placeholder="e.g. 12.5"
          leftIcon="navigate-outline"
        />

        {/* Carpool passengers */}
        {selectedMode === 'carpool' && (
          <Input
            label="Number of passengers (including you)"
            value={carpoolPassengers}
            onChangeText={setCarpoolPassengers}
            keyboardType="numeric"
            placeholder="2"
            leftIcon="people-outline"
          />
        )}

        {/* Return trip toggle */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Return trip</Text>
            <Text style={styles.toggleSub}>Count both ways (×2 distance)</Text>
          </View>
          <Switch
            value={isReturn}
            onValueChange={setIsReturn}
            trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }}
            thumbColor={isReturn ? COLORS.primary : COLORS.textMuted}
          />
        </View>

        {/* Addresses */}
        <Input
          label="Origin (optional)"
          value={originAddress}
          onChangeText={setOriginAddress}
          placeholder="e.g. Tallaght, Dublin 24"
          leftIcon="location-outline"
        />
        <Input
          label="Destination (optional)"
          value={destAddress}
          onChangeText={setDestAddress}
          placeholder="e.g. Grand Canal Dock, Dublin 2"
          leftIcon="business-outline"
        />
        <Input
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any additional context"
          leftIcon="create-outline"
        />

        {/* Emission Preview */}
        {calculation && (
          <Card style={styles.preview}>
            <Text style={styles.previewTitle}>Emission Preview</Text>
            <View style={styles.previewRow}>
              <View style={styles.previewItem}>
                <Text style={styles.previewValue}>{calculation.emissions_kg_co2?.toFixed(2)}</Text>
                <Text style={styles.previewLabel}>kg CO₂</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={[styles.previewValue, { color: COLORS.success }]}>
                  {calculation.co2_saved_vs_car?.toFixed(2)}
                </Text>
                <Text style={styles.previewLabel}>kg saved</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={[styles.previewValue, { color: COLORS.warning }]}>
                  +{calculation.oxypoints_estimate}
                </Text>
                <Text style={styles.previewLabel}>OxyPoints</Text>
              </View>
            </View>
            <Text style={styles.previewSource}>
              Factor: {calculation.emission_factor_used} kg CO₂/km · {calculation.emission_factor_source}
            </Text>
          </Card>
        )}

        <Button
          title="Log Commute"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
          style={styles.submitBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  headerDate: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  content: { padding: 16, paddingBottom: 40, gap: 4 },
  sectionLabel: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary, marginBottom: 10, marginTop: 8 },

  // Mode Grid
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  modeCard: {
    width: '30%', padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.surface, alignItems: 'center', gap: 6,
  },
  modeLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '500' },

  // Toggle
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 12,
  },
  toggleLabel: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  toggleSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Preview
  preview: { marginTop: 8 },
  previewTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  previewItem: { alignItems: 'center' },
  previewValue: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  previewLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  previewSource: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },

  submitBtn: { marginTop: 16 },
});
