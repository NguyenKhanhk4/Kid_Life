import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Navigators } from '../constants';
import { AppStackParamList } from '../types';
import { defaultScreenOptions } from './StackNavigator.types';
import { BottomTabNavigator } from '../TabNavigator';

const AppStackNav = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
  return (
    <AppStackNav.Navigator screenOptions={defaultScreenOptions}>
      <AppStackNav.Screen
        name={Navigators.Main}
        component={BottomTabNavigator}
      />
    </AppStackNav.Navigator>
  );
};
