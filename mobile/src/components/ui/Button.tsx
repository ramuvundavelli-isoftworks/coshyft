import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title, onPress, variant = 'primary', size = 'md',
  disabled, loading, style, textStyle,
}: ButtonProps) {
  const variantStyles: Record<string, ViewStyle> = {
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: COLORS.error },
  };

  const textColors: Record<string, string> = {
    primary: '#FFFFFF',
    secondary: COLORS.textPrimary,
    ghost: COLORS.primary,
    danger: '#FFFFFF',
  };

  const sizeStyles: Record<string, ViewStyle> = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
    md: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12 },
  };

  const textSizes: Record<string, TextStyle> = {
    sm: { fontSize: 13 },
    md: { fontSize: 15 },
    lg: { fontSize: 17 },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColors[variant]} />
      ) : (
        <Text style={[styles.text, { color: textColors[variant] }, textSizes[size], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  text: { fontWeight: '600' },
  disabled: { opacity: 0.5 },
});
