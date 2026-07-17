import { StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { AppTheme } from '@/theme/types';
import { SkeletonVariant } from './Skeleton.types';

export const getSkeletonStyles = (
  theme: AppTheme,
  variant: SkeletonVariant,
  customWidth?: number | string,
  customHeight?: number | string,
  customRadius?: number,
) => {
  let w: number | string = customWidth !== undefined ? customWidth : '100%';
  let h: number | string =
    customHeight !== undefined
      ? customHeight
      : theme.typography.bodyMedium.lineHeight || 20;
  let r: number =
    customRadius !== undefined ? customRadius : theme.radius.base.sm;
  let mb: number = 0;

  switch (variant) {
    case 'text':
      mb = theme.spacing.base.xs;
      break;
    case 'avatar':
      w = customWidth !== undefined ? customWidth : 48;
      h = customHeight !== undefined ? customHeight : 48;
      r = customRadius !== undefined ? customRadius : theme.radius.base.full;
      break;
    case 'card':
      w = customWidth !== undefined ? customWidth : '100%';
      h = customHeight !== undefined ? customHeight : 120;
      r = customRadius !== undefined ? customRadius : theme.radius.shape.card;
      break;
    case 'button':
      w = customWidth !== undefined ? customWidth : '100%';
      h = customHeight !== undefined ? customHeight : 48;
      r = customRadius !== undefined ? customRadius : theme.radius.shape.button;
      break;
    case 'input':
      w = customWidth !== undefined ? customWidth : '100%';
      h = customHeight !== undefined ? customHeight : 56;
      r = customRadius !== undefined ? customRadius : theme.radius.shape.input;
      break;
    case 'circle':
      w = customWidth !== undefined ? customWidth : 40;
      h = customHeight !== undefined ? customHeight : 40;
      r = customRadius !== undefined ? customRadius : theme.radius.base.full;
      break;
    case 'rounded':
      r = customRadius !== undefined ? customRadius : theme.radius.base.md;
      break;
    case 'rectangle':
      r = customRadius !== undefined ? customRadius : theme.radius.base.none;
      break;
  }

  const baseStyle: ViewStyle = {
    width: w as DimensionValue,
    height: h as DimensionValue,
    borderRadius: r,
    backgroundColor: theme.colors.skeleton,
    marginBottom: mb,
    overflow: 'hidden',
  };

  return StyleSheet.create({
    base: baseStyle,
    container: {
      flexDirection: 'column',
    },
    lastLine: {
      marginBottom: 0,
    },
  });
};
