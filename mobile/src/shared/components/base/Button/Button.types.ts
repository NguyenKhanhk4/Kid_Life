import { PressableProps, StyleProp, ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'text'
  | 'danger'
  | 'success'
  | 'warning';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** The text to display inside the button */
  title?: string;
  /** Custom children, overrides title if provided */
  children?: React.ReactNode;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Icon element to display on the left (future) */
  leftIcon?: React.ReactNode;
  /** Icon element to display on the right (future) */
  rightIcon?: React.ReactNode;
  /** Whether the button should stretch to fill its container */
  fullWidth?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom text style */
  textStyle?: StyleProp<TextStyle>;
}
