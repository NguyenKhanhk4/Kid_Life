import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { AppTheme } from '@/theme/types';

export type ProgressVariant = 'linear' | 'circular';

export interface ProgressProps {
  /**
   * Current progress value
   * @default 0
   */
  value?: number;

  /**
   * Maximum progress value
   * @default 100
   */
  max?: number;

  /**
   * Visual variant of the progress indicator
   * @default 'linear'
   */
  variant?: ProgressVariant;

  /**
   * If true, displays a text label (e.g., "50%")
   * @default false
   */
  showLabel?: boolean;

  /**
   * Color of the progress bar (semantic token or hex)
   * @default 'primary'
   */
  color?: string | keyof AppTheme['colors'];

  /**
   * If true, renders an indeterminate loading animation
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for the label
   */
  labelStyle?: StyleProp<TextStyle>;

  /**
   * Test identifier
   */
  testID?: string;
}
