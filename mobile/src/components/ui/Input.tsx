import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  secureToggle?: boolean;
}

export default function Input({
  label, error, leftIcon, rightIcon, onRightIconPress,
  secureToggle, style, ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isSecure = secureToggle ? !showPassword : props.secureTextEntry;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, error ? styles.errorBorder : null]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={18} color={COLORS.textMuted} style={styles.leftIcon} />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textMuted}
          selectionColor={COLORS.primary}
          secureTextEntry={isSecure}
          {...props}
        />
        {secureToggle && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.rightIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        {rightIcon && !secureToggle && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon} size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary, marginBottom: 6 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  errorBorder: { borderColor: COLORS.error },
  leftIcon: { marginRight: 8 },
  rightIcon: { padding: 4 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 15, paddingVertical: 12 },
  error: { fontSize: 12, color: COLORS.error, marginTop: 4 },
});
