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

// Centralized Tab Configuration
export const TAB_CONFIG: TabConfig[] = [
  {
    route: Routes.Main.Home,
    label: 'Trang chủ',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    route: Routes.Main.Tasks,
    label: 'Nhiệm vụ',
    icon: 'map-outline',
    activeIcon: 'map',
  },
  {
    route: Routes.Main.Community,
    label: 'Cộng đồng',
    icon: 'people-outline',
    activeIcon: 'people',
  },
  {
    route: Routes.Main.Notifications,
    label: 'Thông báo',
    icon: 'notifications-outline',
    activeIcon: 'notifications',
  },
  {
    route: Routes.Main.Profile,
    label: 'Tài khoản',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

const PlaceholderScreen: React.FC<TabPlaceholderProps> = ({
  name,
  description,
}) => (
  <Screen>
    <Container style={styles.placeholderContainer}>
      <Text variant="headlineMedium">{name}</Text>
      <Text
        variant="bodyMedium"
        color="textSecondary"
        style={styles.placeholderText}
      >
        {description}
      </Text>
    </Container>
  </Screen>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

export const BottomTabNavigator = () => {
  // Future RBAC or feature toggle logic can filter this array
  const visibleTabs = TAB_CONFIG;

  return (
    <Tab.Navigator screenOptions={defaultTabOptions}>
      {visibleTabs.map((config) => (
        <Tab.Screen
          key={config.route}
          name={config.route}
          options={{
            title: config.label,
            tabBarIcon: ({ color, size, focused }) =>
              getTabIcon(
                focused ? config.activeIcon : config.icon,
                focused,
                color,
                size,
              ),
            tabBarBadge:
              typeof config.badge === 'number'
                ? config.badge
                : config.badge
                  ? ''
                  : undefined,
            tabBarAccessibilityLabel: `${config.label} Tab`,
          }}
        >
          {() => config.route === Routes.Main.Home ? (
            <HomeParent />
          ) : config.route === Routes.Main.Tasks ? (
            <TasksParent />
          ) : (
            <PlaceholderScreen
              name={config.label}
              description="Navigation Ready"
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};
