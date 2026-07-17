import { StyleProp, ViewStyle, TextStyle, PressableProps } from 'react-native';

export type BadgeVariant = 'filled' | 'outlined' | 'soft' | 'ghost' | 'dot';

export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps extends Omit<PressableProps, 'style'> {
  /**
   * Text label for the badge
   */
  label?: string;

  /**
   * Numeric value or short string (usually 1-3 characters)
   */
  value?: string | number;

  /**
   * Visual variant style of the badge
   * @default 'filled'
   */
  variant?: BadgeVariant;

  /**
   * Semantic color role for the badge
   * @default 'primary'
   */
  color?: BadgeColor;

  /**
   * Size configuration of the badge
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Optional icon component to render before the text
   */
  icon?: React.ReactNode;

  /**
   * Shorthand to force 'dot' variant if true
   */
  dot?: boolean;

  /**
   * Shorthand to force 'outlined' variant if true
   */
  outlined?: boolean;

  /**
   * If true, uses a fully rounded (pill/circle) shape
   * @default true
   */
  rounded?: boolean;

  /**
   * If true, the badge becomes pressable and responsive to touch
   */
  pressable?: boolean;

  /**
   * Disables interaction and reduces opacity
   */
  disabled?: boolean;

  /**
   * Outer container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Text style
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Test identifier for e2e testing
   */
  testID?: string;
}
