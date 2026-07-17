import React, { forwardRef, memo } from 'react';
import { View, Text } from 'react-native';
import { ErrorStateProps } from './ErrorState.types';
import { getErrorStateStyles } from './ErrorState.styles';
import { Button } from '@/shared/components/base/Button';
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

// Temporary mock hook
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

export const ErrorState = memo(
  forwardRef<View, ErrorStateProps>(
    (
      {
        variant: _variant = 'default',
        title,
        description,
        errorCode,
        icon,
        illustration,
        primaryAction,
        secondaryAction,
        children,
        style,
        testID,
      },
      ref,
    ) => {
      const theme = useTheme();
      const styles = getErrorStateStyles(theme);

      return (
        <View
          ref={ref}
          style={[styles.container, style]}
          testID={testID}
          accessibilityRole="alert"
        >
          {(illustration || icon) && (
            <View
              style={styles.visualContainer}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            >
              {illustration || icon}
            </View>
          )}

          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>

          {errorCode && (
            <Text style={styles.errorCode}>Error Code: {errorCode}</Text>
          )}

          {description && <Text style={styles.description}>{description}</Text>}

          {(primaryAction || secondaryAction) && (
            <View style={styles.actionsContainer}>
              {primaryAction && (
                <Button
                  variant="primary"
                  size="md"
                  title={primaryAction.label}
                  onPress={primaryAction.onPress}
                  testID={primaryAction.testID}
                />
              )}
              {secondaryAction && (
                <Button
                  variant="ghost"
                  size="md"
                  title={secondaryAction.label}
                  onPress={secondaryAction.onPress}
                  testID={secondaryAction.testID}
                />
              )}
            </View>
          )}

          {children}
        </View>
      );
    },
  ),
);

ErrorState.displayName = 'ErrorState';
export default ErrorState;
