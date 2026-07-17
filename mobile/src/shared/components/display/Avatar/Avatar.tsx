import React, { forwardRef, memo, useState, useMemo } from 'react';
import { View, Pressable, Image, Text } from 'react-native';
import { AvatarProps } from './Avatar.types';
import { getAvatarStyles } from './Avatar.styles';
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

const getInitials = (name?: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar = memo(
  forwardRef<View, AvatarProps>(
    (
      {
        source,
        uri,
        name,
        initials: customInitials,
        size = 'md',
        variant = 'circle',
        border = false,
        borderColor,
        backgroundColor,
        placeholder,
        badge,
        online = false,
        disabled = false,
        pressable = false,
        onPress,
        style,
        imageStyle,
        testID,
        accessibilityRole,
        accessibilityLabel,
        accessibilityHint,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();
      const [imageError, setImageError] = useState(false);

      const styles = useMemo(
        () =>
          getAvatarStyles(
            theme,
            size,
            variant,
            disabled,
            border,
            borderColor,
            backgroundColor,
          ),
        [theme, size, variant, disabled, border, borderColor, backgroundColor],
      );

      const isPressable = pressable || !!onPress;
      const initials = customInitials || getInitials(name);

      const imageSource = useMemo(() => {
        if (source) return source;
        if (uri) return { uri };
        return null;
      }, [source, uri]);

      const renderContent = () => {
        if (imageSource && !imageError) {
          return (
            <Image
              source={imageSource}
              style={[styles.image, imageStyle]}
              onError={() => setImageError(true)}
              accessibilityIgnoresInvertColors
            />
          );
        }

        if (initials) {
          return <Text style={styles.text}>{initials}</Text>;
        }

        if (placeholder) {
          return placeholder;
        }

        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderInitial}>?</Text>
          </View>
        );
      };

      const renderAvatar = (pressed: boolean = false) => (
        <View style={[styles.wrapper, style]} testID={testID} ref={ref}>
          <View style={styles.content}>
            {renderContent()}
            {pressed && !disabled && (
              <View
                style={[styles.overlay, { opacity: theme.opacity.pressed }]}
              />
            )}
          </View>
          {online && (
            <View style={styles.indicatorContainer}>
              <View style={styles.indicator} />
            </View>
          )}
          {badge && <View style={styles.badgeContainer}>{badge}</View>}
        </View>
      );

      if (isPressable) {
        return (
          <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole={accessibilityRole || 'imagebutton'}
            accessibilityLabel={accessibilityLabel || name || 'Avatar'}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled }}
            {...rest}
          >
            {({ pressed }) => renderAvatar(pressed)}
          </Pressable>
        );
      }

      return (
        <View
          accessibilityRole={accessibilityRole || 'image'}
          accessibilityLabel={accessibilityLabel || name || 'Avatar'}
          accessibilityHint={accessibilityHint}
          {...rest}
        >
          {renderAvatar(false)}
        </View>
      );
    },
  ),
);

Avatar.displayName = 'Avatar';
export default Avatar;
