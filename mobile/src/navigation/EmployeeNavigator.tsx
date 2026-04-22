import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import type { EmployeeStackParamList, EmployeeTabParamList } from '../types';

// Screens
import DashboardScreen from '../screens/employee/DashboardScreen';
import LogCommuteScreen from '../screens/employee/LogCommuteScreen';
import FindRideScreen from '../screens/employee/FindRideScreen';
import MyImpactScreen from '../screens/employee/MyImpactScreen';
import MoreScreen from '../screens/employee/MoreScreen';
import OfferRideScreen from '../screens/employee/OfferRideScreen';
import ActiveTripScreen from '../screens/employee/ActiveTripScreen';
import MyTripsScreen from '../screens/employee/MyTripsScreen';
import RewardsScreen from '../screens/employee/RewardsScreen';
import RecurringRidesScreen from '../screens/employee/RecurringRidesScreen';
import MessagesScreen from '../screens/employee/MessagesScreen';
import CommuteProfileScreen from '../screens/employee/CommuteProfileScreen';
import SettingsScreen from '../screens/employee/SettingsScreen';

const Tab = createBottomTabNavigator<EmployeeTabParamList>();
const Stack = createNativeStackNavigator<EmployeeStackParamList>();

function EmployeeTabs() {
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
            Dashboard: 'home',
            LogCommute: 'add-circle',
            FindRide: 'search',
            MyImpact: 'leaf',
            More: 'grid',
          };
          return <Ionicons name={icons[route.name] ?? 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="LogCommute" component={LogCommuteScreen} options={{ title: 'Log Trip' }} />
      <Tab.Screen name="FindRide" component={FindRideScreen} options={{ title: 'Find Ride' }} />
      <Tab.Screen name="MyImpact" component={MyImpactScreen} options={{ title: 'Impact' }} />
      <Tab.Screen name="More" component={MoreScreen} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
}

export default function EmployeeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { color: COLORS.textPrimary },
      }}
    >
      <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="OfferRide" component={OfferRideScreen} options={{ title: 'Offer a Ride' }} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} options={{ title: 'Active Trip' }} />
      <Stack.Screen name="MyTrips" component={MyTripsScreen} options={{ title: 'My Trips' }} />
      <Stack.Screen name="Rewards" component={RewardsScreen} options={{ title: 'OxyPoints & Rewards' }} />
      <Stack.Screen name="RecurringRides" component={RecurringRidesScreen} options={{ title: 'Recurring Rides' }} />
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages' }} />
      <Stack.Screen name="CommuteProfile" component={CommuteProfileScreen} options={{ title: 'Commute Profile' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}
