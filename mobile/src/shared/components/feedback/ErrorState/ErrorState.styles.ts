import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/types';

export const getErrorStateStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.base.xl,
    },
    visualContainer: {
      marginBottom: theme.spacing.base.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...theme.typography.titleLarge,
      color: theme.colors.error, // Errors often use error color for title
      textAlign: 'center',
      marginBottom: theme.spacing.base.sm,
    },
    errorCode: {
      ...theme.typography.labelSmall,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.base.xs,
    },
    description: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.base.xl,
    },
    actionsContainer: {
      width: '100%',
      gap: theme.spacing.base.md,
      alignItems: 'center',
    },
  });
};
