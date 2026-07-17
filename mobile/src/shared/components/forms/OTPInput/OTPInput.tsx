import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { OTPInputProps } from './OTPInput.types';
import { createStyles } from './OTPInput.styles';
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

const useTheme = (): AppTheme => {
  return {
    colors: lightColors,
    typography: textStyle,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spacing: { base: spacing, layout, safeArea: {} as any },
    radius: { base: radius, shape },
    opacity,
  } as AppTheme;
};

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  value,
  onChange,
  error = false,
  disabled = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, error, disabled);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChangeText = (text: string, index: number) => {
    if (disabled) return;
    const cleanText = text.replace(/[^0-9]/g, '');
    const newValue = value.split('');
    newValue[index] = cleanText.slice(-1);

    const stringValue = newValue.join('');
    onChange(stringValue);

    if (cleanText && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (disabled) return;
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newValue = value.split('');
      newValue[index - 1] = '';
      onChange(newValue.join(''));
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <View
            key={index}
            style={[
              styles.inputBox,
              focusedIndex === index && styles.inputBoxFocused,
            ]}
          >
            <TextInput
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              value={value[index] || ''}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              editable={!disabled}
              selectTextOnFocus
            />
          </View>
        ))}
    </View>
  );
};
