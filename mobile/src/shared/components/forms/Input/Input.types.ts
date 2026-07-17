import { TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';

export type InputVariant = 'outlined' | 'filled' | 'underlined';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState =
  'default' | 'focused' | 'disabled' | 'error' | 'success' | 'readOnly';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** The value of the input for controlled components */
  value?: string;
  /** The default value for uncontrolled components */
  defaultValue?: string;
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message displayed below the input. Triggers error state if provided. */
  errorMessage?: string;
  /** Visual variant of the input */
  variant?: InputVariant;
  /** Size of the input */
  size?: InputSize;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is read-only */
  readOnly?: boolean;
  /** Component to render on the left side (e.g., icon) */
  leftAccessory?: React.ReactNode;
  /** Component to render on the right side (e.g., clear button, toggle password) */
  rightAccessory?: React.ReactNode;
  /** Force success state (e.g. green borders) */
  success?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom input style */
  inputStyle?: StyleProp<TextStyle>;
}
