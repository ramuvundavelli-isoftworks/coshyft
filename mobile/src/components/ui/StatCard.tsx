import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  trend?: number;
  style?: ViewStyle;
}

export default function StatCard({ label, value, unit, icon, iconColor = COLORS.primary, trend, style }: StatCardProps) {
  const trendColor = trend === undefined ? undefined : trend < 0 ? COLORS.success : COLORS.error;
  const trendIcon = trend === undefined ? null : trend < 0 ? 'trending-down' : 'trending-up';

  return (
    <View style={[styles.card, style]}>
      {icon && (
        <View style={[styles.iconBg, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
      )}
      <Text style={styles.value}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
      <Text style={styles.label}>{label}</Text>
      {trend !== undefined && trendIcon && (
        <View style={styles.trend}>
          <Ionicons name={trendIcon} size={12} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {Math.abs(trend).toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  iconBg: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  value: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  unit: { fontSize: 13, fontWeight: '400', color: COLORS.textSecondary },
  label: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  trend: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 3 },
  trendText: { fontSize: 11, fontWeight: '600' },
});
