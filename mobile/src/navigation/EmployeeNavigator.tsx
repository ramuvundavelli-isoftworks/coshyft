import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../styles/theme';
import type { EmployeeStackParamList, EmployeeTabParamList } from '../types';

// Screens
import DashboardScreen from '../screens/employee/DashboardScreen';
import LogCommuteScreen from '../screens/employee/LogCommuteScreen';
import RidesScreen from '../screens/employee/RidesScreen';
import RewardsScreen from '../screens/employee/RewardsScreen';
import ProfileScreen from '../screens/employee/ProfileScreen';
import OfferRideScreen from '../screens/employee/OfferRideScreen';
import ActiveTripScreen from '../screens/employee/ActiveTripScreen';
import MyTripsScreen from '../screens/employee/MyTripsScreen';
import MyImpactScreen from '../screens/employee/MyImpactScreen';
import RecurringRidesScreen from '../screens/employee/RecurringRidesScreen';
import MessagesScreen from '../screens/employee/MessagesScreen';
import CommuteProfileScreen from '../screens/employee/CommuteProfileScreen';
import SettingsScreen from '../screens/employee/SettingsScreen';

const Tab = createBottomTabNavigator<EmployeeTabParamList>();
const Stack = createNativeStackNavigator<EmployeeStackParamList>();

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'home',
  Rides: 'car',
  LogCommute: 'add',
  Rewards: 'trophy',
  Profile: 'person',
};

function AddTabIcon() {
  return (
    <View style={tabStyles.addBtn}>
      <Ionicons name="add" size={28} color="#fff" />
    </View>
  );
}

function EmployeeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabStyles.tabBar,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'LogCommute') return <AddTabIcon />;

          const iconName = TAB_ICONS[route.name] ?? 'circle';
          if (focused) {
            return (
              <View style={tabStyles.activeIconWrap}>
                <Ionicons name={iconName} size={22} color="#fff" />
              </View>
            );
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Rides" component={RidesScreen} />
      <Tab.Screen name="LogCommute" component={LogCommuteScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function EmployeeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} />
      <Stack.Screen name="OfferRide" component={OfferRideScreen} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
      <Stack.Screen name="MyTrips" component={MyTripsScreen} />
      <Stack.Screen name="MyImpact" component={MyImpactScreen} />
      <Stack.Screen name="RecurringRides" component={RecurringRidesScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="CommuteProfile" component={CommuteProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.tabBarBg,
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
  },
  activeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
