/* eslint-disable react-native/no-color-literals */
import { StyleSheet, TextStyle } from 'react-native';
import { AppTheme } from '@/theme/types';
import { AvatarSize, AvatarVariant } from './Avatar.types';

export const getAvatarStyles = (
  theme: AppTheme,
  size: AvatarSize,
  variant: AvatarVariant,
  disabled: boolean,
  hasBorder: boolean,
  customBorderColor?: string,
  customBackgroundColor?: string,
) => {
  const sizeMap: Record<AvatarSize, number> = {
    xs: theme.spacing.base['2xl'],
    sm: theme.spacing.base['3xl'],
    md: theme.spacing.base['4xl'],
    lg: theme.spacing.base['5xl'],
    xl: theme.spacing.base['6xl'],
    '2xl': theme.spacing.base['7xl'],
  };

  const dimension = sizeMap[size];

  const radiusMap: Record<AvatarVariant, number> = {
    circle: theme.radius.base.full,
    rounded: theme.radius.shape.button,
    square: theme.radius.base.none,
  };

  const borderRadius = radiusMap[variant];

  const typographyMap: Record<AvatarSize, TextStyle> = {
    xs: theme.typography.labelSmall,
    sm: theme.typography.labelMedium,
    md: theme.typography.titleMedium,
    lg: theme.typography.titleLarge,
    xl: theme.typography.headlineMedium,
    '2xl': theme.typography.headlineLarge,
  };

  const indicatorSizeMap: Record<AvatarSize, number> = {
    xs: theme.spacing.base.xs,
    sm: theme.spacing.base.sm,
    md: theme.spacing.base.sm,
    lg: theme.spacing.base.md,
    xl: theme.spacing.base.md,
    '2xl': theme.spacing.base.lg,
  };
  const indicatorSize = indicatorSizeMap[size];

  return StyleSheet.create({
    wrapper: {
      opacity: disabled ? theme.opacity.disabled : 1,
      alignSelf: 'flex-start',
    },
    content: {
      width: dimension,
      height: dimension,
      borderRadius,
      backgroundColor: customBackgroundColor || theme.colors.surface,
      borderWidth: hasBorder ? 2 : 0,
      borderColor: customBorderColor || theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    text: {
      ...typographyMap[size],
      color: theme.colors.primary,
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
    indicatorContainer: {
      position: 'absolute',
      bottom: variant === 'circle' ? 0 : -2,
      right: variant === 'circle' ? 0 : -2,
      width: indicatorSize + 4,
      height: indicatorSize + 4,
      borderRadius: theme.radius.base.full,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    indicator: {
      width: indicatorSize,
      height: indicatorSize,
      borderRadius: theme.radius.base.full,
      backgroundColor: theme.colors.success,
    },
    badgeContainer: {
      position: 'absolute',
      top: variant === 'circle' ? -4 : -8,
      right: variant === 'circle' ? -4 : -8,
      zIndex: 2,
    },
    placeholderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.disabledBackground,
    },
    placeholderInitial: {
      ...typographyMap[size],
      color: theme.colors.textDisabled,
    },
  });
};
