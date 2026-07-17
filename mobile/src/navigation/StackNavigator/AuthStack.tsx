import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '../constants';
import { AuthStackParamList } from '../types';
import { defaultScreenOptions } from './StackNavigator.types';
import { LoginScreen } from '@/modules/auth/screens/LoginScreen';
import { RegisterScreen } from '@/modules/auth/screens/RegisterScreen';
import { ForgotPasswordScreen } from '@/modules/auth/screens/ForgotPasswordScreen';
import { OTPScreen } from '@/modules/auth/screens/OTPScreen';
import { OnboardingScreen } from '@/modules/startup/screens/OnboardingScreen';
import { RoleSelectionScreen } from '@/modules/startup/screens/RoleSelectionScreen';

const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <AuthStackNav.Navigator screenOptions={defaultScreenOptions}>
      <AuthStackNav.Screen
        name={Routes.Auth.Onboarding}
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <AuthStackNav.Screen
        name={Routes.Auth.Login}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStackNav.Screen
        name={Routes.Auth.Register}
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <AuthStackNav.Screen
        name={Routes.Auth.ForgotPassword}
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <AuthStackNav.Screen
        name={Routes.Auth.OTP}
        component={OTPScreen}
        options={{ headerShown: false }}
      />
      <AuthStackNav.Screen
        name={Routes.Auth.RoleSelection}
        component={RoleSelectionScreen}
        options={{ headerShown: false }}
      />
    </AuthStackNav.Navigator>
  );
};
