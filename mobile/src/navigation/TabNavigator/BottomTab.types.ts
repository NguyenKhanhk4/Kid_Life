import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

export type TabRouteName = keyof MainTabParamList;

export interface TabConfig {
  route: TabRouteName;
  label: string;
  icon: string;
  activeIcon: string;
  badge?: boolean | number;
  // Future RBAC and Feature Flags
  permissions?: string[];
  featureFlag?: string;
  options?: BottomTabNavigationOptions;
}

export interface TabPlaceholderProps {
  name: string;
  description: string;
}
