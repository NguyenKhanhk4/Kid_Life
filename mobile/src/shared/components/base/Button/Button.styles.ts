import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme';
import { ButtonSize, ButtonVariant } from './Button.types';

export const createStyles = (
  theme: AppTheme,
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  disabled: boolean,
) => {
  let paddingVertical: number = theme.spacing.base.sm;
  let paddingHorizontal: number = theme.spacing.base.lg;
  let typographyVariant: keyof AppTheme['typography'] = 'labelLarge';
  let iconGap: number = theme.spacing.base.xs;

  switch (size) {
    case 'xs':
      paddingVertical = theme.spacing.base.xxs;
      paddingHorizontal = theme.spacing.base.sm;
      typographyVariant = 'labelSmall';
      iconGap = theme.spacing.base.xxs;
      break;
    case 'sm':
      paddingVertical = theme.spacing.base.xs;
      paddingHorizontal = theme.spacing.base.md;
      typographyVariant = 'labelMedium';
      iconGap = theme.spacing.base.xs;
      break;
    case 'md':
      paddingVertical = theme.spacing.base.sm;
      paddingHorizontal = theme.spacing.base.lg;
      typographyVariant = 'labelLarge';
      iconGap = theme.spacing.layout.buttonGap;
      break;
    case 'lg':
      paddingVertical = theme.spacing.base.md;
      paddingHorizontal = theme.spacing.base.xl;
      typographyVariant = 'titleSmall';
      iconGap = theme.spacing.layout.buttonGap;
      break;
    case 'xl':
      paddingVertical = theme.spacing.base.lg;
      paddingHorizontal = theme.spacing.base['2xl'];
      typographyVariant = 'titleMedium';
      iconGap = theme.spacing.base.md;
      break;
  }

  let backgroundColor = 'transparent';
  let borderColor = 'transparent';
  let borderWidth = 0;
  let textColor: keyof AppTheme['colors'] = 'textPrimary';

  switch (variant) {
    case 'primary':
      backgroundColor = theme.colors.primary;
      textColor = 'onPrimary';
      break;
    case 'secondary':
      backgroundColor = theme.colors.secondary;
      textColor = 'onSecondary';
      break;
    case 'danger':
      backgroundColor = theme.colors.error;
      textColor = 'onPrimary';
      break;
    case 'success':
      backgroundColor = theme.colors.success;
      textColor = 'onPrimary';
      break;
    case 'warning':
      backgroundColor = theme.colors.warning;
      textColor = 'textPrimary';
      break;
    case 'outline':
      borderColor = theme.colors.border;
      borderWidth = 1;
      textColor = 'primary';
      break;
    case 'ghost':
    case 'text':
      textColor = 'primary';
      break;
  }

  if (disabled) {
    if (variant === 'outline') {
      borderColor = theme.colors.disabled;
      textColor = 'textDisabled';
    } else if (variant === 'ghost' || variant === 'text') {
      textColor = 'textDisabled';
    } else {
      backgroundColor = theme.colors.disabledBackground;
      textColor = 'textDisabled';
    }
  }

  return {
    styles: StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.shape.button,
        paddingVertical,
        paddingHorizontal,
        backgroundColor,
        borderColor,
        borderWidth,
        width: fullWidth ? '100%' : undefined,
        overflow: 'hidden',
      },
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.overlay,
      },
      contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: iconGap,
      },
    }),
    textColor,
    typographyVariant,
  };
};
