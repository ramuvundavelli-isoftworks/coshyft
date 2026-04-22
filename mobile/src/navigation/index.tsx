import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { COLORS } from '../constants';
import type { RootStackParamList } from '../types';
import { navigationRef } from './navigationRef';

import AuthNavigator from './AuthNavigator';
import EmployeeNavigator from './EmployeeNavigator';
import SustainabilityNavigator from './SustainabilityNavigator';
import AdminNavigator from './AdminNavigator';
import AuditorNavigator from './AuditorNavigator';
import SuperAdminNavigator from './SuperAdminNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RoleRouter() {
  const { role } = useRole();

  switch (role) {
    case 'employee':
      return <EmployeeNavigator />;
    case 'sustainability':
      return <SustainabilityNavigator />;
    case 'admin':
      return <AdminNavigator />;
    case 'auditor':
      return <AuditorNavigator />;
    case 'superadmin':
      return <SuperAdminNavigator />;
    default:
      return <EmployeeNavigator />;
  }
}

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Employee" component={RoleRouter} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
