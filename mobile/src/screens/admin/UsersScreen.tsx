import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminApi } from '../../api';
import { COLORS } from '../../constants';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Input from '../../components/ui/Input';

const ROLE_COLORS: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
  employee: 'default', admin: 'info', sustainability: 'success', auditor: 'warning', superadmin: 'error',
};

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const loadUsers = useCallback(async () => {
    const result = await adminApi.getUsers({ page_size: 50 });
    if (result.success) setUsers((result.data as any)?.items ?? result.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  const onRefresh = async () => { setRefreshing(true); await loadUsers(); setRefreshing(false); };

  const filtered = users.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const toggleActive = async (user: any) => {
    const result = user.is_active ? await adminApi.deactivateUser(user.id) : await adminApi.activateUser(user.id);
    if (result.success) loadUsers();
    else Alert.alert('Error', result.error?.message ?? 'Failed to update user');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Input placeholder="Search users..." value={search} onChangeText={setSearch} leftIcon="search-outline" />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
        ListEmptyComponent={<Text style={styles.noData}>No users found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>{(item.name ?? 'U')[0]}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <View style={styles.badges}>
                <Badge label={item.role ?? 'employee'} variant={ROLE_COLORS[item.role] ?? 'default'} />
                {item.department && <Badge label={item.department} variant="default" />}
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleActive(item)} style={styles.toggleBtn}>
              <Ionicons name={item.is_active ? 'checkmark-circle' : 'close-circle'} size={24} color={item.is_active ? COLORS.success : COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchBox: { padding: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  list: { padding: 16, gap: 2, paddingBottom: 32 },
  noData: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', padding: 32 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  userAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accent + '30', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: COLORS.accent },
  userInfo: { flex: 1, gap: 3 },
  userName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  userEmail: { fontSize: 12, color: COLORS.textSecondary },
  badges: { flexDirection: 'row', gap: 6, marginTop: 4 },
  toggleBtn: { padding: 4 },
});
