import React, { forwardRef, memo } from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import { ButtonProps } from './Button.types';
import { createStyles } from './Button.styles';
import { Text } from '../Text';
import {
  AppTheme,
  lightColors,
  textStyle,
  spacing,
  layout,
  radius,
  shape,
  opacity,
} from '@/theme';

// Temporary mock hook since Theme architecture is frozen and global useTheme is not yet implemented.
const useTheme = (): AppTheme => {
  return {
    colors: lightColors,
    typography: textStyle,
    spacing: {
      base: spacing,
      layout,
      safeArea: {} as unknown as AppTheme['spacing']['safeArea'],
    },
    radius: {
      base: radius,
      shape,
    },
    opacity,
  } as AppTheme;
};

export const Button = memo(
  forwardRef<View, ButtonProps>(
    (
      {
        title,
        children,
        variant = 'primary',
        size = 'md',
        disabled = false,
        loading = false,
        leftIcon,
        rightIcon,
        fullWidth = false,
        style,
        textStyle,
        testID,
        accessibilityLabel,
        accessibilityRole = 'button',
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();

      const isDisabled = disabled || loading;
      const { styles, textColor, typographyVariant } = createStyles(
        theme,
        variant,
        size,
        fullWidth,
        isDisabled,
      );

      return (
        <Pressable
          ref={ref}
          disabled={isDisabled}
          testID={testID}
          accessibilityLabel={accessibilityLabel || title}
          accessibilityRole={accessibilityRole}
          accessibilityState={{ disabled: isDisabled, busy: loading }}
          style={[styles.container, style]}
          {...rest}
        >
          {({ pressed }) => (
            <>
              {pressed && !isDisabled && (
                <View
                  style={[styles.overlay, { opacity: theme.opacity.pressed }]}
                />
              )}
              <View style={styles.contentContainer}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors[textColor as keyof typeof theme.colors]}
                  />
                ) : (
                  <>
                    {leftIcon}
                    {children ? (
                      children
                    ) : title ? (
                      <Text
                        variant={typographyVariant}
                        color={textColor}
                        style={textStyle}
                        numberOfLines={1}
                      >
                        {title}
                      </Text>
                    ) : null}
                    {rightIcon}
                  </>
                )}
              </View>
            </>
          )}
        </Pressable>
      );
    },
  ),
);

Button.displayName = 'Button';
