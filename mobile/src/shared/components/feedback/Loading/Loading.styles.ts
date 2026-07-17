import { StyleSheet, ViewStyle } from 'react-native';
import { AppTheme } from '@/theme/types';

export const getLoadingStyles = (
  theme: AppTheme,
  fullscreen: boolean,
  overlay: boolean,
) => {
  const absoluteFill: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.modal,
  };

  const containerStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    ...(fullscreen || overlay ? absoluteFill : {}),
    ...(overlay && !fullscreen
      ? { backgroundColor: theme.colors.overlay }
      : {}),
    ...(fullscreen ? { backgroundColor: theme.colors.background } : {}),
  };

  return StyleSheet.create({
    container: containerStyle,
    label: {
      ...theme.typography.labelMedium,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.base.sm,
      textAlign: 'center',
    },
  });
};
