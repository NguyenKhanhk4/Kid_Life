import React, { forwardRef, memo, useEffect, useState, useMemo } from 'react';
import { View, Text, Animated } from 'react-native';
import { ProgressProps } from './Progress.types';
import { getProgressStyles } from './Progress.styles';
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

export const Progress = memo(
  forwardRef<View, ProgressProps>(
    (
      {
        value = 0,
        max = 100,
        variant = 'linear',
        showLabel = false,
        color = 'primary',
        indeterminate = false,
        style,
        labelStyle,
        testID,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();

      const isSemanticColor =
        typeof color === 'string' && color in theme.colors;
      const resolvedColor = isSemanticColor
        ? theme.colors[color as keyof typeof theme.colors]
        : color || theme.colors.primary;

      const styles = useMemo(
        () => getProgressStyles(theme, resolvedColor, variant),
        [theme, resolvedColor, variant],
      );

      const boundedValue = Math.min(Math.max(value, 0), max);
      const percentage = (boundedValue / max) * 100;

      const [animValue] = useState(
        () => new Animated.Value(indeterminate ? 0 : percentage),
      );

      useEffect(() => {
        if (indeterminate && variant === 'linear') {
          const loop = Animated.loop(
            Animated.sequence([
              Animated.timing(animValue, {
                toValue: 100,
                duration: 1500,
                useNativeDriver: false,
              }),
              Animated.timing(animValue, {
                toValue: 0,
                duration: 0,
                useNativeDriver: false,
              }),
            ]),
          );
          loop.start();
          return () => loop.stop();
        } else if (!indeterminate) {
          Animated.timing(animValue, {
            toValue: percentage,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      }, [percentage, indeterminate, variant, animValue]);

      if (variant === 'circular') {
        return (
          <View
            ref={ref}
            style={[styles.container, style]}
            testID={testID}
            {...rest}
          >
            <Text style={styles.label}>...</Text>
          </View>
        );
      }

      // Linear Progress
      const widthInterpolation = animValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const animatedStyle: any = indeterminate
        ? {
            width: '30%',
            transform: [
              {
                translateX: animValue.interpolate({
                  inputRange: [0, 100],
                  outputRange: [-100, 400],
                }),
              },
            ],
          }
        : {
            width: widthInterpolation,
          };

      return (
        <View style={style} testID={testID} ref={ref}>
          {showLabel && !indeterminate && (
            <View style={styles.row}>
              <Text style={[styles.label, styles.noMarginTop, labelStyle]}>
                {Math.round(percentage)}%
              </Text>
            </View>
          )}
          <View
            style={styles.container}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max, now: boundedValue }}
            {...rest}
          >
            <Animated.View style={[styles.bar, animatedStyle]} />
          </View>
        </View>
      );
    },
  ),
);

Progress.displayName = 'Progress';
export default Progress;
