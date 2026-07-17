import React, { forwardRef, memo } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { CardProps } from './Card.types';
import { getCardStyles } from './Card.styles';
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

export const Card = memo(
  forwardRef<View, CardProps>(
    (
      {
        children,
        variant = 'filled',
        size = 'md',
        padding,
        header,
        footer,
        leftAccessory,
        rightAccessory,
        loading = false,
        disabled = false,
        pressable = false,
        style,
        contentStyle,
        backgroundColor,
        borderColor,
        shadow: customShadow,
        radius: customRadius,
        testID,
        accessibilityRole,
        accessibilityLabel,
        accessibilityHint,
        onPress,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();
      const styles = getCardStyles(theme, variant, size, disabled);

      const isPressable = pressable || !!onPress;
      const isDisabled = disabled || loading;

      const customStyles = StyleSheet.create({
        custom: {
          ...(padding !== undefined && { padding }),
          ...(backgroundColor !== undefined && { backgroundColor }),
          ...(borderColor !== undefined && { borderColor, borderWidth: 1 }),
          ...(customShadow !== undefined && customShadow),
          ...(customRadius !== undefined && { borderRadius: customRadius }),
        },
      });

      const containerStyle = [styles.container, customStyles.custom, style];

      const renderContent = () => (
        <>
          {header && <View style={styles.header}>{header}</View>}
          <View style={styles.contentRow}>
            {leftAccessory && (
              <View style={styles.leftAccessory}>{leftAccessory}</View>
            )}
            <View style={[styles.body, contentStyle]}>{children}</View>
            {rightAccessory && (
              <View style={styles.rightAccessory}>{rightAccessory}</View>
            )}
          </View>
          {footer && <View style={styles.footer}>{footer}</View>}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          )}
        </>
      );

      if (isPressable) {
        return (
          <Pressable
            ref={ref}
            onPress={onPress}
            disabled={isDisabled}
            style={containerStyle}
            testID={testID}
            accessibilityRole={accessibilityRole || 'button'}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            {...rest}
          >
            {({ pressed }) => (
              <>
                {renderContent()}
                {pressed && !isDisabled && (
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
          style={containerStyle}
          testID={testID}
          accessibilityRole={accessibilityRole}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        >
          {renderContent()}
        </View>
      );
    },
  ),
);

Card.displayName = 'Card';
export default Card;
