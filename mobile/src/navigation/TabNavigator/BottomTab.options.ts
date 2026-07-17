import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { lightColors } from '@/theme';
import { styles } from './BottomTab.styles';

export const defaultTabOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: lightColors.primary,
  tabBarInactiveTintColor: lightColors.textSecondary,
  tabBarStyle: styles.tabBar,
  tabBarHideOnKeyboard: true,
};
