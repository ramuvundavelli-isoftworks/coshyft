import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import type { SuperAdminTabParamList } from '../types';

import SuperAdminDashboardScreen from '../screens/superadmin/DashboardScreen';
import TenantsScreen from '../screens/superadmin/TenantsScreen';
import SystemScreen from '../screens/superadmin/SystemScreen';
import SuperAdminSettingsScreen from '../screens/superadmin/SettingsScreen';

const Tab = createBottomTabNavigator<SuperAdminTabParamList>();

export default function SuperAdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home',
            Tenants: 'business',
            System: 'pulse',
            Settings: 'settings',
          };
          return <Ionicons name={icons[route.name] ?? 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={SuperAdminDashboardScreen} />
      <Tab.Screen name="Tenants" component={TenantsScreen} />
      <Tab.Screen name="System" component={SystemScreen} />
      <Tab.Screen name="Settings" component={SuperAdminSettingsScreen} />
    </Tab.Navigator>
  );
}
