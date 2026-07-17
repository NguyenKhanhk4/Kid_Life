import React, { forwardRef, memo } from 'react';
import { Text as RNText } from 'react-native';
import { TextProps } from './Text.types';
import { createStyles } from './Text.styles';
import { AppTheme, lightColors, textStyle } from '@/theme';

// Temporary mock hook since Theme architecture is frozen and global useTheme is not yet implemented.
const useTheme = (): AppTheme => {
  return {
    colors: lightColors,
    typography: textStyle,
  } as AppTheme;
};

export const Text = memo(
  forwardRef<RNText, TextProps>(
    (
      {
        children,
        variant = 'bodyMedium',
        color = 'textPrimary',
        align = 'left',
        allowFontScaling = true,
        style,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();
      const styles = createStyles(theme, variant, color, align);

      return (
        <RNText
          ref={ref}
          allowFontScaling={allowFontScaling}
          style={[styles.text, style]}
          {...rest}
        >
          {children}
        </RNText>
      );
    },
  ),
);

Text.displayName = 'Text';
