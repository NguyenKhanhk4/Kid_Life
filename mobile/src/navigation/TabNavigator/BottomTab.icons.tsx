import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  iconPlaceholder: {
    borderRadius: 999,
  },
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0.5,
  },
});

import { Ionicons } from '@expo/vector-icons';

export const getTabIcon = (
  iconName: string,
  isActive: boolean,
  color: string,
  size: number,
): React.ReactNode => {
  return (
    <Ionicons name={iconName as any} size={size} color={color} />
  );
};
