/* eslint-disable react-native/no-color-literals */
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { AppTheme } from '@/theme/types';
import { BadgeSize, BadgeVariant, BadgeColor } from './Badge.types';

export const getBadgeStyles = (
  theme: AppTheme,
  size: BadgeSize,
  variant: BadgeVariant,
  color: BadgeColor,
  rounded: boolean,
  disabled: boolean,
) => {
  // 1. Resolve Colors
  let mainColor = '';
  let containerColor = '';
  let onMainColor = '';

  switch (color) {
    case 'primary':
      mainColor = theme.colors.primary;
      containerColor = theme.colors.primaryContainer;
      onMainColor = theme.colors.onPrimary;
      break;
    case 'secondary':
      mainColor = theme.colors.secondary;
      containerColor = theme.colors.secondaryContainer;
      onMainColor = theme.colors.onSecondary;
      break;
    case 'success':
      mainColor = theme.colors.success;
      containerColor = theme.colors.success;
      onMainColor = theme.colors.surface;
      break;
    case 'warning':
      mainColor = theme.colors.warning;
      containerColor = theme.colors.warning;
      onMainColor = theme.colors.surface;
      break;
    case 'error':
      mainColor = theme.colors.error;
      containerColor = theme.colors.error;
      onMainColor = theme.colors.surface;
      break;
    case 'info':
      mainColor = theme.colors.info;
      containerColor = theme.colors.info;
      onMainColor = theme.colors.surface;
      break;
    case 'neutral':
    default:
      mainColor = theme.colors.textSecondary;
      containerColor = theme.colors.surface;
      onMainColor = theme.colors.surface;
      break;
  }

  // 2. Resolve Variant Styles
  let bg = 'transparent';
  let borderW = 0;
  let borderC = 'transparent';
  let textC = mainColor;

  switch (variant) {
    case 'filled':
      bg = mainColor;
      textC = onMainColor;
      break;
    case 'outlined':
      bg = 'transparent';
      borderW = 1;
      borderC = color === 'neutral' ? theme.colors.border : mainColor;
      textC = mainColor;
      break;
    case 'soft':
      bg = containerColor;
      textC = mainColor;
      break;
    case 'ghost':
      bg = 'transparent';
      textC = mainColor;
      break;
    case 'dot':
      bg = mainColor;
      break;
  }

  // 3. Resolve Size Styles
  const isDot = variant === 'dot';

  let height = 0;
  let px = 0;
  let typography: TextStyle = {};

  if (isDot) {
    const dotSizes: Record<BadgeSize, number> = {
      xs: 6,
      sm: 8,
      md: 10,
      lg: 12,
    };
    height = dotSizes[size];
    px = 0;
  } else {
    const heights: Record<BadgeSize, number> = {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
    };
    const paddingX: Record<BadgeSize, number> = {
      xs: 4,
      sm: 6,
      md: 8,
      lg: 10,
    };
    const typographies: Record<BadgeSize, TextStyle> = {
      xs: theme.typography.labelSmall,
      sm: theme.typography.labelSmall,
      md: theme.typography.labelMedium,
      lg: theme.typography.labelLarge,
    };

    height = heights[size];
    px = paddingX[size];
    typography = typographies[size];
  }

  const borderRadius = rounded
    ? height / 2
    : theme.radius.shape.badge || theme.radius.base.sm;

  const baseContainer: ViewStyle = {
    height,
    minWidth: height,
    paddingHorizontal: px,
    borderRadius,
    backgroundColor: bg,
    borderWidth: borderW,
    borderColor: borderC,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: disabled ? theme.opacity.disabled : 1,
  };

  return StyleSheet.create({
    container: baseContainer,
    text: {
      ...typography,
      color: textC,
      textAlign: 'center',
    },
    iconContainer: {
      marginRight: isDot ? 0 : 4,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius,
      backgroundColor: theme.colors.textPrimary,
      opacity: 0,
    },
  });
};
