import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commuteApi } from '../../api';
import { THEME, gs } from '../../styles/theme';
import ScreenHeader from '../../components/layout/ScreenHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function CommuteProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [workDays, setWorkDays] = useState('5');
  const [remoteDays, setRemoteDays] = useState('0');
  const [departureTime, setDepartureTime] = useState('08:30');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');

  useEffect(() => {
    commuteApi.getCommuteProfile().then(res => {
      if (res.success && res.data) {
        const d = res.data;
        setOrigin(d.default_origin_address ?? '');
        setDestination(d.default_destination_address ?? '');
        setWorkDays(String(d.work_days_per_week ?? 5));
        setRemoteDays(String(d.remote_days_per_week ?? 0));
        setDepartureTime(d.typical_departure_time ?? '08:30');
        setVehicleMake(d.vehicle_make ?? '');
        setVehicleModel(d.vehicle_model ?? '');
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await commuteApi.updateCommuteProfile({
      default_origin_address: origin || undefined,
      default_destination_address: destination || undefined,
      work_days_per_week: parseInt(workDays),
      remote_days_per_week: parseInt(remoteDays),
      typical_departure_time: departureTime,
      vehicle_make: vehicleMake || undefined,
      vehicle_model: vehicleModel || undefined,
    });
    setSaving(false);
    if (result.success) Alert.alert('Saved', 'Commute profile updated successfully.');
    else Alert.alert('Error', result.error?.message ?? 'Failed to save');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <ScreenHeader title="Commute Profile" onBack={() => navigation.goBack()} />
      <ScrollView style={gs.screenBg} contentContainerStyle={styles.content}>

        {/* Locations */}
        <View style={[gs.card, styles.section]}>
          <SectionHeader title="Locations" />
          <Input
            label="Home address"
            value={origin}
            onChangeText={setOrigin}
            placeholder="e.g. Tallaght, Dublin 24"
            leftIcon="home-outline"
          />
          <Input
            label="Work address"
            value={destination}
            onChangeText={setDestination}
            placeholder="e.g. Grand Canal Dock, Dublin 2"
            leftIcon="business-outline"
          />
        </View>

        {/* Schedule */}
        <View style={[gs.card, styles.section]}>
          <SectionHeader title="Schedule" />
          <Input
            label="Typical departure time"
            value={departureTime}
            onChangeText={setDepartureTime}
            placeholder="HH:MM"
            leftIcon="time-outline"
          />
          <Input
            label="Work days per week"
            value={workDays}
            onChangeText={setWorkDays}
            keyboardType="numeric"
            placeholder="5"
            leftIcon="calendar-outline"
          />
          <Input
            label="Remote / WFH days per week"
            value={remoteDays}
            onChangeText={setRemoteDays}
            keyboardType="numeric"
            placeholder="0"
            leftIcon="laptop-outline"
          />
        </View>

        {/* Vehicle */}
        <View style={[gs.card, styles.section]}>
          <SectionHeader title="Vehicle (optional)" />
          <Input
            label="Make"
            value={vehicleMake}
            onChangeText={setVehicleMake}
            placeholder="e.g. Toyota"
            leftIcon="car-outline"
          />
          <Input
            label="Model"
            value={vehicleModel}
            onChangeText={setVehicleModel}
            placeholder="e.g. Corolla"
            leftIcon="car-sport-outline"
          />
        </View>

        <Button title="Save Profile" onPress={handleSave} loading={saving} size="lg" />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  section: {
    gap: 4,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
});
