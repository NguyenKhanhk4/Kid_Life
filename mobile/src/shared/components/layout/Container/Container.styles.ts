import { StyleSheet, ViewStyle } from 'react-native';
import { AppTheme } from '@/theme/types';
import { ContainerVariant } from './Container.types';

export const getContainerStyles = () => {
  return StyleSheet.create({
    base: {
      // Base styles applied to all containers
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export const getVariantStyles = (
  theme: AppTheme,
  variant: ContainerVariant,
): ViewStyle => {
  switch (variant) {
    case 'surface':
      return {
        backgroundColor: theme.colors.surface,
      };
    case 'transparent':
      return {
        backgroundColor: 'transparent',
      };
    case 'default':
    default:
      return {
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.layout.screenPadding,
      };
  }
};
