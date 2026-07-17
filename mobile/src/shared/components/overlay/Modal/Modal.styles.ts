import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/types';
import { ModalVariant } from './Modal.types';

export const getModalStyles = (theme: AppTheme, variant: ModalVariant) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay || 'rgba(0,0,0,0.5)',
      justifyContent: variant === 'bottom' ? 'flex-end' : 'center',
      alignItems: variant === 'fullscreen' ? 'stretch' : 'center',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    contentContainer: {
      backgroundColor: theme.colors.surface,
      width: variant === 'fullscreen' ? '100%' : '90%',
      height: variant === 'fullscreen' ? '100%' : undefined,
      maxHeight: variant === 'fullscreen' ? '100%' : '85%',
      borderRadius: variant === 'fullscreen' ? 0 : theme.radius.base.xl,
      borderBottomLeftRadius: variant === 'bottom' ? 0 : undefined,
      borderBottomRightRadius: variant === 'bottom' ? 0 : undefined,
      overflow: 'hidden',
      ...theme.shadows.presets.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.base.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      ...theme.typography.titleLarge,
      color: theme.colors.textPrimary,
      flex: 1,
    },
    closeButton: {
      padding: theme.spacing.base.xs,
      marginLeft: theme.spacing.base.sm,
    },
    closeText: {
      ...theme.typography.labelLarge,
      color: theme.colors.textSecondary,
    },
    body: {
      padding: theme.spacing.base.lg,
      flexShrink: 1,
    },
    footer: {
      padding: theme.spacing.base.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });
};
