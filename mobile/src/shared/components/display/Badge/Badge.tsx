import React, { forwardRef, memo, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BadgeProps } from './Badge.types';
import { getBadgeStyles } from './Badge.styles';
import {
  AppTheme,
  lightColors,
  textStyle,
  spacing,
  layout,
  radius,
  shape,
  opacity,
  shadow,
  elevation,
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
    shadows: {
      presets: shadow,
      elevation,
    },
    animation: {} as unknown as AppTheme['animation'],
    zIndex: {} as unknown as AppTheme['zIndex'],
    breakpoints: {} as unknown as AppTheme['breakpoints'],
    icons: {} as unknown as AppTheme['icons'],
  } as AppTheme;
};

export const Badge = memo(
  forwardRef<View, BadgeProps>(
    (
      {
        label,
        value,
        variant = 'filled',
        color = 'primary',
        size = 'md',
        icon,
        dot = false,
        outlined = false,
        rounded = true,
        pressable = false,
        disabled = false,
        onPress,
        style,
        textStyle,
        testID,
        accessibilityRole,
        accessibilityLabel,
        accessibilityHint,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();

      // Resolve shorthands
      const resolvedVariant = dot ? 'dot' : outlined ? 'outlined' : variant;
      const isDot = resolvedVariant === 'dot';
      const isPressable = pressable || !!onPress;

      const styles = useMemo(
        () =>
          getBadgeStyles(
            theme,
            size,
            resolvedVariant,
            color,
            rounded,
            disabled,
          ),
        [theme, size, resolvedVariant, color, rounded, disabled],
      );

      // Determine text content
      const content =
        label !== undefined ? label : value !== undefined ? String(value) : '';

      const renderContent = () => {
        if (isDot) return null;

        return (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            {content !== '' && (
              <Text
                style={[styles.text, textStyle]}
                numberOfLines={1}
                allowFontScaling={false}
              >
                {content}
              </Text>
            )}
          </>
        );
      };

      if (isPressable) {
        return (
          <Pressable
            ref={ref}
            onPress={onPress}
            disabled={disabled}
            style={[styles.container, style]}
            testID={testID}
            accessibilityRole={accessibilityRole || 'button'}
            accessibilityLabel={accessibilityLabel || content}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled }}
            {...rest}
          >
            {({ pressed }) => (
              <>
                {renderContent()}
                {pressed && !disabled && (
                  <View
                    style={[styles.overlay, { opacity: theme.opacity.pressed }]}
                  />
                )}
              </>
            )}
          </Pressable>
        );
      }

      return (
        <View
          ref={ref}
          style={[styles.container, style]}
          testID={testID}
          accessibilityRole={accessibilityRole || 'text'}
          accessibilityLabel={accessibilityLabel || content}
          accessibilityHint={accessibilityHint}
          {...rest}
        >
          {renderContent()}
        </View>
      );
    },
  ),
);

Badge.displayName = 'Badge';
export default Badge;
