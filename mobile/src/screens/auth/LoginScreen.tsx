import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.logoRing}>
              <Ionicons name="leaf" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.logoWordmark}>
              <Text style={styles.logoText}>Co</Text>
              <View style={styles.logoAccent}>
                <Text style={styles.logoAccentText}>Shift</Text>
              </View>
            </View>
            <Text style={styles.tagline}>Enterprise Scope 3 Commuting Intelligence</Text>
            <Text style={styles.subTagline}>Irish CSRD Compliance Platform</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSubtitle}>Sign in to your CoShift account</Text>

            <View style={styles.form}>
              <Input
                label="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="you@company.com"
                leftIcon="mail-outline"
                error={errors.email}
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                leftIcon="lock-closed-outline"
                secureToggle
                error={errors.password}
              />

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                size="lg"
                style={styles.loginBtn}
              />
            </View>
          </View>

          {/* Compliance Footer */}
          <View style={styles.footer}>
            <View style={styles.complianceBadges}>
              {['CSRD', 'ESRS E1', 'GDPR', 'Scope 3'].map((label) => (
                <View key={label} style={styles.badge}>
                  <Text style={styles.badgeText}>{label}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.footerText}>CoShift v1.0 · Powered by SEAI 2024 emission factors</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', minHeight: '100%' },

  // Hero
  hero: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  logoRing: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  logoWordmark: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logoText: { fontSize: 36, fontWeight: '800', color: COLORS.textPrimary },
  logoAccent: {
    backgroundColor: COLORS.primary, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 2, marginLeft: 2,
  },
  logoAccentText: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  tagline: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '500' },
  subTagline: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 4 },

  // Form Card
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  formTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  form: {},
  forgotBtn: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 20 },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  loginBtn: { marginTop: 4 },

  // Footer
  footer: { alignItems: 'center', marginTop: 28, gap: 12 },
  complianceBadges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  badge: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
  footerText: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
});
