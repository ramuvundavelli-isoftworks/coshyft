import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import ScreenHeader from '../../components/layout/ScreenHeader';

const MOCK_MESSAGES = [
  { id: '1', sender: 'Sarah Murphy', preview: 'Are you driving in tomorrow?', time: '10:32', unread: 2, role: 'Driver' },
  { id: '2', sender: 'Liam O\'Brien', preview: 'Thanks for the ride! ⭐️⭐️⭐️⭐️⭐️', time: '09:15', unread: 0, role: 'Passenger' },
  { id: '3', sender: 'CoShift System', preview: 'You have a new ride request from Aoife', time: 'Yesterday', unread: 1, role: 'System' },
  { id: '4', sender: 'Emma Walsh', preview: 'I can pick you up from Sandyford', time: 'Yesterday', unread: 0, role: 'Driver' },
];

export default function MessagesScreen() {
  const navigation = useNavigation();

  return (
    <>
      <ScreenHeader title="Messages" onBack={() => navigation.goBack()} rightAction={{ icon: 'create-outline', onPress: () => {} }} />
      <FlatList
        data={MOCK_MESSAGES}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.sender[0]}</Text>
            </View>
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.senderName}>{item.sender}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
              <View style={styles.messageFooter}>
                <Text style={[styles.preview, item.unread > 0 && styles.previewUnread]} numberOfLines={1}>
                  {item.preview}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.roleTag}>{item.role}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: 76 },
  messageRow: { flexDirection: 'row', padding: 16, backgroundColor: COLORS.background, alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary + '30', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  messageContent: { flex: 1 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  senderName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  messageTime: { fontSize: 12, color: COLORS.textMuted },
  messageFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  preview: { fontSize: 13, color: COLORS.textSecondary, flex: 1 },
  previewUnread: { color: COLORS.textPrimary, fontWeight: '500' },
  unreadBadge: { backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  roleTag: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
