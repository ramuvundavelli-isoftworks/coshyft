import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import type { AdminTabParamList } from '../types';

import AdminOverviewScreen from '../screens/admin/OverviewScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import RidesScreen from '../screens/admin/RidesScreen';
import AdminSettingsScreen from '../screens/admin/SettingsScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminNavigator() {
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
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Overview: 'home',
            Users: 'people',
            Rides: 'car',
            Settings: 'settings',
          };
          return <Ionicons name={icons[route.name] ?? 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Overview" component={AdminOverviewScreen} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen name="Rides" component={RidesScreen} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
    </Tab.Navigator>
  );
}
