import { StyleSheet, ViewStyle } from 'react-native';
import { AppTheme } from '@/theme/types';

export const getProgressStyles = (
  theme: AppTheme,
  color: string,
  variant: 'linear' | 'circular',
) => {
  const isCircular = variant === 'circular';

  const containerStyle: ViewStyle = isCircular
    ? {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
      }
    : {
        height: 8,
        width: '100%',
        backgroundColor: theme.colors.disabledBackground,
        borderRadius: theme.radius.base.full,
        overflow: 'hidden',
      };

  return StyleSheet.create({
    container: containerStyle,
    bar: {
      height: '100%',
      backgroundColor: color,
      borderRadius: theme.radius.base.full,
    },
    label: {
      ...theme.typography.labelSmall,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.base.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: theme.spacing.base.xs,
    },
    noMarginTop: {
      marginTop: 0,
    },
  });
};
