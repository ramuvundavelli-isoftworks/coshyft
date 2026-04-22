import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import type { SustainabilityTabParamList } from '../types';

import SustainabilityOverviewScreen from '../screens/sustainability/OverviewScreen';
import EmissionsScreen from '../screens/sustainability/EmissionsScreen';
import ReportsScreen from '../screens/sustainability/ReportsScreen';
import ComplianceScreen from '../screens/sustainability/ComplianceScreen';
import SustainabilityMoreScreen from '../screens/sustainability/MoreScreen';

const Tab = createBottomTabNavigator<SustainabilityTabParamList>();

export default function SustainabilityNavigator() {
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
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Overview: 'home',
            Emissions: 'cloud',
            Reports: 'document-text',
            Compliance: 'shield-checkmark',
            More: 'grid',
          };
          return <Ionicons name={icons[route.name] ?? 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Overview" component={SustainabilityOverviewScreen} />
      <Tab.Screen name="Emissions" component={EmissionsScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Compliance" component={ComplianceScreen} />
      <Tab.Screen name="More" component={SustainabilityMoreScreen} />
    </Tab.Navigator>
  );
}
