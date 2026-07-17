import React, { forwardRef, memo, useState, useCallback } from 'react';
import { TextInput, View } from 'react-native';
import { InputProps, InputState } from './Input.types';
import { createStyles } from './Input.styles';
import { Text } from '../../base/Text';
import {
  AppTheme,
  lightColors,
  textStyle,
  spacing,
  layout,
  radius,
  shape,
  opacity,
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
  } as AppTheme;
};

export const Input = memo(
  forwardRef<TextInput, InputProps>(
    (
      {
        value,
        defaultValue,
        placeholder,
        label,
        helperText,
        errorMessage,
        variant = 'outlined',
        size = 'md',
        disabled = false,
        readOnly = false,
        leftAccessory,
        rightAccessory,
        success = false,
        style,
        inputStyle,
        onFocus,
        onBlur,
        testID,
        accessibilityLabel,
        accessibilityHint,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();
      const [isFocused, setIsFocused] = useState(false);

      const handleFocus: NonNullable<InputProps['onFocus']> = useCallback(
        (e) => {
          setIsFocused(true);
          onFocus?.(e);
        },
        [onFocus],
      );

      const handleBlur: NonNullable<InputProps['onBlur']> = useCallback(
        (e) => {
          setIsFocused(false);
          onBlur?.(e);
        },
        [onBlur],
      );

      // Determine state
      let state: InputState = 'default';
      if (disabled) {
        state = 'disabled';
      } else if (errorMessage) {
        state = 'error';
      } else if (success) {
        state = 'success';
      } else if (readOnly) {
        state = 'readOnly';
      } else if (isFocused) {
        state = 'focused';
      }

      const { styles, placeholderTextColor } = createStyles(
        theme,
        variant,
        size,
        state,
      );

      const hasError = !!errorMessage;
      const displayHelperText = errorMessage || helperText;
      const helperColor = hasError
        ? 'error'
        : success
          ? 'success'
          : 'textSecondary';

      return (
        <View style={[styles.container, style]}>
          {label ? (
            <Text
              variant="labelMedium"
              color={disabled ? 'textDisabled' : 'textPrimary'}
              style={styles.label}
            >
              {label}
            </Text>
          ) : null}

          <View style={styles.inputContainer}>
            {leftAccessory ? (
              <View style={styles.leftAccessory}>{leftAccessory}</View>
            ) : null}

            <TextInput
              ref={ref}
              value={value}
              defaultValue={defaultValue}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              editable={!disabled && !readOnly}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[styles.input, inputStyle]}
              testID={testID}
              accessibilityLabel={accessibilityLabel || label}
              accessibilityHint={accessibilityHint || displayHelperText}
              accessibilityState={{ disabled }}
              {...rest}
            />

            {rightAccessory ? (
              <View style={styles.rightAccessory}>{rightAccessory}</View>
            ) : null}
          </View>

          {displayHelperText ? (
            <Text
              variant="bodySmall"
              color={helperColor}
              style={styles.helperText}
            >
              {displayHelperText}
            </Text>
          ) : null}
        </View>
      );
    },
  ),
);

Input.displayName = 'Input';
