import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/types';
import { DialogVariant } from './Dialog.types';

export const getDialogStyles = (theme: AppTheme, variant: DialogVariant) => {
  let titleColor = theme.colors.textPrimary;

  if (variant === 'error') titleColor = theme.colors.error;
  else if (variant === 'success') titleColor = theme.colors.success;
  else if (variant === 'warning') titleColor = theme.colors.warning;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    visualContainer: {
      marginBottom: theme.spacing.base.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...theme.typography.titleLarge,
      color: titleColor,
      textAlign: 'center',
      marginBottom: theme.spacing.base.sm,
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
    },
  });
};
