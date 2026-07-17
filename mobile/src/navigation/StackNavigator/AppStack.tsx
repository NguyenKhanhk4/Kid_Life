import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Navigators } from '../constants';
import { AppStackParamList, RootStackParamList } from '../types';
import { defaultScreenOptions } from './StackNavigator.types';
import { BottomTabNavigator } from '../TabNavigator';

const AppStackNav = createNativeStackNavigator<AppStackParamList>();

type AppStackProps = NativeStackScreenProps<RootStackParamList, typeof Navigators.Main>;

export const AppStack = ({ route }: AppStackProps) => {
  // The role is intentionally kept at the navigator boundary until auth/store
  // wiring is added. This makes the Figma parent and child experiences usable
  // independently while the backend auth contract is still being integrated.
  const role = (route.params as { role?: 'parent' | 'child' } | undefined)?.role ?? 'parent';

  return (
    <AppStackNav.Navigator screenOptions={defaultScreenOptions}>
      <AppStackNav.Screen
        name={Navigators.Main}
        children={() => (
          <BottomTabNavigator
            role={role}
          />
        )}
      />
    </AppStackNav.Navigator>
  );
};
