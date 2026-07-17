import React, { forwardRef, memo } from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  Pressable,
  ScrollView,
} from 'react-native';
import { ModalProps } from './Modal.types';
import { getModalStyles } from './Modal.styles';
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

export const Modal = memo(
  forwardRef<View, ModalProps>(
    (
      {
        visible,
        children,
        title,
        header,
        footer,
        dismissible = true,
        animationType = 'fade',
        onClose,
        style,
        contentStyle,
        overlayStyle,
        variant = 'default',
        testID,
      },
      ref,
    ) => {
      const theme = useTheme();
      const styles = getModalStyles(theme, variant);

      const handleClose = () => {
        if (dismissible && onClose) {
          onClose();
        }
      };

      return (
        <RNModal
          visible={visible}
          transparent
          animationType={animationType}
          onRequestClose={handleClose}
          testID={testID}
        >
          <View style={[styles.overlay, overlayStyle]}>
            <Pressable
              style={styles.backdrop}
              onPress={handleClose}
              accessible={false}
              importantForAccessibility="no"
            />
            <View
              ref={ref}
              style={[styles.contentContainer, style]}
              accessibilityViewIsModal={true}
            >
              {header ? (
                header
              ) : title ? (
                <View style={styles.header}>
                  <Text style={styles.title} accessibilityRole="header">
                    {title}
                  </Text>
                  {dismissible && (
                    <Pressable
                      style={styles.closeButton}
                      onPress={handleClose}
                      accessibilityRole="button"
                      accessibilityLabel="Close modal"
                    >
                      <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                  )}
                </View>
              ) : null}

              <ScrollView
                style={[styles.body, contentStyle]}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>

              {footer && <View style={styles.footer}>{footer}</View>}
            </View>
          </View>
        </RNModal>
      );
    },
  ),
);

Modal.displayName = 'Modal';
export default Modal;
