import React, { forwardRef, useMemo } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
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
import { ScreenProps } from './Screen.types';
import { getScreenStyles } from './Screen.styles';

export const Screen = forwardRef<View, ScreenProps>(
  (
    {
      children,
      scrollable = false,
      safeArea = true,
      backgroundColor,
      statusBarStyle = 'auto',
      keyboardAware = true,
      contentContainerStyle,
      style,
      header,
      footer,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      loading = false, // Future support
      testID,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const styles = useMemo(() => getScreenStyles(theme), [theme]);

    const containerStyle = [
      styles.container,
      { backgroundColor: backgroundColor || theme.colors.background },
      style,
    ];

    const Wrapper = safeArea ? SafeAreaView : View;

    const renderContent = () => {
      if (scrollable) {
        return (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        );
      }
      return (
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      );
    };

    const renderKeyboardAware = () => {
      if (keyboardAware) {
        return (
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {renderContent()}
          </KeyboardAvoidingView>
        );
      }
      return renderContent();
    };

    return (
      <Wrapper style={containerStyle} testID={testID} ref={ref} {...rest}>
        <StatusBar style={statusBarStyle} />
        {header}
        {renderKeyboardAware()}
        {footer}
        {/* loading overlay will go here in the future */}
      </Wrapper>
    );
  },
);

Screen.displayName = 'Screen';
export default React.memo(Screen);
