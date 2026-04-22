import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import type { AuditorTabParamList } from '../types';

import AuditorOverviewScreen from '../screens/auditor/OverviewScreen';
import ReviewScreen from '../screens/auditor/ReviewScreen';
import EvidenceScreen from '../screens/auditor/EvidenceScreen';
import AuditorReportsScreen from '../screens/auditor/ReportsScreen';

const Tab = createBottomTabNavigator<AuditorTabParamList>();

export default function AuditorNavigator() {
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
        tabBarActiveTintColor: COLORS.warning,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Overview: 'home',
            Review: 'checkmark-circle',
            Evidence: 'folder',
            Reports: 'document-text',
          };
          return <Ionicons name={icons[route.name] ?? 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Overview" component={AuditorOverviewScreen} />
      <Tab.Screen name="Review" component={ReviewScreen} />
      <Tab.Screen name="Evidence" component={EvidenceScreen} />
      <Tab.Screen name="Reports" component={AuditorReportsScreen} />
    </Tab.Navigator>
  );
}
