import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getScreenStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
  });
};
