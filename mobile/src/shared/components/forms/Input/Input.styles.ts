import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme';
import { InputSize, InputVariant, InputState } from './Input.types';

export const createStyles = (
  theme: AppTheme,
  variant: InputVariant,
  size: InputSize,
  state: InputState,
) => {
  let paddingVertical: number = theme.spacing.base.md;
  let paddingHorizontal: number = theme.spacing.base.md;
  let typographyVariant: keyof AppTheme['typography'] = 'bodyMedium';
  const accessoryGap: number = theme.spacing.base.sm;
  let minHeight: number = 48;

  switch (size) {
    case 'sm':
      paddingVertical = theme.spacing.base.sm;
      paddingHorizontal = theme.spacing.base.sm;
      typographyVariant = 'bodySmall';
      minHeight = 40;
      break;
    case 'md':
      paddingVertical = theme.spacing.base.md;
      paddingHorizontal = theme.spacing.base.md;
      typographyVariant = 'bodyMedium';
      minHeight = 48;
      break;
    case 'lg':
      paddingVertical = theme.spacing.base.lg;
      paddingHorizontal = theme.spacing.base.lg;
      typographyVariant = 'bodyLarge';
      minHeight = 56;
      break;
  }

  let borderColor = theme.colors.border;
  let backgroundColor = theme.colors.surface;
  let textColor = theme.colors.textPrimary;
  let iconColor = theme.colors.textSecondary;

  if (state === 'disabled') {
    borderColor = theme.colors.disabled;
    backgroundColor = theme.colors.disabledBackground;
    textColor = theme.colors.textDisabled;
    iconColor = theme.colors.textDisabled;
  } else if (state === 'error') {
    borderColor = theme.colors.error;
    iconColor = theme.colors.error;
  } else if (state === 'success') {
    borderColor = theme.colors.success;
    iconColor = theme.colors.success;
  } else if (state === 'focused') {
    borderColor = theme.colors.primary;
    iconColor = theme.colors.primary;
  } else if (state === 'readOnly') {
    backgroundColor = theme.colors.background;
  }

  let borderWidth: number = 1;
  let borderBottomWidth: number = 1;
  let borderRadius: number = theme.radius.shape.input;

  switch (variant) {
    case 'outlined':
      backgroundColor =
        state === 'disabled' ? theme.colors.disabledBackground : 'transparent';
      break;
    case 'filled':
      backgroundColor =
        state === 'disabled'
          ? theme.colors.disabledBackground
          : theme.colors.background;
      borderWidth = 0;
      borderBottomWidth = 1;
      if (state === 'focused') {
        borderBottomWidth = 2;
      }
      break;
    case 'underlined':
      backgroundColor = 'transparent';
      borderWidth = 0;
      borderBottomWidth = 1;
      borderRadius = 0;
      paddingHorizontal = 0;
      if (state === 'focused') {
        borderBottomWidth = 2;
      }
      break;
  }

  return {
    styles: StyleSheet.create({
      container: {
        width: '100%',
        gap: theme.spacing.base.xs,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor,
        borderColor,
        borderWidth: variant === 'outlined' ? borderWidth : 0,
        borderBottomWidth:
          variant === 'underlined' || variant === 'filled'
            ? borderBottomWidth
            : borderWidth,
        borderRadius,
        minHeight,
        paddingHorizontal,
      },
      input: {
        flex: 1,
        ...theme.typography[typographyVariant],
        color: textColor,
        paddingVertical,
        paddingHorizontal: 0,
        margin: 0,
        textAlignVertical: 'center',
      },
      leftAccessory: {
        marginRight: accessoryGap,
      },
      rightAccessory: {
        marginLeft: accessoryGap,
      },
      label: {
        marginBottom: theme.spacing.base.xs,
      },
      helperText: {
        marginTop: theme.spacing.base.xxs,
      },
    }),
    placeholderTextColor:
      state === 'disabled'
        ? theme.colors.textDisabled
        : theme.colors.textSecondary,
    iconColor,
  };
};
