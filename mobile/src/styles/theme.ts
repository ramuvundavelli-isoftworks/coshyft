import { StyleSheet } from 'react-native';

export const THEME = {
  // Header / Tab bar
  headerBg: '#173D2A',
  tabBarBg: '#0D1A0D',

  // App backgrounds
  background: '#F0F4F1',
  surface: '#FFFFFF',
  border: '#E8ECE8',

  // Brand
  primary: '#10B981',
  primaryDark: '#059669',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textWhite: '#FFFFFF',
  textWhiteSub: 'rgba(255,255,255,0.72)',

  // Semantic
  success: '#10B981',
  successBg: '#D1FAE5',
  successText: '#065F46',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  warningText: '#D97706',
  error: '#EF4444',
  info: '#3B82F6',
  infoBg: '#DBEAFE',
  infoText: '#1E40AF',
};

export const gs = StyleSheet.create({
  // ── Screen ──────────────────────────────────────────────────
  flex1: { flex: 1 },
  screenBg: { flex: 1, backgroundColor: THEME.background },

  // ── Dark-green header ────────────────────────────────────────
  header: {
    backgroundColor: THEME.headerBg,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAppTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.textWhite,
  },
  headerPageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.textWhite,
  },
  headerWelcome: {
    fontSize: 15,
    color: THEME.textWhiteSub,
    marginTop: 4,
  },
  headerBoldName: {
    fontWeight: '700',
    color: THEME.textWhite,
  },

  // Bell button in header
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeWrap: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '800',
  },

  // Search bar (on green header)
  searchBar: {
    backgroundColor: THEME.surface,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: THEME.textMuted,
    marginLeft: 8,
    flex: 1,
  },

  // ── White card ───────────────────────────────────────────────
  card: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 12,
  },

  // ── Segmented control (sub-tabs) ─────────────────────────────
  segBar: {
    flexDirection: 'row',
    backgroundColor: '#E6F2EC',
    borderRadius: 28,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  segTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 24,
  },
  segTabActive: {
    backgroundColor: THEME.surface,
  },
  segTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.textSecondary,
  },
  segTabTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textPrimary,
  },

  // ── Section ──────────────────────────────────────────────────
  sectionPad: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 10,
    marginTop: 4,
  },

  // ── Flex rows ────────────────────────────────────────────────
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gap4: { gap: 4 },
  gap6: { gap: 6 },
  gap8: { gap: 8 },
  gap10: { gap: 10 },
  gap12: { gap: 12 },
  gap14: { gap: 14 },
  gap16: { gap: 16 },

  // ── Avatar circles ───────────────────────────────────────────
  avatarMd: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  avatarTextLg: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },

  // ── Status pills ─────────────────────────────────────────────
  pillCompleted: {
    backgroundColor: THEME.successBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillCompletedText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.successText,
  },
  pillActive: {
    backgroundColor: THEME.successBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillActiveText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.successText,
  },
  pillUpcoming: {
    backgroundColor: THEME.warningBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillUpcomingText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.warningText,
  },

  // ── Tag chips (Quiet ride, No smoking…) ──────────────────────
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
    color: THEME.textSecondary,
  },

  // ── Match % circle ───────────────────────────────────────────
  matchCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchCircleText: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.primary,
  },

  // ── CO₂ text ─────────────────────────────────────────────────
  co2Green: {
    color: THEME.primary,
    fontWeight: '700',
  },
  co2GreenSm: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '600',
  },

  // ── Progress bar ─────────────────────────────────────────────
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: THEME.primary,
    borderRadius: 4,
  },

  // ── Divider ──────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },

  // ── Empty state ──────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
  },

  // ── Typography helpers ───────────────────────────────────────
  textSm: { fontSize: 12, color: THEME.textMuted },
  textBase: { fontSize: 14, color: THEME.textSecondary },
  textMd: { fontSize: 15, color: THEME.textPrimary },
  textBold: { fontWeight: '700' },
  textGreen: { color: THEME.primary, fontWeight: '700' },
  textGreenSm: { fontSize: 13, color: THEME.primary, fontWeight: '600' },

  // ── Scroll content padding ───────────────────────────────────
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
});
