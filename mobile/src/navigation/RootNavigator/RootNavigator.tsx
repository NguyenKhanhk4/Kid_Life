import React, { useMemo } from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { lightColors } from '@/theme';

import { Navigators, Routes } from '../constants';
import { RootStackParamList } from '../types';
import { AppStack, AuthStack } from '../StackNavigator';
import { ModalNavigator } from '../ModalNavigator';
import { navigationRef } from '../NavigationService';

// Linking Configuration (Placeholder)
const linking = {
  prefixes: ['kidlife://', 'https://kidlife.app'],
  config: {
    screens: {
      [Navigators.Main]: {
        screens: {
          // Future Tabs mappings
        },
      },
    },
  },
};

import { SplashScreen } from '@/modules/startup/screens/SplashScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  // Map our Theme system to React Navigation
  const navigationTheme: NavigationTheme = useMemo(
    () => ({
      ...NavigationDefaultTheme,
      dark: false,
      colors: {
        ...NavigationDefaultTheme.colors,
        primary: lightColors.primary,
        background: lightColors.background,
        card: lightColors.surface,
        text: lightColors.textPrimary,
        border: lightColors.border,
        notification: lightColors.error,
      },
    }),
    [],
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      linking={linking}
    >
      <RootStack.Navigator
        initialRouteName={Routes.Root.Splash}
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name={Routes.Root.Splash} component={SplashScreen} />
        <RootStack.Screen name={Navigators.Auth} component={AuthStack} />
        <RootStack.Screen
          name={Navigators.Main}
          component={AppStack}
          options={{ presentation: 'card' }}
        />
        <RootStack.Screen
          name={Navigators.Modal}
          component={ModalNavigator}
          options={{
            presentation: 'transparentModal',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
