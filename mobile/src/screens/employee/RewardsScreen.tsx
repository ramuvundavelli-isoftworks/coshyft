import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, TouchableOpacity, Alert, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { gamificationApi } from '../../api';
import { THEME, gs } from '../../styles/theme';
import type { EmployeeStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<EmployeeStackParamList>;
type RewardsTab = 'achievements' | 'marketplace' | 'leaderboard';

export default function RewardsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RewardsTab>('achievements');
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

  const totalPts = profile?.total_points ?? 1850;

  return (
    <View style={[gs.flex1, styles.screen]}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />

      {/* ── Header ─────────────────────────────────────── */}
      <View style={[gs.header, { paddingTop: insets.top + 10 }]}>
        <View style={gs.headerRow}>
          <Text style={gs.headerPageTitle}>Rewards</Text>
          <BellButton count={2} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />
        }
        contentContainerStyle={gs.scrollContent}
      >
        {/* ── OxyPoints hero banner ──────────────────────── */}
        <View style={styles.heroBanner}>
          <Ionicons name="star" size={28} color="#fff" />
          <Text style={styles.heroPoints}>{totalPts.toLocaleString()}</Text>
          <Text style={styles.heroLabel}>OxyPoints</Text>
        </View>

        {/* ── Sub-tabs ───────────────────────────────────── */}
        <View style={gs.segBar}>
          <RewardsTab label="Achievements" id="achievements" active={activeTab} onPress={setActiveTab} />
          <RewardsTab label="Marketplace"  id="marketplace"  active={activeTab} onPress={setActiveTab} />
          <RewardsTab label="Leaderboard"  id="leaderboard"  active={activeTab} onPress={setActiveTab} />
        </View>

        {/* ── Tab content ────────────────────────────────── */}
        {activeTab === 'achievements' && (
          <AchievementsTab achievements={achievements} />
        )}
        {activeTab === 'marketplace' && (
          <MarketplaceTab challenges={challenges} onJoin={handleJoinChallenge} />
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab leaderboard={leaderboard} />
        )}

        {/* ── My Impact shortcut ─────────────────────────── */}
        <TouchableOpacity
          style={styles.impactLink}
          onPress={() => navigation.navigate('MyImpact')}
          activeOpacity={0.85}
        >
          <View style={[gs.row, gs.gap10]}>
            <View style={styles.impactIcon}>
              <Ionicons name="leaf" size={18} color={THEME.primary} />
            </View>
            <View>
              <Text style={styles.impactLinkTitle}>My Impact Report</Text>
              <Text style={gs.textSm}>View your full CO₂ savings breakdown</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={THEME.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function BellButton({ count }: { count: number }) {
  return (
    <TouchableOpacity style={gs.bellBtn}>
      <Ionicons name="notifications-outline" size={20} color="#fff" />
      {count > 0 && (
        <View style={gs.bellBadgeWrap}>
          <Text style={gs.bellBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function RewardsTab({
  label, id, active, onPress,
}: { label: string; id: RewardsTab; active: RewardsTab; onPress: (t: RewardsTab) => void }) {
  const isActive = id === active;
  return (
    <TouchableOpacity
      style={[gs.segTab, isActive && gs.segTabActive]}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <Text style={isActive ? gs.segTabTextActive : gs.segTabText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Achievements tab ─────────────────────────────────────────
const MOCK_ACHIEVEMENTS = [
  { id: 'a1', icon: '🚗', title: 'First Carpool', desc: 'Completed your first carpool', pts: 50, unlocked: true, unlockedDate: 'Feb 10, 2026' },
  { id: 'a2', icon: '💪', title: 'Week Warrior', desc: '5 sustainable commutes in one week', pts: 100, unlocked: true, unlockedDate: 'Feb 15, 2026' },
  { id: 'a3', icon: '🌱', title: 'Carbon Saver', desc: 'Saved 50kg of CO₂ emissions', pts: 200, unlocked: true, unlockedDate: 'Feb 18, 2026' },
  { id: 'a4', icon: '🔒', title: 'Green Streak', desc: '10 days of sustainable commuting', pts: 150, unlocked: false, progress: 7, total: 10 },
  { id: 'a5', icon: '🔒', title: 'Ride Champion', desc: 'Offer 20 carpools to colleagues', pts: 250, unlocked: false },
  { id: 'a6', icon: '🔒', title: 'Eco Legend', desc: '100 sustainable commutes', pts: 500, unlocked: false },
];

function AchievementsTab({ achievements }: { achievements: any[] }) {
  const display = achievements.length > 0 ? achievements : MOCK_ACHIEVEMENTS;
  const unlocked = display.filter(a => a.unlocked).length;
  const earnedPts = display.filter(a => a.unlocked).reduce((sum, a) => sum + (a.pts ?? a.reward_points ?? 0), 0);

  return (
    <>
      <View style={styles.achHeader}>
        <Text style={gs.textBase}>{unlocked}/{display.length} Unlocked</Text>
        <Text style={styles.achEarned}>{earnedPts} pts earned</Text>
      </View>
      <View style={styles.achGrid}>
        {display.map((a: any) => (
          <AchievementCard key={a.id} item={a} />
        ))}
      </View>
    </>
  );
}

function AchievementCard({ item }: { item: any }) {
  const isLocked = !item.unlocked;
  return (
    <View style={[styles.achCard, isLocked && styles.achCardLocked]}>
      <View style={styles.achPtsBadge}>
        <Text style={styles.achPtsText}>+{item.pts ?? item.reward_points ?? 0} pts</Text>
      </View>
      <Text style={styles.achIcon}>{isLocked ? '🔒' : (item.icon ?? '🏆')}</Text>
      <Text style={styles.achTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.achDesc} numberOfLines={2}>{item.desc ?? item.description}</Text>
      {item.unlocked && item.unlockedDate && (
        <Text style={styles.achDate}>Unlocked {item.unlockedDate}</Text>
      )}
      {!item.unlocked && item.progress !== undefined && (
        <View style={styles.achProgressWrap}>
          <View style={gs.progressTrack}>
            <View style={[gs.progressFill, { width: `${(item.progress / item.total) * 100}%` as any }]} />
          </View>
          <Text style={gs.textSm}>{item.progress}/{item.total} days</Text>
        </View>
      )}
    </View>
  );
}

// ─── Marketplace tab ──────────────────────────────────────────
function MarketplaceTab({ challenges, onJoin }: { challenges: any[]; onJoin: (id: string) => void }) {
  if (challenges.length === 0) {
    return (
      <View style={gs.emptyWrap}>
        <Ionicons name="storefront-outline" size={48} color={THEME.textMuted} />
        <Text style={gs.emptyTitle}>Coming soon</Text>
        <Text style={gs.emptyText}>Redeem your OxyPoints for rewards here.</Text>
      </View>
    );
  }
  return (
    <>
      {challenges.map((c: any) => (
        <View key={c.id} style={[gs.card, styles.challengeCard]}>
          <View style={gs.rowBetween}>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{c.title}</Text>
              <Text style={gs.textBase}>{c.description}</Text>
            </View>
            <View style={styles.challengeReward}>
              <Text style={styles.challengePts}>+{c.reward_points ?? 100}</Text>
              <Text style={gs.textSm}>pts</Text>
            </View>
          </View>
          <View style={[gs.row, styles.challengeBarRow]}>
            <View style={[gs.progressTrack, { flex: 1 }]}>
              <View style={[gs.progressFill, { width: `${Math.min((c.progress ?? 0) * 100, 100)}%` as any }]} />
            </View>
            <Text style={gs.textSm}>{Math.round((c.progress ?? 0) * 100)}%</Text>
          </View>
          {!c.joined && (
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => onJoin(c.id)}
            >
              <Text style={styles.joinBtnText}>Join Challenge</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </>
  );
}

// ─── Leaderboard tab ──────────────────────────────────────────
const MOCK_LEADERBOARD = [
  { id: 'l1', name: 'Sarah Johnson', points: 2340, initials: 'SJ' },
  { id: 'l2', name: 'Alex Chen',     points: 1850, initials: 'AC' },
  { id: 'l3', name: 'Mike Chen',     points: 1620, initials: 'MC' },
  { id: 'l4', name: 'Emma Davis',    points: 1410, initials: 'ED' },
  { id: 'l5', name: 'James O\'Brien', points: 980, initials: 'JO' },
];

function LeaderboardTab({ leaderboard }: { leaderboard: any[] }) {
  const display = leaderboard.length > 0 ? leaderboard : MOCK_LEADERBOARD;

  return (
    <View style={gs.card}>
      {display.slice(0, 5).map((entry: any, index: number) => (
        <View
          key={entry.user_id ?? entry.id ?? index}
          style={[styles.lbRow, index < display.length - 1 && styles.lbRowBorder]}
        >
          <Text style={[styles.lbRank, index < 3 && styles.lbRankTop]}>#{index + 1}</Text>
          <View style={gs.avatarMd}>
            <Text style={gs.avatarText}>
              {entry.initials ?? (entry.name ?? 'U')[0]}
            </Text>
          </View>
          <Text style={styles.lbName}>{entry.name ?? 'Employee'}</Text>
          <Text style={styles.lbPts}>{(entry.points ?? entry.total_points ?? 0).toLocaleString()} pts</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: THEME.background,
  },

  // Hero banner
  heroBanner: {
    backgroundColor: THEME.headerBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 4,
  },
  heroPoints: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  heroLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },

  // Achievements
  achHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achEarned: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primary,
  },
  achGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achCard: {
    width: '47%',
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 14,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  achCardLocked: {
    opacity: 0.55,
  },
  achPtsBadge: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.successBg,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  achPtsText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.successText,
  },
  achIcon: {
    fontSize: 30,
    marginVertical: 4,
  },
  achTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  achDesc: {
    fontSize: 12,
    color: THEME.textSecondary,
    lineHeight: 16,
  },
  achDate: {
    fontSize: 11,
    color: THEME.primary,
    fontWeight: '600',
  },
  achProgressWrap: {
    gap: 4,
  },

  // Challenges
  challengeCard: {
    gap: 10,
  },
  challengeInfo: {
    flex: 1,
    gap: 3,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  challengeReward: {
    alignItems: 'center',
    backgroundColor: THEME.warningBg,
    borderRadius: 10,
    padding: 10,
  },
  challengePts: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.warning,
  },
  challengeBarRow: {
    gap: 8,
  },
  joinBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 9,
    alignItems: 'center',
  },
  joinBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textPrimary,
  },

  // Leaderboard
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  lbRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  lbRank: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textSecondary,
    width: 28,
  },
  lbRankTop: {
    color: THEME.warning,
  },
  lbName: {
    flex: 1,
    fontSize: 14,
    color: THEME.textPrimary,
    fontWeight: '500',
  },
  lbPts: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.primary,
  },

  // Impact link
  impactLink: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  impactIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactLinkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textPrimary,
  },
});
