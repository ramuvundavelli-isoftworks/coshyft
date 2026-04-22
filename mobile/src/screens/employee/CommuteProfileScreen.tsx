import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commuteApi } from '../../api';
import { COLORS } from '../../constants';
import ScreenHeader from '../../components/layout/ScreenHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CommuteProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<any>(null);
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
        setProfile(d);
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
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Input label="Home address (default origin)" value={origin} onChangeText={setOrigin} placeholder="e.g. Tallaght, Dublin 24" leftIcon="home-outline" />
        <Input label="Work address (default destination)" value={destination} onChangeText={setDestination} placeholder="e.g. Grand Canal Dock, Dublin 2" leftIcon="business-outline" />
        <Input label="Work days per week" value={workDays} onChangeText={setWorkDays} keyboardType="numeric" placeholder="5" leftIcon="calendar-outline" />
        <Input label="Remote/WFH days per week" value={remoteDays} onChangeText={setRemoteDays} keyboardType="numeric" placeholder="0" leftIcon="laptop-outline" />
        <Input label="Typical departure time" value={departureTime} onChangeText={setDepartureTime} placeholder="HH:MM" leftIcon="time-outline" />
        <Input label="Vehicle make (optional)" value={vehicleMake} onChangeText={setVehicleMake} placeholder="e.g. Toyota" leftIcon="car-outline" />
        <Input label="Vehicle model (optional)" value={vehicleModel} onChangeText={setVehicleModel} placeholder="e.g. Corolla" leftIcon="car-sport-outline" />
        <Button title="Save Profile" onPress={handleSave} loading={saving} size="lg" style={styles.saveBtn} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40, gap: 4 },
  saveBtn: { marginTop: 8 },
});
