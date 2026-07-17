import React, { forwardRef, memo } from 'react';
import { View, Text } from 'react-native';
import { DialogProps } from './Dialog.types';
import { getDialogStyles } from './Dialog.styles';
import { Modal } from '../Modal';
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

export const Dialog = memo(
  forwardRef<View, DialogProps>(
    (
      {
        visible,
        title,
        description,
        icon,
        illustration,
        primaryAction,
        secondaryAction,
        loading = false,
        onClose,
        variant: _variant = 'info',
        testID,
      },
      ref,
    ) => {
      const theme = useTheme();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const styles = getDialogStyles(theme, _variant as any);

      return (
        <Modal
          ref={ref}
          visible={visible}
          variant="center"
          dismissible={!loading}
          onClose={onClose}
          testID={testID}
        >
          <View style={styles.container}>
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

            {description && (
              <Text style={styles.description}>{description}</Text>
            )}

            {(primaryAction || secondaryAction) && (
              <View style={styles.actionsContainer}>
                {primaryAction && (
                  <Button
                    variant={primaryAction.variant || 'primary'}
                    size="md"
                    title={primaryAction.label}
                    onPress={primaryAction.onPress}
                    testID={primaryAction.testID}
                    loading={loading}
                    disabled={loading}
                  />
                )}
                {secondaryAction && (
                  <Button
                    variant={secondaryAction.variant || 'ghost'}
                    size="md"
                    title={secondaryAction.label}
                    onPress={secondaryAction.onPress}
                    testID={secondaryAction.testID}
                    disabled={loading}
                  />
                )}
              </View>
            )}
          </View>
        </Modal>
      );
    },
  ),
);

Dialog.displayName = 'Dialog';
export default Dialog;
