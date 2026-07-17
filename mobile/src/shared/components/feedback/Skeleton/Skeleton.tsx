import React, { forwardRef, memo, useEffect, useState, useMemo } from 'react';
import { View, Animated } from 'react-native';
import { SkeletonProps } from './Skeleton.types';
import { getSkeletonStyles } from './Skeleton.styles';
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

export const Skeleton = memo(
  forwardRef<View, SkeletonProps>(
    (
      {
        width,
        height,
        variant = 'text',
        lines = 1,
        animated = true,
        radius: customRadius,
        style,
        testID,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();
      const styles = useMemo(
        () => getSkeletonStyles(theme, variant, width, height, customRadius),
        [theme, variant, width, height, customRadius],
      );

      const [animValue] = useState(() => new Animated.Value(0.5));

      useEffect(() => {
        if (animated) {
          const loop = Animated.loop(
            Animated.sequence([
              Animated.timing(animValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(animValue, {
                toValue: 0.5,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
          );
          loop.start();
          return () => loop.stop();
        } else {
          animValue.setValue(1);
        }
      }, [animated, animValue]);

      const animatedStyle = {
        opacity: animValue,
      };

      const renderLines = () => {
        const items = [];
        for (let i = 0; i < lines; i++) {
          const isLast = i === lines - 1 && lines > 1;
          const lineWidth =
            isLast && width === undefined ? '60%' : styles.base.width;

          items.push(
            <Animated.View
              key={i}
              style={[
                styles.base,
                animatedStyle,
                { width: lineWidth },
                lines === 1 ? style : undefined,
                i === lines - 1 ? styles.lastLine : undefined,
              ]}
              {...rest}
            />,
          );
        }

        if (lines > 1) {
          return (
            <View ref={ref} style={[styles.container, style]} testID={testID}>
              {items}
            </View>
          );
        }

        return (
          <View ref={ref} testID={testID}>
            {items[0]}
          </View>
        );
      };

      return renderLines();
    },
  ),
);

Skeleton.displayName = 'Skeleton';
export default Skeleton;
