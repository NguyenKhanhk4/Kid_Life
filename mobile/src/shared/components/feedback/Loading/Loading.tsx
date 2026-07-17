import React, { forwardRef, memo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { LoadingProps } from './Loading.types';
import { getLoadingStyles } from './Loading.styles';
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
    zIndex: {
      base: 0,
      elevated: 10,
      modal: 100,
      popover: 1000,
      tooltip: 2000,
    } as unknown as AppTheme['zIndex'],
    breakpoints: {} as unknown as AppTheme['breakpoints'],
    icons: {} as unknown as AppTheme['icons'],
  } as AppTheme;
};

export const Loading = memo(
  forwardRef<View, LoadingProps>(
    (
      {
        visible = true,
        fullscreen = false,
        overlay = false,
        size = 'large',
        color = 'primary',
        label,
        style,
        labelStyle,
        testID,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();
      const styles = getLoadingStyles(theme, fullscreen, overlay);

      if (!visible) return null;

      // Resolve color
      const isSemanticColor =
        typeof color === 'string' && color in theme.colors;
      const resolvedColor = isSemanticColor
        ? theme.colors[color as keyof typeof theme.colors]
        : color || theme.colors.primary;

      const indicatorSize = size as 'small' | 'large' | number;

      return (
        <View
          ref={ref}
          style={[styles.container, style]}
          testID={testID}
          accessibilityRole="progressbar"
          accessibilityLabel={label || 'Loading'}
          accessibilityLiveRegion="assertive"
        >
          <ActivityIndicator
            size={indicatorSize}
            color={resolvedColor}
            {...rest}
          />
          {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        </View>
      );
    },
  ),
);

Loading.displayName = 'Loading';
export default Loading;
