import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { gamificationApi } from '../../api';
import { COLORS } from '../../constants';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ScreenHeader from '../../components/layout/ScreenHeader';
import ScreenWrapper from '../../components/layout/ScreenWrapper';

export default function RewardsScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [profileRes, achRes, chalRes, lbRes] = await Promise.all([
      gamificationApi.getProfile(),
      gamificationApi.getAchievements(),
      gamificationApi.getChallenges(),
      gamificationApi.getLeaderboard('points', 'monthly'),
    ]);
    if (profileRes.success) setProfile(profileRes.data);
    if (achRes.success) setAchievements(achRes.data as any[] ?? []);
    if (chalRes.success) setChallenges(chalRes.data as any[] ?? []);
    if (lbRes.success) setLeaderboard(lbRes.data as any[] ?? []);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    const result = await gamificationApi.joinChallenge(challengeId);
    if (result.success) Alert.alert('Joined!', 'You have joined the challenge.');
    else Alert.alert('Error', result.error?.message ?? 'Failed to join');
  };

  return (
    <>
      <ScreenHeader title="OxyPoints & Rewards" onBack={() => navigation.goBack()} />
      <ScreenWrapper onRefresh={onRefresh} refreshing={refreshing}>
        {/* Points Balance */}
        {profile && (
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Your OxyPoints Balance</Text>
            <Text style={styles.balanceValue}>{(profile.total_points ?? 0).toLocaleString()}</Text>
            <View style={styles.levelRow}>
              <Badge label={`Level ${profile.level ?? 1}`} variant="success" />
              <Badge label={profile.rank ?? 'Eco Starter'} variant="info" />
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min((profile.points_to_next_level_progress ?? 0) * 100, 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>{profile.points_to_next_level ?? 0} pts to next level</Text>
            </View>
          </View>
        )}

        {/* Active Challenges */}
        {challenges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            {challenges.slice(0, 3).map((c: any) => (
              <Card key={c.id} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <View>
                    <Text style={styles.challengeTitle}>{c.title}</Text>
                    <Text style={styles.challengeDesc}>{c.description}</Text>
                  </View>
                  <View style={styles.challengeReward}>
                    <Text style={styles.challengePoints}>+{c.reward_points ?? 100}</Text>
                    <Text style={styles.challengePtsLabel}>pts</Text>
                  </View>
                </View>
                <View style={styles.challengeProgress}>
                  <View style={styles.challengeBar}>
                    <View style={[styles.challengeFill, { width: `${Math.min((c.progress ?? 0) * 100, 100)}%` }]} />
                  </View>
                  <Text style={styles.challengePct}>{Math.round((c.progress ?? 0) * 100)}%</Text>
                </View>
                {!c.joined && (
                  <Button title="Join Challenge" onPress={() => handleJoinChallenge(c.id)} size="sm" variant="secondary" />
                )}
              </Card>
            ))}
          </>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((a: any) => (
                <View key={a.id} style={[styles.achievementItem, !a.unlocked && styles.achievementLocked]}>
                  <Text style={styles.achievementIcon}>{a.icon ?? '🏆'}</Text>
                  <Text style={styles.achievementName} numberOfLines={2}>{a.title}</Text>
                  {a.unlocked && <Badge label="Earned" variant="success" />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Monthly Leaderboard</Text>
            <Card>
              {leaderboard.slice(0, 5).map((entry: any, index: number) => (
                <View key={entry.user_id ?? index} style={styles.leaderboardRow}>
                  <Text style={[styles.leaderboardRank, index < 3 && { color: COLORS.warning }]}>
                    #{index + 1}
                  </Text>
                  <View style={styles.leaderboardAvatar}>
                    <Text style={styles.leaderboardAvatarText}>{(entry.name ?? 'U')[0]}</Text>
                  </View>
                  <Text style={styles.leaderboardName}>{entry.name ?? 'Employee'}</Text>
                  <Text style={styles.leaderboardPts}>{(entry.points ?? 0).toLocaleString()} pts</Text>
                </View>
              ))}
            </Card>
          </>
        )}
      </ScreenWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: COLORS.primary + '10', borderRadius: 20, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '30', marginBottom: 16,
  },
  balanceLabel: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  balanceValue: { fontSize: 48, fontWeight: '800', color: COLORS.textPrimary, marginVertical: 8 },
  levelRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  progressContainer: { width: '100%', gap: 6 },
  progressBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' },

  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 10, marginTop: 4 },

  challengeCard: { marginBottom: 10, gap: 10 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  challengeTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  challengeDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  challengeReward: { alignItems: 'center', backgroundColor: COLORS.warning + '20', borderRadius: 8, padding: 8 },
  challengePoints: { fontSize: 18, fontWeight: '800', color: COLORS.warning },
  challengePtsLabel: { fontSize: 10, color: COLORS.warning },
  challengeProgress: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  challengeBar: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  challengeFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  challengePct: { fontSize: 12, color: COLORS.textSecondary, width: 36, textAlign: 'right' },

  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  achievementItem: {
    width: '30%', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', gap: 6,
  },
  achievementLocked: { opacity: 0.4 },
  achievementIcon: { fontSize: 28 },
  achievementName: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '500' },

  leaderboardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10 },
  leaderboardRank: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, width: 28 },
  leaderboardAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '30', justifyContent: 'center', alignItems: 'center' },
  leaderboardAvatarText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  leaderboardName: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  leaderboardPts: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
});
