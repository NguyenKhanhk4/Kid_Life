import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { ContainerProps } from './Container.types';
import { getContainerStyles, getVariantStyles } from './Container.styles';

export const Container = forwardRef<View, ContainerProps>(
  (
    {
      children,
      variant = 'default',
      style,
      backgroundColor,
      padding,
      paddingHorizontal,
      paddingVertical,
      margin,
      marginHorizontal,
      marginVertical,
      flex = 1,
      center = false,
      safe = false,
      scrollable = false, // Future support
      testID,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const styles = useMemo(() => getContainerStyles(), []);

    const containerStyle = useMemo(() => {
      const variantStyle = getVariantStyles(theme, variant);

      const customStyles = StyleSheet.create({
        custom: {
          ...(flex !== undefined && { flex }),
          ...(backgroundColor !== undefined && { backgroundColor }),
          ...(padding !== undefined && { padding }),
          ...(paddingHorizontal !== undefined && { paddingHorizontal }),
          ...(paddingVertical !== undefined && { paddingVertical }),
          ...(margin !== undefined && { margin }),
          ...(marginHorizontal !== undefined && { marginHorizontal }),
          ...(marginVertical !== undefined && { marginVertical }),
        },
      });

      return [
        styles.base,
        variantStyle,
        center && styles.center,
        customStyles.custom,
        style,
      ];
    }, [
      theme,
      variant,
      flex,
      backgroundColor,
      padding,
      paddingHorizontal,
      paddingVertical,
      margin,
      marginHorizontal,
      marginVertical,
      center,
      styles,
      style,
    ]);

    // Use SafeAreaView if safe is true, else normal View
    const Wrapper = safe ? SafeAreaView : View;

    if (scrollable) {
      // Future implementation for full scrollable support.
      const wrapperStyle = StyleSheet.create({
        flex: { flex: flex !== undefined ? flex : 1 },
      });

      return (
        <Wrapper style={wrapperStyle.flex} testID={testID}>
          <ScrollView
            contentContainerStyle={containerStyle}
            showsVerticalScrollIndicator={false}
            {...rest}
          >
            {children}
          </ScrollView>
        </Wrapper>
      );
    }

    return (
      <Wrapper ref={ref} style={containerStyle} testID={testID} {...rest}>
        {children}
      </Wrapper>
    );
  },
);

Container.displayName = 'Container';
export default React.memo(Container);
