import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from '../constants';
import { MainTabParamList } from '../types';
import { TabConfig, TabPlaceholderProps } from './BottomTab.types';
import { defaultTabOptions } from './BottomTab.options';
import { getTabIcon } from './BottomTab.icons';
import { styles } from './BottomTab.styles';
import { Screen, Container, Text } from '@/shared/components';
import HomeParent from '@/modules/parent/screens/HomeParent';
import TasksParent from '@/modules/parent/screens/TasksParent';
import ChildHomeScreen from '@/modules/child/screens/ChildHomeScreen';
import WalletScreen from '@/modules/child/screens/WalletScreen';
import PetScreen from '@/modules/child/screens/PetScreen';
import ChildTasksScreen from '@/modules/child/screens/ChildTasksScreen';
import StoreScreen from '@/modules/child/screens/StoreScreen';
import AchievementsScreen from '@/modules/child/screens/AchievementsScreen';
import ChildAccountScreen from '@/modules/child/screens/ChildAccountScreen';
import CommunityScreen from '@/modules/parent/screens/CommunityScreen';
import AccountParentScreen from '@/modules/parent/screens/AccountParentScreen';
import NotificationScreen from '@/modules/notification/screens/NotificationScreen';

type AppRole = 'parent' | 'child';

const Tab = createBottomTabNavigator<MainTabParamList>();

const PlaceholderScreen: React.FC<TabPlaceholderProps> = ({ name, description }) => (
  <Screen><Container style={styles.placeholderContainer}><Text variant="headlineMedium">{name}</Text><Text variant="bodyMedium" color="textSecondary" style={styles.placeholderText}>{description}</Text></Container></Screen>
);

const parentTabs: TabConfig[] = [
  { route: Routes.Main.Home, label: 'Trang chủ', icon: 'home-outline', activeIcon: 'home' },
  { route: Routes.Main.Tasks, label: 'Nhiệm vụ', icon: 'map-outline', activeIcon: 'map' },
  { route: Routes.Main.Community, label: 'Cộng đồng', icon: 'people-outline', activeIcon: 'people' },
  { route: Routes.Main.Notifications, label: 'Thông báo', icon: 'notifications-outline', activeIcon: 'notifications' },
  { route: Routes.Main.Profile, label: 'Tài khoản', icon: 'person-outline', activeIcon: 'person' },
];

const childTabs: TabConfig[] = [
  { route: Routes.Main.Home, label: 'Trang chủ', icon: 'home-outline', activeIcon: 'home' },
  { route: Routes.Main.Tasks, label: 'Nhiệm vụ', icon: 'map-outline', activeIcon: 'map' },
  { route: Routes.Main.Community, label: 'Cửa hàng', icon: 'storefront-outline', activeIcon: 'storefront' },
  { route: Routes.Main.Notifications, label: 'Thành tích', icon: 'trophy-outline', activeIcon: 'trophy' },
  { route: Routes.Main.Profile, label: 'Thông tin', icon: 'person-outline', activeIcon: 'person' },
];

export const BottomTabNavigator = ({ role = 'parent' }: { role?: AppRole }) => {
  const tabs = role === 'child' ? childTabs : parentTabs;
  return <Tab.Navigator screenOptions={defaultTabOptions}>
    {tabs.map((config) => <Tab.Screen key={config.route} name={config.route} options={{ title: config.label, tabBarIcon: ({ color, size, focused }) => getTabIcon(focused ? config.activeIcon : config.icon, focused, color, size), tabBarAccessibilityLabel: `${config.label} Tab` }}>
      {() => {
        if (role === 'child') {
          if (config.route === Routes.Main.Home) return <ChildHomeScreen />;
          if (config.route === Routes.Main.Community) return <WalletScreen />;
          if (config.route === Routes.Main.Notifications) return <PetScreen />;
          if (config.route === Routes.Main.Tasks) return <ChildTasksScreen />;
          if (config.route === Routes.Main.Community) return <StoreScreen />;
          if (config.route === Routes.Main.Notifications) return <AchievementsScreen />;
          return <ChildAccountScreen />;
        }
        if (config.route === Routes.Main.Home) return <HomeParent />;
        if (config.route === Routes.Main.Tasks) return <TasksParent />;
        if (config.route === Routes.Main.Community) return <CommunityScreen />;
        if (config.route === Routes.Main.Notifications) return <NotificationScreen />;
        if (config.route === Routes.Main.Profile) return <AccountParentScreen />;
        return <PlaceholderScreen name={config.label} description="Navigation Ready" />;
      }}
    </Tab.Screen>)}
  </Tab.Navigator>;
};
