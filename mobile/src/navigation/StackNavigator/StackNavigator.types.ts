import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { lightColors } from '@/theme';

export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  contentStyle: {
    backgroundColor: lightColors.background,
  },
};


