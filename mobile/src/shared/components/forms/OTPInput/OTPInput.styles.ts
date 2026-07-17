import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme';

export const createStyles = (
  theme: AppTheme,
  error: boolean,
  disabled: boolean,
) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.base.sm,
    },
    inputBox: {
      flex: 1,
      height: 56,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: theme.radius.shape.button,
      backgroundColor: disabled
        ? theme.colors.disabledBackground
        : theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputBoxFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    input: {
      ...theme.typography.headlineMedium,
      color: disabled ? theme.colors.textDisabled : theme.colors.textPrimary,
      textAlign: 'center',
      width: '100%',
      height: '100%',
    },
  });
};
