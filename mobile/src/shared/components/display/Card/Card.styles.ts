/* eslint-disable react-native/no-color-literals */
import { StyleSheet, ViewStyle } from 'react-native';
import { AppTheme } from '@/theme/types';
import { CardVariant, CardSize } from './Card.types';

export const getCardStyles = (
  theme: AppTheme,
  variant: CardVariant,
  size: CardSize,
  disabled: boolean,
) => {
  const paddingMap: Record<CardSize, number> = {
    sm: theme.spacing.base.sm,
    md: theme.spacing.base.md,
    lg: theme.spacing.layout.cardPadding,
  };

  const padding = paddingMap[size];
  const radius = theme.radius.shape.card;

  const base: ViewStyle = {
    borderRadius: radius,
    padding,
    overflow: 'hidden',
  };

  const variantStyles = StyleSheet.create({
    filled: {
      backgroundColor: theme.colors.surface,
    },
    outlined: {
      // eslint-disable-next-line react-native/no-color-literals
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    elevated: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.presets.card,
    },
    ghost: {
      // eslint-disable-next-line react-native/no-color-literals
      backgroundColor: 'transparent',
    },
    interactive: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.presets.floating,
    },
  });

  const selectedVariantStyle = variantStyles[variant];

  return StyleSheet.create({
    container: {
      ...base,
      ...selectedVariantStyle,
      opacity: disabled ? theme.opacity.disabled : 1,
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    body: {
      flex: 1,
    },
    header: {
      marginBottom: theme.spacing.base.sm,
    },
    footer: {
      marginTop: theme.spacing.base.sm,
    },
    leftAccessory: {
      marginRight: theme.spacing.base.sm,
    },
    rightAccessory: {
      marginLeft: theme.spacing.base.sm,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.textPrimary,
      opacity: 0,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      opacity: theme.opacity.loading,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
